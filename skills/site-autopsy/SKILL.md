---
name: site-autopsy
description: Audits any small business website and produces a brutal, prioritized fix list. Runs Lighthouse, axe-core accessibility checks, mobile vs desktop screenshot diff, and a niche-aware design critique. Use whenever the user asks to audit, review, grade, score, or critique a website, or asks "what's wrong with this site", "is this site any good", "how can I improve example.com", or pastes a URL and asks for feedback. Also use when the user mentions a small business website, prospect site, client site, lead site, or asks for a website audit, site review, or website report.
---

# site-autopsy

You are running the `site-autopsy` skill. Your job is to produce ONE markdown report in the exact format below. You are not having a conversation. You are producing a report.

**Format-of-truth:** the report must match `examples/example-plumbing-com.md` in structure, tone, line-wrapping, and bullet density. Read it once before drafting if you haven't seen it before.

## STEP 0 — confirm the URL

The user gave you a URL. If they didn't give you one, ask for it and stop.

The niche is inferred in STEP 2 once you have the title, meta description, and screenshots — don't guess from the URL alone.

## STEP 1 — run the audit script

Run the audit script. It does the heavy lifting (Lighthouse, axe, screenshots) and writes a JSON evidence bundle to disk.

```bash
node scripts/audit.js <URL>
```

The script outputs JSON to stdout AND writes `~/.local/share/site-autopsy/<domain>/evidence.json` plus screenshots in the same directory.

If the script fails (network error, site blocks bots, etc.), report what failed and stop. Do NOT make up data. Do NOT proceed without real evidence.

## STEP 2 — read the evidence

The evidence JSON contains:

- `lighthouse`: scores for performance, accessibility, best-practices, SEO, plus `fcp`, `lcp`, `tti`, `cls`, `tbt`, `total_byte_weight_kb`
- `lcp_element`: which DOM node was the LCP (selector + snippet) — usually the smoking gun for slow LCP
- `cls_offenders`: top elements that caused layout shift, with score
- `axe_violations`: accessibility violations with id, impact, help, and nodes_count
- `screenshots.mobile_path` / `screenshots.desktop_path`: file paths to PNG screenshots — read both
- `meta`: title, description, has_viewport, has_schema_org, has_favicon
- `forms`: detected `<form>` elements with field_count (no submission test)
- `images`: count, missing_alt, large_unoptimized, total_weight_kb
- `links`: broken_count, broken_samples (up to 5), has_click_to_call, phone_numbers
- `errors`: stages that failed — if non-empty, factor into the report

**Always read both screenshots** with your image-viewing capability before drafting. The mobile screenshot in particular is the source of half the findings. Look for:
- Where the primary CTA sits on mobile (above/below fold)
- Whether the hero photo is stock, AI-generated, illustration-only, or authentic (real people / real work)
- Whether reviews/testimonials/customer logos are visible above the fold
- Visual hierarchy problems (everything the same size, no clear next action)
- Niche-specific tells (see references/niche-profiles.md)

After looking at the screenshots and meta, **infer the niche** (plumbing, HVAC, dental, restaurant, salon, law, real estate, fitness, e-commerce, SaaS, agency, etc.) and state it in the report header. If it doesn't fit a profile, use GENERIC.

## STEP 3 — load the niche profile

```bash
cat references/niche-profiles.md
```

Find the section for the inferred niche. It tells you what buyers in that niche expect, what builds trust, and what's a red flag. Use it to inform the DESIGN NOTES section.

If the niche isn't in the file, use the GENERIC profile and note it.

## STEP 4 — write the report

**Your message body for this turn must follow this exact shape:**

1. First line: three backticks on their own line (opening fence).
2. Report content.
3. Last line: three backticks on their own line (closing fence).

Nothing before the opening fence. Nothing after the closing fence. No preamble like "Here is the report:". No outro like "Let me know if you want to dive deeper". The fences are not optional and are not just for "code-looking" content — the entire report lives inside them so it copy-pastes as plaintext into a Google Doc or sales email. If you skip the fences, the markdown renderer mangles the indentation and the report ships broken.

**Do not use any markdown inside the fence.** No `#` headings, no `**bold**`, no `-` bullets. The header line is literally `SITE AUTOPSY: <domain>`, not `# SITE AUTOPSY: <domain>`. The bullets are `·` (middle dot, U+00B7), not `-` or `*`. Indentation is significant — and it only renders correctly because it's inside a fence.

Do not add a preamble. Do not add a "let me know if you have questions" outro. Just the report.

