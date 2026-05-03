#!/usr/bin/env node
/**
 * site-autopsy report renderer
 *
 * Usage: node render.js <path-to-findings.json>
 *
 * Reads structured findings JSON and emits a perfectly-formatted
 * plaintext report to stdout, wrapped in a triple-backtick fence.
 *
 * The skill writes findings.json with raw content; this script owns
 * every formatting decision (fence, indent, wrap, numbering).
 */

import fs from 'fs/promises';
import path from 'path';

const WIDTH = 70;
const NUM_PREFIX = '  ';      // before "1."
const NUM_CONT = '     ';      // continuation under finding text (5 spaces)
const FIX_PREFIX = '     ';    // "Fix:" line indent (5 spaces)
const BULLET = '  · ';
const BULLET_CONT = '    ';    // continuation under bullet text (4 spaces)

function wrapLines(text, firstPrefix, contPrefix, width = WIDTH) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = firstPrefix;
  let onFirst = true;
  for (const w of words) {
    const candidate = line.length === firstPrefix.length || line.length === contPrefix.length
      ? line + w
      : line + ' ' + w;
    if (candidate.length <= width) {
      line = candidate;
    } else {
      lines.push(line);
      line = (onFirst ? contPrefix : contPrefix) + w;
      onFirst = false;
    }
  }
  if (line.trim()) lines.push(line);
  return lines;
}

function renderNumberedFinding(n, item, includeFixLine) {
  const head = `${NUM_PREFIX}${n}. `;
  const cont = NUM_CONT;
  const out = wrapLines(item.finding, head, cont);
  if (includeFixLine && item.fix) {
    const fixLines = wrapLines(`Fix: ${item.fix}`, FIX_PREFIX, FIX_PREFIX);
    out.push(...fixLines);
  }
  return out.join('\n');
}

function renderBullet(text) {
  return wrapLines(text, BULLET, BULLET_CONT).join('\n');
}

function renderSection(title, items, startNum, includeFixLine) {
  if (!items || items.length === 0) return null;
  const lines = [title];
  items.forEach((item, i) => {
    if (i > 0) lines.push('');
    lines.push(renderNumberedFinding(startNum + i, item, includeFixLine));
  });
  return lines.join('\n');
}

function renderBulletSection(title, items) {
  if (!items || items.length === 0) return null;
  return [title, ...items.map(renderBullet)].join('\n');
}

function renderReport(f) {
  const score = Number(f.verdict?.score).toFixed(1);
  const date = f.audited_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const blocks = [];

  blocks.push(`SITE AUTOPSY: ${f.domain}`);
  blocks.push(`Niche: ${f.niche} · Audited ${date}`);
  blocks.push('');
  blocks.push(`VERDICT: ${score} / 10 — ${f.verdict?.tagline ?? ''}`);
  blocks.push(`Estimated monthly leads lost to UX issues: ${f.leads_lost_estimate ?? '~?'}`);
  blocks.push('');

  let n = 1;
  const critical = renderSection('CRITICAL (fix this week)', f.critical, n, true);
  if (critical) {
    blocks.push(critical);
    n += f.critical.length;
    blocks.push('');
  }
  const high = renderSection('HIGH (fix this month)', f.high, n, false);
  if (high) {
    blocks.push(high);
    n += f.high.length;
    blocks.push('');
  }
  const medium = renderSection('MEDIUM (fix this quarter)', f.medium, n, false);
  if (medium) {
    blocks.push(medium);
    n += f.medium.length;
    blocks.push('');
  }

  const design = renderBulletSection(`DESIGN NOTES (niche: ${f.niche})`, f.design_notes);
  if (design) {
    blocks.push(design);
    blocks.push('');
  }
  const working = renderBulletSection("WHAT'S WORKING", f.what_working);
  if (working) blocks.push(working);

  // Trim trailing empty lines, then wrap in fence
  while (blocks.length && blocks[blocks.length - 1] === '') blocks.pop();
  const body = blocks.join('\n');
  return '```\n' + body + '\n```';
}

const findingsPath = process.argv[2];
if (!findingsPath) {
  console.error('Usage: node render.js <findings.json>');
  process.exit(1);
}

const findings = JSON.parse(await fs.readFile(findingsPath, 'utf8'));
const report = renderReport(findings);
const reportPath = path.join(path.dirname(findingsPath), 'report.md');
await fs.writeFile(reportPath, report + '\n');

// Print the report to stdout for piping / debugging, then announce the path on stderr.
// The skill reads the path from stderr (or just constructs it) and uses report.md as
// the canonical deliverable — pasting through the model's reply tends to lose the
// fence and indentation.
console.log(report);
console.error(`\nReport written to: ${reportPath}`);
