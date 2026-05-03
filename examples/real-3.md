```
SITE AUTOPSY: example-bakery.com
Niche: Bakery / Sandwich Shop · Audited 2026-05-03

VERDICT: 7.1 / 10 — great photos, no phone, slider hero
Estimated monthly leads lost to UX issues: ~10

CRITICAL (fix this week)
  1. There is no phone number, hours, or address visible anywhere on
     the homepage. The audit found zero tel: links and the screenshots
     show only logo + search + hamburger in the header. A hungry
     mobile visitor on a "where do I eat in twenty minutes" decision
     cannot call, cannot tell if you are open, cannot see how far away
     you are. Restaurant-niche convention is hours/address/phone in
     the header on every page; this site has none of them on the
     homepage.
     Fix: add a top utility bar with today's hours ("Open today
     11am-9pm"), the address, and a tappable phone number. On mobile,
     make the phone a sticky tap target — a hungry shopper should be
     one tap from calling, not three taps deep into the contact page.

  2. LCP at 7.43s on mobile, with the LCP element being a slick.js
     carousel slide (three pagination dots visible at the bottom of
     the hero). The food photo itself is excellent; the slider it is
     wrapped in is the entire performance problem. The restaurant
     niche profile flags carousel heroes specifically — nobody waits
     to see slide two of a sandwich photo when they are hungry, and
     the carousel adds JS, layout thrash, and slow LCP for zero
     conversion lift.
     Fix: kill the carousel. Pick the single strongest food shot,
     serve it as a static AVIF/WebP image with fetchpriority="high",
     cap the width at the actual rendered size. LCP will fall under
     2.5s and the hungry shopper will actually see the sandwich on the
     first paint.

  3. axe-core flags one critical aria-allowed-attr violation plus two
     serious aria-hidden-focus and one serious aria-input-field-name
     violation. The accessibility score is 70/100, the weakest score
     on the site by a wide margin. For a restaurant whose lunch
     demographic skews older, the menu and search interface need to
     actually work with screen readers — and the aria-input-field-name
     issue is almost certainly the search field in the header, the
     single most-used input on the site.
     Fix: open Lighthouse a11y or axe DevTools, work through the four
     flagged nodes one at a time. The search-field name and the
     focusable aria-hidden elements are usually a 30-minute fix once
     located. Then run axe in CI so the next regression is caught at
     build time.

HIGH (fix this month)
  4. No schema.org markup detected. Restaurant schema (with menu,
     hours, address, telephone, priceRange, servesCuisine) is the way
     Google surfaces a restaurant in the local pack with rich results
     — hours, photos, reservation buttons, the lot. Without it, you
     are a blue link competing with Yelp and TripAdvisor for your own
     brand name. Add JSON-LD with Restaurant + Menu + LocalBusiness
     types; this is one of the single highest-leverage SEO moves
     available to a small restaurant.

  5. The hero text "LOCALLY OWNED AND OPERATED SINCE 1998…" is
     overlaid in white caps on the sandwich photo and the bottom of
     the paragraph runs off-screen on mobile (the screenshot shows
     "DAII…" truncated). Hero copy that is hard to read fails its job;
     hero copy that is also truncated is failing twice. Replace with
     one crisp line — "[City]'s best sandwiches since 1998 · Order
     online" — and move the descriptive paragraph below the fold.

  6. No reviews, Yelp star rating, or social-proof badge above the
     fold. "Locally owned since 1998" is a real trust signal but the
     restaurant niche convention is a visible review count next to the
     order CTA — for food, the photo gets you to consider, the reviews
     get you to commit. A "4.5★ on Google · 1,200 reviews" badge near
     the order button moves the conversion needle measurably.

  7. Title tag is "Home | [Bakery Name]." For a local restaurant the
     title should include the city and the category — "[Bakery Name] |
     [City] Bakery & Sandwich Shop | Locally Owned Since 1998" — both
     because Google weights it heavily and because tab text on mobile
     shows the title only. "Home |" is wasted real estate that nobody
     searches for.

MEDIUM (fix this quarter)
  8. One of nine images is missing alt text. Trivial cleanup; the
     meaningful a11y wins are the four axe violations above. Patch the
     alt while you are in the file fixing those.

  9. Total page weight is 2.6MB on a mobile profile. Food photography
     appropriately dominates here (food photos sell) but the slider is
     loading three full hero images instead of one. Killing the
     carousel — already in CRITICAL #2 — also cuts hero weight by ~60%
     for free.

  10. The "ORDER ONLINE" button is a vertical tab on the right edge of
     the desktop layout. It works but it is an unusual placement that
     scrolls out of view, and the highest-intent action on the page
     deserves a sticky position (bottom-right or top-right corner) so
     it is always one tap away regardless of scroll depth.

DESIGN NOTES (niche: Bakery / Sandwich Shop)
  · Photography is excellent. Real sandwiches, real lighting, no stock
    — this is the single thing small restaurants most often get wrong,
    and getting it right is why anyone reading the homepage
    instinctively wants lunch. Do not change the photographer; the
    food is doing selling work that copy usually has to do alone.
  · Hero carousel is explicitly a restaurant-niche red flag in the
    niche profile. Three sandwich slides means the visitor sees one
    sandwich, then either waits or interacts to see the next — but a
    hungry shopper does neither. They scroll. You are paying
    performance and accessibility cost for a feature your customer is
    not using.
  · Phone / hours / address absence from the header is the single
    worst pattern in this niche profile. Restaurant decisions happen
    fast and on mobile. A hungry visitor needs to know "are you open"
    and "what's the phone" inside two taps; right now they have to dig
    into MENU or CATERING. The conversion cost of this is real and
    recurring, every lunchtime.
  · Top nav (HOME, MENU, CATERING, BAKERY, BREAD MILL, GOODS & GIFT
    CARDS, CAREERS) is mixing primary actions (MENU, ORDER) with deep
    merchandising items (GIFT CARDS, BREAD MILL). Lunch shoppers want
    MENU and ORDER first; the secondary items belong inside a
    hamburger or footer drawer.

WHAT'S WORKING
  · The food photography is the foundation everything else can be
    built on. The hero sandwich shot and the featured-item shot are
    both real, well-lit, and appetite-triggering — the single hardest
    thing for a small restaurant site to get right, and you have it.
  · Meta description is well-written and on-brand: "Locally owned and
    operated since 1998, we offer a variety of hand-crafted breads,
    delicious sandwiches…" Reads like a human wrote it, includes the
    trust signal, and is roughly the only meta description on this
    audit batch that does not need a rewrite.
  · Best-practices score is 100/100 — HTTPS, no console errors, no
    deprecated APIs, no mixed content. Whatever CMS is underneath, it
    is serving correctly. The site has no security or hygiene
    problems; every issue called out above lives in the content and
    configuration layer above the platform.
```
