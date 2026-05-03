#!/usr/bin/env node
/**
 * site-autopsy audit script
 *
 * Usage: node audit.js <URL>
 *
 * Outputs JSON to stdout AND writes:
 *   ~/.local/share/site-autopsy/<domain>/evidence.json
 *   ~/.local/share/site-autopsy/<domain>/mobile.png
 *   ~/.local/share/site-autopsy/<domain>/desktop.png
 */

import { chromium, devices } from 'playwright';
import lighthouse from 'lighthouse';
import { launch as launchChrome } from 'chrome-launcher';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node audit.js <URL>');
  process.exit(1);
}

const domain = new URL(url).hostname.replace(/^www\./, '');
const outDir = path.join(os.homedir(), '.local', 'share', 'site-autopsy', domain);
await fs.mkdir(outDir, { recursive: true });

const evidence = {
  url,
  domain,
  audited_at: new Date().toISOString(),
  lighthouse: null,
  lcp_element: null,
  cls_offenders: [],
  axe_violations: [],
  screenshots: {},
  meta: {},
  forms: [],
  images: { count: 0, missing_alt: 0, large_unoptimized: 0, total_weight_kb: 0 },
  links: { broken_count: 0, broken_samples: [], has_click_to_call: false, phone_numbers: [] },
  errors: [],
};

// 1. Lighthouse
try {
  const chrome = await launchChrome({ chromeFlags: ['--headless=new', '--no-sandbox'] });
  const lhResult = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
  });
  await chrome.kill();

  const cats = lhResult.lhr.categories;
  const audits = lhResult.lhr.audits;
  evidence.lighthouse = {
    performance: Math.round(cats.performance.score * 100),
    accessibility: Math.round(cats.accessibility.score * 100),
    best_practices: Math.round(cats['best-practices'].score * 100),
    seo: Math.round(cats.seo.score * 100),
    fcp: audits['first-contentful-paint']?.numericValue,
    lcp: audits['largest-contentful-paint']?.numericValue,
    tti: audits['interactive']?.numericValue,
    cls: audits['cumulative-layout-shift']?.numericValue,
    tbt: audits['total-blocking-time']?.numericValue,
    total_byte_weight_kb: Math.round((audits['total-byte-weight']?.numericValue ?? 0) / 1024),
  };

  // LCP element: which DOM node was the largest paint
  const lcpItems = audits['largest-contentful-paint-element']?.details?.items ?? [];
  const lcpNode = lcpItems[0]?.node ?? lcpItems[0]?.items?.[0]?.node;
  if (lcpNode) {
    evidence.lcp_element = {
      selector: lcpNode.selector,
      snippet: lcpNode.snippet,
      node_label: lcpNode.nodeLabel,
    };
  }

  // CLS offenders: which elements shifted
  const clsItems = audits['layout-shift-elements']?.details?.items ?? [];
  evidence.cls_offenders = clsItems.slice(0, 5).map(it => ({
    selector: it.node?.selector,
    node_label: it.node?.nodeLabel,
    score: it.score,
  }));

  // Image total weight (bytes saved if served as modern formats is a useful proxy)
  const modernImagesItems = audits['modern-image-formats']?.details?.items ?? [];
  const imageBytes = modernImagesItems.reduce((sum, it) => sum + (it.totalBytes ?? 0), 0);
  if (imageBytes > 0) evidence.images.total_weight_kb = Math.round(imageBytes / 1024);
} catch (err) {
  evidence.errors.push({ stage: 'lighthouse', message: err.message });
}

// Navigate to a page tolerantly: try networkidle first, fall back to load.
// Some marketing sites have chat widgets / analytics that never let the
// network go idle, which would otherwise time out the whole audit.
async function safeGoto(page, target) {
  try {
    await page.goto(target, { waitUntil: 'networkidle', timeout: 20000 });
  } catch {
    await page.goto(target, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);
  }
}

