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
  axe_violations: [],
  screenshots: {},
  meta: {},
  forms: [],
  images: { count: 0, total_weight_kb: 0, unoptimized_count: 0 },
  links: { broken_count: 0, has_click_to_call: false, phone_numbers: [] },
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
  evidence.lighthouse = {
    performance: Math.round(cats.performance.score * 100),
    accessibility: Math.round(cats.accessibility.score * 100),
    best_practices: Math.round(cats['best-practices'].score * 100),
    seo: Math.round(cats.seo.score * 100),
    fcp: lhResult.lhr.audits['first-contentful-paint']?.numericValue,
    lcp: lhResult.lhr.audits['largest-contentful-paint']?.numericValue,
    tti: lhResult.lhr.audits['interactive']?.numericValue,
    cls: lhResult.lhr.audits['cumulative-layout-shift']?.numericValue,
    tbt: lhResult.lhr.audits['total-blocking-time']?.numericValue,
  };
} catch (err) {
  evidence.errors.push({ stage: 'lighthouse', message: err.message });
}

// 2. Playwright: screenshots, axe, meta, forms, images, links
const browser = await chromium.launch();
try {
  // Mobile
  const mobileCtx = await browser.newContext({ ...devices['iPhone 14'] });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const mobilePath = path.join(outDir, 'mobile.png');
  await mobilePage.screenshot({ path: mobilePath, fullPage: false });
  evidence.screenshots.mobile_path = mobilePath;

  // Desktop
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

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

  // Meta
  evidence.meta = {
    title: await desktopPage.title(),
    description: await desktopPage.getAttribute('meta[name="description"]', 'content'),
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
