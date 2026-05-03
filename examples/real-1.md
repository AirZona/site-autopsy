```
SITE AUTOPSY: example-plumbing.com
Niche: Residential Plumbing · Audited 2026-05-03

VERDICT: 6.5 / 10 — phone is right, everything else is dated
Estimated monthly leads lost to UX issues: ~12

CRITICAL (fix this week)
  1. LCP measured at 11.03s on mobile (Lighthouse Performance 71). The
     LCP element is
     /wp-content/themes/design/images/slider-plumber.png with
     alt="guy" — a stock illustration of a generic plumber serving as
     the hero. For a service business where most traffic arrives one
     ad-click away from clicking back, an eleven-second hero is paid
     traffic walking out the door.
     Fix: replace the stock illustration with a real photo of the
     owner/team in branded uniforms, serve via WebP at the actual
     rendered width, and add fetchpriority="high" — the rest of the
     page loads fine, this one image is the entire problem.

  2. The hero illustration is a stock cartoon plumber. Plumbing is a
     trust purchase made under stress (water on the floor); buyers
     hire the company that LOOKS like real people who will actually
     show up. Stock art signals "lead-gen middleman," not "the local
     plumber I should call." The local competitor that wins your
     Google ad slot is leading with a photo of an actual person in an
     actual branded shirt.
     Fix: swap the cartoon for a phone snapshot of the owner in a
     branded company shirt next to the truck. It does not need to be
     a professional shoot — authentic beats polished, and authentic
     crushes stock.

  3. Zero reviews, star rating, or review count visible above the
     fold. The Licensed/Bonded/Insured badge is above the fold (good)
     but those are table stakes — every legit plumber has them. For a
     stranger choosing between three plumbers in three browser tabs,
     the deciding signal is the Google star count, and yours is
     invisible from the homepage.
     Fix: pull a Google review badge with the star average and review
     count ("4.9★ on Google · 142 reviews") into the hero next to the
     phone number. If the count is under 50, send a review-request
     text to your last 100 customers this week.

HIGH (fix this month)
  4. No meta description set on the homepage (the audit returned
     null). Google synthesizes a snippet from page text instead, which
     means zero control over what shows in the search result — and the
     search result IS the ad for a local service. Write a
     150-character description that includes "Phoenix plumber,"
     "licensed," and a call-to-action like "Call (XXX) XXX-XXXX for
     same-day service."

  5. No schema.org markup detected. LocalBusiness + Plumber schema
     tells Google your service area, hours, phone, and rating in a
     structured way that surfaces in the local pack. Without it, you
     compete nationally for "plumber" instead of locally for "plumber
     Phoenix" — the local 3-pack is roughly 5x more valuable than
     blue-link results for trades. Add JSON-LD with LocalBusiness,
     areaServed, telephone, openingHours, and aggregateRating.

  6. axe-core flags a critical button-name violation (a button with no
     discernible text — likely the mobile menu toggle), nine serious
     color-contrast failures, and a serious frame-title issue. The
     button-name issue means a screen-reader user literally cannot
     navigate the site. Run axe in CI and treat critical/serious as
     release blockers.

  7. No favicon set. Cosmetic but signals "site was never finished" —
     when a buyer has three plumbers open in tabs, the unbranded tab
     is the one they close first. Trivial 5-minute fix that shifts the
     perceived professionalism noticeably.

MEDIUM (fix this quarter)
  8. Total page weight is 3.2MB on a mobile profile. Hero slider,
     copper-pipe background, service-tile icons — every image deserves
     a second pass: WebP/AVIF, sized to the rendered dimensions,
     lazy-loaded below the fold. Realistically claws back 60-70% of
     bytes and pulls LCP under 2.5s on its own.

  9. Hero subhead reads "OUR SERVICES — We provide a variety of
     quality and affordable plumbing services." That sentence appears
     on roughly half the plumbing sites on the internet. Replace with
     concrete services and starting prices: "Drain cleaning from $99 ·
     Water-heater installs · Re-pipes · 24/7 emergencies." Specifics
     convert; generics scroll past.

  10. tel: link href is malformed (audit captured "//XXX-XXX-XXXX" —
     looks like tel://XXX-... instead of tel:XXX-...). Most modern
     browsers tolerate it, some older ones do not, and screen readers
     may announce it weirdly. One-character fix in the template.

DESIGN NOTES (niche: Residential Plumbing)
  · Niche convention is real photos of real techs in branded uniforms.
    The stock cartoon is the most common single mistake on
    small-plumber sites and the easiest single thing to beat. A phone
    snapshot of the owner next to the company truck, holding a wrench,
    will outperform a $500 stock illustration on every metric you care
    about.
  · Service area is not named in the hero. Plumbing buyers Google
    "plumber Glendale" and "plumber Scottsdale" as separate searches;
    you need to name the towns you serve. A line like "Serving
    Phoenix, Glendale, Scottsdale, Tempe & Mesa" under the headline
    captures long-tail traffic Google otherwise sends to your
    competitors.
  · No 24/7 or same-day badge in the hero. For an emergency-driven
    niche this is the single biggest decision-maker — a visitor with a
    flooding bathroom will scroll past three plumbers to find the one
    that says "same-day." If it is true for you, it belongs above the
    fold next to the phone number.
  · Three carousel slides on the homepage. Universally documented:
    nobody reads slide 2. Pick the one strongest message and hold it;
    the carousel is currently splitting its own attention three ways.

WHAT'S WORKING
  · "Call Now: (XXX) XXX-XXXX" is large, sits at the top of the mobile
    viewport, and the tel: link fires correctly. This is the single
    most important conversion element on a plumbing site and you got
    it right — most sites in this niche bury the phone number behind a
    hamburger.
  · Licensed/Bonded/Insured badge above the fold. Real trust signal
    for trades that many small-plumber sites bury in the footer. The
    hierarchy here (logo → phone → license badge) is correct; what is
    missing is just the review count next to it.
  · CLS of 0.02 — essentially zero layout shift. Whatever theme this
    is, the layout itself is stable; the speed problems are entirely
    image-weight, not architecture. That means LCP is fixable in an
    afternoon, not a rebuild.
```