// 2. Playwright: screenshots, axe, meta, forms, images, links
const browser = await chromium.launch();
try {
  // Mobile
  const mobileCtx = await browser.newContext({ ...devices['iPhone 14'] });
  const mobilePage = await mobileCtx.newPage();
  await safeGoto(mobilePage, url);

  const mobilePath = path.join(outDir, 'mobile.png');
  await mobilePage.screenshot({ path: mobilePath, fullPage: false });
  evidence.screenshots.mobile_path = mobilePath;

  // Desktop
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  await safeGoto(desktopPage, url);

  const desktopPath = path.join(outDir, 'desktop.png');
  await desktopPage.screenshot({ path: desktopPath, fullPage: false });
  evidence.screenshots.desktop_path = desktopPath;

  // axe-core on desktop
  const axeResults = await new AxeBuilder({ page: desktopPage }).analyze();
  evidence.axe_violations = axeResults.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    nodes_count: v.nodes.length,
  }));

  // Meta. Use $() + nullsafe getAttribute so missing tags don't auto-wait/timeout
  // (page.getAttribute on a non-existent selector blocks for the full default
  // timeout and then throws, killing the rest of the Playwright pass).
  const descEl = await desktopPage.$('meta[name="description"]');
  evidence.meta = {
    title: await desktopPage.title(),
    description: descEl ? await descEl.getAttribute('content') : null,
    has_viewport: !!(await desktopPage.$('meta[name="viewport"]')),
    has_schema_org: !!(await desktopPage.$('script[type="application/ld+json"]')),
    has_favicon: !!(await desktopPage.$('link[rel*="icon"]')),
  };

  // Forms
  const forms = await desktopPage.$$('form');
  for (const form of forms) {
    const inputs = await form.$$('input, textarea, select');
    evidence.forms.push({ field_count: inputs.length });
  }

  // Images
  const imgData = await desktopPage.evaluate(() => {
    const imgs = Array.from(document.images);
    return {
      count: imgs.length,
      missing_alt: imgs.filter(i => !i.alt).length,
      large_unoptimized: imgs.filter(i => i.naturalWidth > 1920).length,
    };
  });
  evidence.images = { ...evidence.images, ...imgData };

  // Click-to-call
  const telLinks = await desktopPage.$$('a[href^="tel:"]');
  evidence.links.has_click_to_call = telLinks.length > 0;
  for (const tel of telLinks) {
    const href = await tel.getAttribute('href');
    if (href) evidence.links.phone_numbers.push(href.replace('tel:', ''));
  }

  // Broken-link sweep (bounded, same-origin only, HEAD with GET fallback)
  const hrefs = await desktopPage.evaluate(() =>
    Array.from(new Set(
      Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.href)
        .filter(h => /^https?:/.test(h))
    ))
  );
  const origin = new URL(url).origin;
  const sameOrigin = hrefs.filter(h => h.startsWith(origin)).slice(0, 30);
  const checks = await Promise.allSettled(sameOrigin.map(async h => {
    const probe = async (method) => {
      const res = await fetch(h, { method, redirect: 'follow', signal: AbortSignal.timeout(8000) });
      return res.status;
    };
    let status;
    try { status = await probe('HEAD'); }
    catch { status = await probe('GET'); }
    if (status === 405 || status === 501) status = await probe('GET');
    return { href: h, status };
  }));
  for (const c of checks) {
    if (c.status === 'fulfilled' && c.value.status >= 400) {
      evidence.links.broken_count++;
      if (evidence.links.broken_samples.length < 5) {
        evidence.links.broken_samples.push(c.value);
      }
    }
  }

  await mobileCtx.close();
  await desktopCtx.close();
} catch (err) {
  evidence.errors.push({ stage: 'playwright', message: err.message });
} finally {
  await browser.close();
}

// 3. Write evidence file and emit to stdout
const evidencePath = path.join(outDir, 'evidence.json');
await fs.writeFile(evidencePath, JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ ...evidence, evidence_path: evidencePath }, null, 2));
