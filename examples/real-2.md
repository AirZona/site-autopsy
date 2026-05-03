```
SITE AUTOPSY: example-dental.com
Niche: Dental Practice · Audited 2026-05-03

VERDICT: 7.5 / 10 — great SEO, broken hero, faceless dentist
Estimated monthly leads lost to UX issues: ~8

CRITICAL (fix this week)
  1. LCP measured at 15.10s on mobile (Lighthouse Performance 51, FCP
     10.45s). The smoking gun is one HTML attribute: the hero <img
     class="Hero-image"> has loading="lazy" set on it. Lazy-loading
     the LCP element is a textbook Core Web Vitals anti-pattern — it
     tells the browser to deprioritize the single most-important paint
     on the page. For an anxious dental shopper comparing five
     practices, fifteen seconds of blank brown background is an
     automatic back-button.
     Fix: remove loading="lazy" from the Hero-image and replace it
     with fetchpriority="high". This single attribute change alone
     will likely pull LCP from 15s to under 3s — no other code change
     required.

  2. Meta description is "Home | [Practice Name]" —
     literally the page title duplicated. Google ignores duplicates
     and synthesizes a snippet from page text instead, which means
     zero control over what appears in the search result. For a local
     dental practice the search snippet IS the ad you serve to anxious
     researching patients, and losing that surface to a meaningless
     echo of the title is throwing free traffic away.
     Fix: write a 150-character description with the lead dentist's
     name, the geo modifier, and a hook. Example: "Dr. [Name] ·
     [Practice Name] · Tucson · accepting new patients ·
     most PPO plans accepted · book online or call (XXX) XXX-XXXX."

  3. The lead dentist is not named or pictured above the fold. The
     hero photo shows a generic-looking family group (could be stock,
     could be staff, no caption identifies anyone). Dental shoppers
     are anxious — the single biggest trust signal in this niche is
     seeing the specific person who will be in their mouth, with a
     name and credentials. "Comprehensive care for your overall
     wellness" with no human attached is undifferentiated wallpaper.
     Fix: replace the generic hero copy with the lead dentist's
     headshot, name, and credentials (e.g., "Dr. [Name], DDS — gentle
     dentistry for anxious patients · 22 years in Tucson"). Move the
     family-group photo lower on the page if you want to keep it.

HIGH (fix this month)
  4. No insurance information visible above the fold. Insurance is a
     top-three concern for dental shoppers, right behind pain and
     price. The dental-niche convention is to surface accepted plans
     (Delta Dental, BCBS, Cigna, Aetna) as a small logo strip near the
     hero. Visitors who see their insurance accepted convert
     noticeably higher than those who have to call to ask, and "do you
     take Delta?" is the single most common pre-call question.

  5. Hero headline ("Comprehensive care for your overall wellness")
     plus subhead ("You deserve a healthy, beautiful smile…") could
     appear unchanged on roughly 10,000 dental-practice homepages. For
     a researching shopper comparing five practices, generic copy is
     invisible. Replace with one specific differentiator: gentle
     dentistry, sedation available, sliding-scale fees, network
     endorsement, 30 years in Tucson — whatever is actually true and
     unusual.

  6. CLS at 0.094 is borderline (Google's "good" cutoff is 0.10). One
     more font-swap shift or one hero image without intrinsic
     dimensions and the page tips into "needs improvement," which
     directly affects local-pack ranking for dental searches. Lock
     down the hero image's width/height attributes and audit the
     @font-face strategy for layout-shift on swap.

  7. axe-core flags a serious frame-title violation (almost certainly
     the Live Chat iframe) plus moderate landmark-one-main and region
     issues across 28 nodes. The Live Chat iframe with no title
     attribute is announced as "frame" by screen readers — useless.
     Older / vision-impaired patients are a real demographic for a
     dental practice; this is a real conversion path you are blocking.

  8. No "new patient special" or starting-price information visible
     anywhere above the fold. Dental-niche convention is a
     $99-cleaning-and-x-ray special or similar visible hook for
     first-time visitors. Even if you do not discount, surfacing a
     starting price for cleanings or a financing option ("CareCredit
     accepted") is a tiebreaker for shoppers comparing five practices
     on a Tuesday afternoon.

MEDIUM (fix this quarter)
  9. Two of thirteen images are missing alt text. Small site, small
     fix — about ten minutes of work. The bigger a11y wins are the
     iframe title and the landmark issues above; these alts are the
     cleanup pass.

  10. Total page weight is 2.0MB on a mobile profile. The hero image
     alone is the heaviest element on the page; once you fix the
     lazy-loading bug above, the next pass is converting it to AVIF
     and capping the served width at the actual rendered size. That
     alone realistically claws back 30-40% of bytes.

  11. Title tag is "Home | [Practice Name]" — fine for
     hygiene but the "Home |" prefix is wasted real estate that no
     shopper searches for. Replace with something like "[Practice
     Name] | Tucson Dentist | Dr. [Name], DDS" — every character of
     the title is an SEO surface and "Home" is not earning its keep.

DESIGN NOTES (niche: Dental Practice)
  · Trust signals the dental niche profile expects above the fold:
    doctor's photo + name + credentials, insurance accepted,
    new-patient special, reviews, years in practice. The site has
    reviews (4.6★ visible but small) and arguably the photo. Missing:
    doctor's name, credentials, insurance, specials, years. The hero
    is currently doing one of five expected jobs.
  · Color palette (warm browns, sage greens, cream) is calming and
    on-niche — exactly what an anxious dental shopper wants to see. Do
    not change this; it is one of the things this site is doing better
    than most. The problem is what the palette is wrapped around
    (generic copy, faceless dentist), not the palette itself.
  · Sticky mobile bottom bar with "Call Us | Schedule with Us" is a
    strong conversion pattern for anxious shoppers who scroll while
    deciding. Most small-practice sites do not bother. Keep it; the
    conversion infrastructure is genuinely good — what is missing is
    just the content that would make a shopper want to use it.
  · A network-membership badge ("Member of [Network] · endorsed by
    [Affinity Group]") sits in a horizontal bar competing with the
    hero rather than living inside it. Network endorsements are a real
    differentiator for the over-50 dental demographic — promote it
    next to the dentist's name in the hero once you add one ("Dr.
    [Name], DDS · [Network]-endorsed practice") so it earns its rent.

WHAT'S WORKING
  · Real human photo in the hero (a family group rather than stock
    teeth on a black background) — matches niche convention even
    though it could be more specific. Most small dental sites still
    lead with a close-up of a tooth or a stock smile; you don't, and
    that's a meaningful unforced advantage.
  · SEO score is 100/100. Schema.org markup is present, viewport and
    favicon are set, the title is meaningful, there are no broken
    links, and the URL structure is clean. The technical SEO
    foundation here is genuinely excellent — fixing the meta
    description and the hero LCP attribute gets you to
    top-of-local-pack territory with no rebuild required.
  · Live Chat is wired up on every screen, with a sticky mobile
    call-and-schedule bar underneath. For a niche where the most
    common pre-call question is "do you take Delta?", the chat option
    is a real conversion win that matches what anxious shoppers
    actually do (compare while distracted, ask a quick question,
    decide later).
```
