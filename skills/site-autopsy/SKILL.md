---
name: site-autopsy
description: Audits any small business website and produces a brutal, prioritized fix list. Runs Lighthouse, axe-core accessibility checks, mobile vs desktop screenshot diff, and a niche-aware design critique. Use whenever the user asks to audit, review, grade, score, or critique a website, or asks "what's wrong with this site", "is this site any good", "how can I improve example.com", or pastes a URL and asks for feedback. Also use when the user mentions a small business website, prospect site, client site, lead site, or asks for a website audit, site review, or website report.
---

# site-autopsy

You are running the `site-autopsy` skill. Your job is to produce ONE markdown report in the exact format below. You are not having a conversation. You are producing a report.

## STEP 0 — confirm the URL

The user gave you a URL. If they didn't give you one, ask for it and stop.

If they gave you a URL but didn't specify a niche, infer the niche from the homepage content (plumbing, HVAC, dental, restaurant, salon, law, real estate, fitness, e-commerce, SaaS, etc.). State the inferred niche in the report header.

## STEP 1 — run the audit script

Run the audit script. It does the heavy lifting (Lighthouse, axe, screenshots) and writes a JSON evidence bundle to disk.

```bash
node scripts/audit.js <URL>
```

The script outputs JSON to stdout AND writes `~/.local/share/site-autopsy/<domain>/evidence.json` plus screenshots in the same directory.

If the script fails (network error, site blocks bots, etc.), report what failed and stop. Do NOT make up data. Do NOT proceed without real evidence.

## STEP 2 — read the evidence

The evidence JSON contains:

- `lighthouse`: scores for performance, accessibility, best-practices, SEO
- `axe_violations`: array of accessibility violations with severity
- `screenshots.mobile_path` and `screenshots.desktop_path`: file paths
- `meta`: title, description, viewport tag presence, schema.org presence
- `forms`: detected forms with field counts and submission test results
- `images`: count, total weight, unoptimized count
- `links`: broken link count, click-to-call presence
- `cls_offenders`, `lcp_element`, `fcp`, `tti`: core web vitals detail

Read the screenshots using your image-viewing capability. Look for:
- Where the primary CTA sits on mobile (above/below fold)
- Whether the hero photo is stock, AI-generated, or authentic
- Whether reviews/testimonials are visible above the fold
- Visual hierarchy problems (everything the same size, no clear next action)
- Niche-specific tells (see references/niche-profiles.md)

## STEP 3 — load the niche profile

```bash
cat references/niche-profiles.md
```

Find the section for the inferred niche. It tells you what buyers in that niche expect, what builds trust, and what's a red flag. Use it to inform the DESIGN NOTES section.

If the niche isn't in the file, use the GENERIC profile and note it.

## STEP 4 — write the report

Use this exact template. Do not deviate from the structure. Do not add a preamble. Do not add a "let me know if you have questions" outro. Just the report.

```
SITE AUTOPSY: <domain>
Niche: <inferred niche> · Audited <YYYY-MM-DD>

VERDICT: <X.X> / 10 — <one-line summary>
Estimated monthly leads lost to UX issues: ~<N>

CRITICAL (fix this week)
  1. <Specific issue with concrete number from evidence>
     Fix: <actionable one-liner>
  2. ...
  3. ...

HIGH (fix this month)
  4. ...
  5. ...
  6. ...

MEDIUM (fix this quarter)
  7. ...
  ...

DESIGN NOTES (niche: <niche>)
  · <Niche-specific observation>
  · <Niche-specific observation>
  · ...

WHAT'S WORKING
  · <One or two genuine positives if they exist. Skip section if nothing.>
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
