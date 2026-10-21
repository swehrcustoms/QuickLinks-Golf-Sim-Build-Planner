# Claude Prompt: Quick Links Golf "Build Your Sim" Configurator

Copy everything below the line into Claude. Fill in the `[BRACKETED]` items first (or attach your price list / product spreadsheet) for the best result.

---

You are a senior front-end engineer and conversion-focused UX designer. Build a step-by-step, interactive golf simulator configurator for **Quick Links Golf** (https://www.quicklinksgolf.com), a Minnesota-based company that designs, builds, and installs custom golf simulators (showrooms in Minneapolis and Omaha; service area: Minnesota, Iowa, Western Wisconsin, and the Dakotas; 300+ custom installs; authorized dealer for Trackman, Foresight, Uneekor, ProTee, TruGolf, and Carl's Place).

## Reference model
Model the flow on the guided "build your own" configurator pattern used by golf-enclosure retailers (e.g., Carl's Place DIY builder): a left step rail, a center options panel, a live visual preview on the right, and a running total that updates as the customer chooses. Use that as a UX pattern only. All branding, copy, imagery, and code must be original to Quick Links Golf.

## Key difference from a retail cart
Quick Links is primarily an **install and consult** business, not just an online store. The configurator's job is to:
1. Get the customer excited and educated with a realistic preview of their space.
2. Give a **ballpark price range** (equipment + estimated installation), not just a cart total.
3. Capture a **qualified lead** that drops straight into Quick Links' existing 3-step process: Project Call → Consult (dial in tech and room needs) → Delivery or Install.
4. Offer a secondary **"DIY Package / Ship to My Door"** path for customers who want to install it themselves.

## Layout
- **Left rail:** numbered steps with checkmarks as each is completed. Steps can be clicked to jump back and edit.
- **Center panel:** the options for the current step, with a short, friendly intro line per step (confident, local, golf-pro voice; light humor is OK). Each option card shows name, one-line benefit, price (or "Included" / "Quoted"), and a "More info" expander.
- **Right panel:** live preview of the room and simulator. Toggle between 3D and 2D, with Top / Front / Left / Right views and a "Show Dimensions" overlay. A golfer figure scales with the golfer's height and flips for left- vs. right-handed.
- **Sticky footer/side:** "Estimated Total" (show a range, e.g., $X–$Y installed), "Build Summary," and a "Need Help? Talk to a Quick Links pro" link.
- Fully responsive. On mobile, the preview collapses to the top and the steps become a horizontal stepper.

## Steps

### Step 1 — Your Space
- **Space type** (cards): Dedicated Room / Basement, Garage, Custom Home (new build or remodel), Large Space / Warehouse ("Pro Bay").
- **Room dimensions:** sliders plus number inputs in inches for Height (96"–180"), Width (96"–300"), Depth (180"–360").
- **Stance:** Right-handed, Left-handed, or Both (multiple golfers). "Both" should push toward center-hitting layouts and camera/overhead monitors that handle lefties and righties.
- **Golfer height:** slider 48"–84" (default 72").
- **Project stage** (Quick Links-specific): "Space is finished," "Under construction / walls still open," "Just planning." If under construction, show a callout about electrical, data, and projector placement before drywall.
- **Validation and guidance:** use Quick Links' published guidance. Ideal is about 10'6" H × 16' W × 22' L. Workable minimum is about 8'6" H × 12' W × 16' L, depending on swing. Garages need 9'+ ceilings. Show a green / yellow / red "space fit" indicator, and compute a recommended max ceiling clearance from golfer height (driver swing arc ≈ golfer height × 1.5; make this formula easy to tune).

### Step 2 — Screen System
- **System type:** Full Custom Built-In Room (installed by Quick Links), Enclosure Kit (freestanding), Retractable Screen (garages), Pro Bay pipe-frame system (large spaces), Screen Only (install my own way).
- **Enclosure dimensions:** auto-sized from the room dimensions (leave a configurable side and top clearance), with sliders to override. Show the **viewable screen area** separately from the frame size, plus an aspect-ratio readout (16:9, 4:3, 16:10, custom).
- **Screen material tiers:** [YOUR SCREEN OPTIONS + PRICES]
- **Room finishes (installed builds):** wall padding / acoustic panels, side netting, ceiling baffle, light-blocking curtains, color and style choices. [YOUR OPTIONS + PRICES]

### Step 3 — Launch Monitor and Software
- Product grid with **Sort** (price, popularity) and **Filters**: technology (Photometric/Camera vs. Radar), placement (floor vs. overhead), lefty + righty friendly, indoor only, price range.
- Brands Quick Links installs: Trackman, Foresight, Uneekor, ProTee, TruGolf, plus others you carry. [YOUR MODEL LIST + PRICES]
- Include a short educational callout drawn from Quick Links' FAQ: camera/photometric systems are generally more accurate indoors, because radar has very little ball flight to measure in a short room.
- Compatibility logic: mounts and accessories shown should depend on the monitor selected. Overhead units require a minimum ceiling height. Radar units require a minimum depth behind the ball. Grey out incompatible items and say why.
- **Software sub-section:** show included software per monitor and offer add-ons (e.g., GSPro, E6, TGC, FSX) where compatible. [YOUR SOFTWARE LIST]
- Always include **"Bring My Own Launch Monitor."**

### Step 4 — Hitting Area and Putting
- **Hitting mats** grouped by brand and size, flagged single-hitting vs. center-hitting (center-hitting is auto-recommended when stance = Both). [YOUR MATS + PRICES]
- **Putting turf / full-room turf** (a Quick Links differentiator: "true putting turf that rolls like a putt should"), with square-footage pricing calculated from room dimensions. [PRICE PER SQ FT]
- Accessories: tees, screen-safe balls, club holders, etc.
- "Bring My Own Mat" option.

### Step 5 — Projector and Display
- Projector grid with filters (resolution 1080p/4K, lumens, short-throw, laser vs. lamp). [YOUR PROJECTORS + PRICES]
- **Throw-distance check:** using the screen's viewable width and the room depth, calculate whether each projector can fill the screen from a ceiling-mount position, and flag ones that can't.
- Projector mount options and "Bring My Own Projector."

### Step 6 — PC and Tech (Quick Links-specific)
- Gaming PC tiers matched to the chosen software and resolution (Good / Better / Best), or "I'll supply my own."
- Extras: audio and speakers, TV or side monitor, Wi-Fi/network drop, lighting.
- If project stage = under construction, list the **pre-drywall checklist** (outlets, ceiling power for projector, HDMI/USB runs, data drops) and offer it as a downloadable PDF.

### Step 7 — Install Option and Build Summary
- **Fulfillment choice:** Full Quick Links Installation (show estimated install range by space type and service region), Delivery + Assisted Setup, or Ship to My Door (DIY).
- Out-of-area ZIP codes (outside MN, IA, Western WI, ND, SD) get "Ship to My Door" only, or a "contact us for travel install" note.
- **Financing teaser:** "As low as $X/mo" with a link to https://www.quicklinksgolf.com/financing. [FINANCING TERMS]
- **Summary:** every selection grouped by step, each with an Edit link, equipment subtotal, install estimate, and total estimated range.
- **Primary CTA:** "Book My Free Project Consult." This opens a form that matches Quick Links' existing fields: First name*, Last name*, Phone*, Email*, City/State, Size of your space (auto-filled from Step 1), How did you hear about us?, plus a **photo upload** of the space. The full build configuration is attached to the lead.
- **Secondary CTAs:** "Share My Build" (unique URL that restores the configuration), "Download Build PDF," and "Add DIY Package to Cart" (only when Ship to My Door is selected).

## Data and logic
- Drive all products, prices, compatibility rules, and copy from **one editable JSON or CMS collection** so staff can update the catalog without touching code. Provide the schema: id, step, category, brand, name, blurb, price, priceType (fixed | perSqFt | quoted | included), image, specs, compatibility rules, and tags.
- Pricing engine: equipment subtotal + install estimate (base by space type + modifiers for padding, turf sq ft, ceiling-mount work, travel zone) → display as a range (±[X]%).
- Persist build state in the URL (for sharing) and in local storage (so a refresh doesn't lose progress).
- Analytics events: step_viewed, option_selected, build_completed, consult_requested, build_shared. Each step should be measurable as a funnel stage.

## Platform
The site runs on **Wix**. Deliver the configurator as one of these (recommend one and explain why):
- (a) a self-contained HTML/JS/CSS app embeddable via a Wix Custom Element or HTML iframe, posting leads to Wix Forms/CRM via a Wix Velo backend function or webhook; or
- (b) a Wix Velo page using Wix CMS collections for the catalog.

For the 3D preview, use Three.js (or React Three Fiber) with simple parametric geometry: room box, enclosure frame, screen plane, mat, a golfer silhouette, and a projector cone. Keep it lightweight and fast on mobile. Fall back to the 2D SVG plan view if WebGL is unavailable.

## Brand and voice
- Match Quick Links Golf branding: [PRIMARY / ACCENT COLORS, FONTS, LOGO FILE]. Use a clean, premium look with a golf-green accent.
- Tagline to weave in: "Where the course is closer than you think."
- Voice: expert local golf pros who make choosing a sim easy. "Most people aren't sure where to start — that's where we come in."

## Deliverables
1. A short plan: architecture, file structure, data schema, and Wix integration approach.
2. Working code for the full configurator, with sample catalog data using placeholder prices clearly marked `TODO_PRICE`.
3. The sample products JSON and instructions for editing it.
4. Wix embed and lead-routing instructions, step by step, for a non-developer.
5. A QA checklist: responsive breakpoints, compatibility edge cases (low ceiling + overhead monitor, lefty + single-hitting mat, short room + long-throw projector), and form submission.

Before writing code, ask me any clarifying questions you need about pricing, install-estimate rules, product lineup, and branding. Then build it step by step.
