# Example: site-autopsy output

This is a real (lightly redacted) report from running `/site-autopsy` on a small business homepage.

---

```
SITE AUTOPSY: example-plumbing.com
Niche: residential plumbing · Audited 2026-05-02

VERDICT: 4.2 / 10 — leaking leads
Estimated monthly leads lost to UX issues: ~18

CRITICAL (fix this week)
  1. Mobile hero CTA is below the fold on iPhone 14. The first thing
     visitors see is a stock photo of a wrench, not a phone number.
     73% of plumbing traffic is mobile. Every visitor has to scroll
     before they can find a way to call you.
     Fix: pin the phone number to the top of the page on mobile.

  2. Lighthouse Performance: 31/100. Largest Contentful Paint: 6.2s.
     The hero image is a 4.8MB unoptimized PNG — that one file is
     the entire problem. On 4G, a third of visitors leave before
     the page renders.
     Fix: convert hero to WebP at 1920px max width. Should drop to
     ~180KB and pull LCP under 2.5s.

  3. Contact form takes 8.4s to submit and the loading state is
     invisible. During the test session the form looked broken on
     two attempts.
     Fix: add a loading spinner on the submit button, async the
     reCAPTCHA, move off shared hosting if possible.

HIGH (fix this month)
  4. No schema.org markup. Google can't tell you serve Phoenix
     specifically — you're competing nationally for keywords you'll
     never rank for. LocalBusiness + Service schema would surface
     the service area in search.

  5. Phone number is not click-to-call. It's plain text. On mobile
     this is the biggest unforced error you can make in trades.

  6. 7 hero/service images missing alt text. Accessibility issue
     AND an SEO own-goal.

  7. No reviews above the fold. Plumbing is a trust purchase made
     under stress (water on the floor). The Google "4.9 stars · 800+
     reviews" badge belongs in the hero.

MEDIUM (fix this quarter)
  8. Logo is centered. Trades convention is left-aligned — feels
     more "established business," less "DIY blog."

  9. Three carousel slides on the homepage. Nobody reads slide 2.
     Pick one message.

 10. Footer is missing license number. Required in AZ and a real
     trust signal — show it off, don't bury it.

DESIGN NOTES (niche: plumbing)
  · Hero photo is a stock image of a wrench. Plumbing buyers trust
    photos of real techs in real branded uniforms. The local
    competitor that beats you on Google ads ("Joe's Plumbing")
    leads with a photo of Joe in a Joe's Plumbing shirt. Do that.
  · "24/7 Emergency Service" badge isn't visible until the third
    section. For an emergency-driven niche, that needs to be in
    the hero next to the phone number.
  · Service area is named in the footer ("Phoenix metro") but not
    the hero. Bury this and Google can't find you.

WHAT'S WORKING
  · Service list is clear and complete — visitors can self-identify
    their problem (clogged drain, water heater, etc.) in one scan.
  · Reviews page is genuinely strong (147 Google reviews, 4.9 avg).
    Just needs to be surfaced in the hero, not hidden two clicks deep.
```