**Match the example's formatting precisely:**
- Wrap finding bodies to ~65 chars per line, manually.
- Numbered findings begin with **two leading spaces** before the number — `  1.`, not `1.`. Continuation lines align under the first letter of the finding text (5-space indent from the left margin).
- **Only CRITICAL findings get an explicit `Fix:` line.** For HIGH and MEDIUM, bake the recommendation into the finding body — the example does not put `Fix:` on those.
- Blank line between numbered findings.
- DESIGN NOTES and WHAT'S WORKING bullets begin with two leading spaces, then `·`, then space, then text — `  · ...`. Multi-line bullets continue at 4-space indent.
- Numbering continues across CRITICAL / HIGH / MEDIUM (1, 2, 3 → 4, 5, 6 → 7, 8…), like the example.

If you find yourself writing `#`, `**`, or `-` anywhere in the report body, stop and reformat. The deliverable is monospaced plaintext that happens to live inside a fence.

```
SITE AUTOPSY: <domain>
Niche: <inferred niche> · Audited <YYYY-MM-DD>

VERDICT: <X.X> / 10 — <short tagline, 2-4 words>
Estimated monthly leads lost to UX issues: ~<N>

CRITICAL (fix this week)
  1. <Specific finding citing a real number from evidence or a specific
     visual observation from the screenshot. 2-4 lines of context
     explaining why it matters in this niche.>
     Fix: <actionable one-liner>

  2. ...

HIGH (fix this month)
  4. <Finding with the fix baked into the body, no `Fix:` line.>

  5. ...

MEDIUM (fix this quarter)
  7. <Finding with the fix baked into the body, no `Fix:` line.>

DESIGN NOTES (niche: <niche>)
  · <Niche-specific observation, can be multi-line. Reference the niche
    profile's expectations vs what the screenshot shows.>
  · <Another observation>

WHAT'S WORKING
  · <Genuine positive, multi-line OK. Skip the section entirely if there
    is nothing real to put here — don't fabricate kindness.>
```

## Scoring rules

- Verdict score is /10, one decimal. Compute as: `(lighthouse_perf*0.2 + lighthouse_a11y*0.2 + lighthouse_seo*0.15 + lighthouse_bp*0.1 + design_score*0.35) / 10`. The design score is your judgment 0-100 based on the screenshots and niche profile.
- "Estimated monthly leads lost" is a rough finger-in-the-air number. If their conversion-blocking issues are severe (no mobile CTA, broken form, sub-30 perf), say 15-25. If moderate, say 5-15. If minor, say 1-5. Always prefix with `~` to signal estimate.

## Severity rules

- **CRITICAL**: directly blocks conversions today. Broken contact form, mobile CTA not visible, page won't load on 4G, no phone number anywhere, security warning in browser.
- **HIGH**: significantly hurts conversions or SEO. LCP > 4s, no schema, missing meta description, no click-to-call, accessibility violations affecting screen readers.
- **MEDIUM**: cumulative quality issues. Image alt text, minor a11y, missing favicon, console errors, suboptimal heading hierarchy.

Do NOT pad the CRITICAL section to make the site look worse than it is. If there are only two critical issues, list two. Credibility is the entire product.

## LAW: no fabrication

Every numbered finding MUST cite a real number from the evidence JSON or a real observation from the screenshots. If you can't point to evidence, the finding doesn't go in the report. "The site looks slow" is not a finding. "LCP is 6.2s, hero image is 4.8MB unoptimized PNG" is a finding.

## LAW: niche-aware language

Don't say "your hero CTA should be more prominent" — that's generic. Say "plumbing buyers in Phoenix tap 'Call Now' on mobile 4x more than they fill out forms; your CTA is a contact form below the fold." The niche profile gives you the specifics.

## LAW: one report, no follow-up

Produce the report. Stop. Do not offer to "dive deeper into any section" or ask if they want to "see the full Lighthouse output." The report IS the deliverable. If they want more, they'll ask.

## STEP 5 — pre-flight checklist (do this before sending)

Before you emit anything, check your draft:

- [ ] First line is exactly three backticks. Last line is exactly three backticks.
- [ ] Header is `SITE AUTOPSY: <domain>` — no leading `#`.
- [ ] Each numbered finding starts with two spaces, then number, then dot, then space: `  1. `.
- [ ] Continuation lines on numbered findings start at column 6 (5 leading spaces) so they align under the first letter of the finding.
- [ ] Each `·` bullet starts with two spaces: `  · `.
- [ ] No `**bold**`, no `# headings`, no `- bullets` anywhere inside the fence.
- [ ] CRITICAL findings have a `Fix:` line; HIGH and MEDIUM do not.
- [ ] Numbering is continuous across CRITICAL → HIGH → MEDIUM (e.g. 1,2,3 then 4,5,6 then 7,8).

If any item fails, fix it before sending. The report is also the sales asset — formatting errors read as "the agency that wrote this isn't careful."
