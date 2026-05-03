# site-autopsy

> Point it at any small business website. Get back the brutal, specific, prioritized fix list a $500/hr agency would charge you for. Free. In about 60 seconds.

```
/plugin marketplace add AirZona/site-autopsy
/plugin install site-autopsy@site-autopsy
```

## What it does

You paste a URL. `site-autopsy` runs a real audit — Lighthouse scores, mobile vs desktop screenshot diff, top accessibility violations, broken-promise check (does the hero CTA actually work?), and a design-vibe critique tuned to the niche (plumber, dentist, HVAC, restaurant, salon, etc.). Then it writes you the one-page report you'd send to a prospect, with prioritized fixes and the rough dollar value of each.

It is the skill version of the workflow I run before every sales call at my agency.

## Why I built it

I run [AgileRocket](https://agilerocket.com), a small web agency. The first 20 minutes of every prospect call used to be the same: open Lighthouse, screenshot mobile, eyeball the hero, click the contact form, count the carousel slides, sigh. I'd type the same five paragraphs of feedback into a Google Doc and send it over.

I got tired of typing the same five paragraphs. I extracted the workflow. This is it.

If you do agency work, freelance web dev, or just want to know how badly your own site is doing, this is for you.

## What you get

A single markdown report. Looks like this (real output, redacted client):

```
SITE AUTOPSY: example-plumbing.com
Niche: residential plumbing · Audited 2026-05-02

VERDICT: 4.2 / 10 — leaking leads
Estimated monthly leads lost to UX issues: ~18

CRITICAL (fix this week)
  1. Mobile hero CTA is below the fold on iPhone 14. 73% of your traffic
     is mobile. You're asking visitors to scroll before they can call you.
     Fix: pin the "Call Now" button to the top.
  2. Contact form takes 8.4s to submit. Two visitors abandoned during
     the test session. Probable cause: synchronous reCAPTCHA + slow host.
  3. Lighthouse Performance: 31/100. Largest Contentful Paint: 6.2s.
     Hero image is 4.8MB unoptimized PNG.

HIGH (fix this month)
  4. No schema markup. Google can't tell you serve Phoenix.
  5. Phone number not click-to-call on mobile.
  6. 7 images missing alt text.
  ...

DESIGN NOTES (niche: plumbing)
  · Hero photo is a stock image of a wrench. Plumbing buyers trust
    photos of real techs in real uniforms. Swap it.
  · No reviews above the fold. Plumbing is a trust purchase.
  · Logo is centered. Plumbing/trades convention is left-aligned —
    feels more "established business," less "DIY blog."
```

See the full report: [examples/example-plumbing-com.md](examples/example-plumbing-com.md).

You can run it on a prospect's site, screenshot the report, and send it as a sales asset. That's the use case.

## Install

**Claude Code:**
```bash
/plugin marketplace add AirZona/site-autopsy
/plugin install site-autopsy@site-autopsy
```

**Manual:**
```bash
git clone https://github.com/AirZona/site-autopsy ~/.claude/skills/site-autopsy
```

Then in Claude Code:
```
/site-autopsy https://example.com
```

## What's under the hood

- **Playwright** for real headless-browser rendering, mobile + desktop
- **Lighthouse CLI** for performance/SEO/best-practices scores
- **axe-core** for accessibility violations
- **Claude** for the design critique, the niche-aware nuance, and the report writing

Everything runs locally. No data leaves your machine except the URL you pass to Lighthouse and the screenshots Claude looks at.

## Roadmap

- [x] v0.1 — single-URL audit, markdown report
- [ ] v0.2 — competitor comparison mode (`/site-autopsy yoursite.com vs competitor.com`)
- [ ] v0.3 — niche profiles for the top 20 small-business categories
- [ ] v0.4 — batch mode (CSV in, reports out)
- [ ] v0.5 — auto-detect niche from page content

## Built by

[AgileRocket](https://agilerocket.com) — we redesign small business websites for a living. If you'd rather we just fix the issues this skill flags, [hit us up](https://agilerocket.com).

## License

MIT. Use it, fork it, ship it. PRs welcome.
