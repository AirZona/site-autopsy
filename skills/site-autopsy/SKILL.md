---
name: site-autopsy
description: Audits any small business website and produces a brutal, prioritized fix list. Runs Lighthouse, axe-core accessibility checks, mobile vs desktop screenshot diff, and a niche-aware design critique. Use whenever the user asks to audit, review, grade, score, or critique a website, or asks "what's wrong with this site", "is this site any good", "how can I improve example.com", or pastes a URL and asks for feedback. Also use when the user mentions a small business website, prospect site, client site, lead site, or asks for a website audit, site review, or website report.
---

# site-autopsy

You are running the `site-autopsy` skill. Your job is to deliver ONE plaintext audit report. You are not having a conversation.

The flow is: run `audit.js` → read evidence + screenshots → write `findings.json` (structured content) → run `render.js` to format → paste the rendered output as your reply. The rendering step owns all formatting; you only own the content.

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

## STEP 4 — write `findings.json`

You produce **structured content**, not a formatted report. The renderer in STEP 5 owns every formatting decision (fence, indent, wrap, numbering). You don't have to think about any of that.

Write a file named `findings.json` next to the evidence — at `~/.local/share/site-autopsy/<domain>/findings.json` — with this exact shape:

```json
{
  "domain": "example.com",
  "niche": "<inferred niche>",
  "audited_at": "YYYY-MM-DD",
  "verdict": {
    "score": 7.1,
    "tagline": "<2-5 word summary>"
  },
  "leads_lost_estimate": "~10",
  "critical": [
    { "finding": "<full finding text, plain prose, no manual line breaks>", "fix": "<actionable one-liner, no \"Fix:\" prefix>" }
  ],
  "high": [
    { "finding": "<finding with the fix baked into the body>" }
  ],
  "medium": [
    { "finding": "<finding with the fix baked into the body>" }
  ],
  "design_notes": [
    "<niche-specific observation as a single string, plain prose>"
  ],
  "what_working": [
    "<genuine positive, single string. Empty array if nothing real to say.>"
  ]
}
```

**Content rules (the format is taken care of, focus on these):**
- `finding` and `fix` are plain prose. Do NOT insert `\n` line breaks — the renderer wraps for you.
- `fix` is only used on CRITICAL items. HIGH and MEDIUM bake the fix into `finding`.
- Score is a number with one decimal. Compute as: `(lighthouse_perf*0.2 + lighthouse_a11y*0.2 + lighthouse_seo*0.15 + lighthouse_bp*0.1 + design_score*0.35) / 10` where design_score is your 0-100 judgment from screenshots and niche profile.
- `leads_lost_estimate` is `~<N>` style. Severe issues → 15-25, moderate → 5-15, minor → 1-5.
- Don't pad CRITICAL. If only two issues are truly critical, ship two.
- `what_working` should be empty array `[]` if there's genuinely nothing real to say. Do NOT fabricate kindness.

## STEP 5 — render the report

```bash
node scripts/render.js ~/.local/share/site-autopsy/<domain>/findings.json
```

This emits the perfectly-formatted report to stdout, fence-wrapped and indent-perfect. **Paste the entire stdout into your response, exactly as printed, and nothing else.** No preamble, no outro, no "Here's the report:". The rendered output is the deliverable.

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
