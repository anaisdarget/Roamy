# Assets — status & TODO

## Available and integrated

### Photos (local, in `app/public/images/`)

| File | Origin | Status |
|---|---|---|
| `hero-calanque.jpg` | Wikimedia Commons — *Calanque de Sugiton, 2016* | ✅ integrated — verify attribution/licence on the Commons file page before launch |
| `hero-apero.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `hero-roadtrip.jpg` | Unsplash photo `photo-1469854523086-cc02fe5d8800` (Unsplash License) | ✅ integrated |
| `roadbook-costa-brava.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `dest-seville.jpg` | Wikimedia Commons — *Plaza de España (Sevilla) - 01* | ✅ integrated — verify attribution/licence |
| `dest-santorini.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `dest-bali.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `dest-split.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `day-born.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |
| `day-bogatell.jpg` | Stitch mockup (AIDA-generated URL) | ⚠️ rights to confirm / replace |

**Action before production:** replace the five AIDA-generated mockup photos with owned or properly licensed photography, or add the correct credits and licence links. Keep the same composition/mood.

### Fonts (self-hosted, `app/public/fonts/`)
- `Anton-Regular.ttf` — SIL Open Font License (Google Fonts).
- `Nunito-Variable.ttf` — SIL Open Font License (Google Fonts).

### Stickers
All stickers are original inline SVGs in `components/stickers/stickers.tsx`:
sun, sun spiral, palm, fish, hibiscus, lemon, wave, star, shell, shaka, surfboard, flower, squiggle.

### Generated assets
- `app/public/og-image.png` — social share image, generated from the brand system.
- `app/public/icon.svg` — favicon.
- Itinerary PDFs are generated at runtime and stored in the DB.

---

## Missing / recommended photo shoots

All placeholders are warm-toned and already sized for `next/image`. Replace with real editorial photos.

| Where | Suggested content | Format |
|---|---|---|
| Landing hero — polaroid 1 | Turquoise calanque, limestone cliffs, morning light, no people in foreground | 4:5 portrait |
| Landing hero — polaroid 2 | Two spritzes on a wooden table, sea + sunset bokeh | 4:5 portrait |
| Landing hero — polaroid 3 | Group of friends in an open car / van, coastal road, laughing | 4:5 portrait |
| Landing roadbook preview | Whitewashed Mediterranean village, bougainvillea, sea view | 3:2 landscape |
| Destinations grid | One strong vertical per destination: Séville, Santorin, Bali, Split | 3:4 portrait |
| Itinerary day 1 | Narrow old-town alley, warm stone, late afternoon sun | 3:2 landscape |
| Itinerary day 2 | Beach club / chiringuito, straw umbrellas, turquoise water | 3:2 landscape |
| Itinerary days 3–5 | Local food, rooftop sunset, hidden cove, market scene | 3:2 landscape |
| Testimonials (future) | Real customer portraits or UGC, warm and casual, with signed consent | 1:1 square |
| Email hero | Same as polaroid 2 (cocktails + sea) for instant summer recognition | 1200×480 |
| PDF cover | No photo required — typographic cover with brand shapes | — |

### Placeholder policy
The app currently uses the mockup photos everywhere. If an image is missing or fails, the UI falls back to a warm blush block (`bg-blush`) rather than a broken image icon. Destination autocomplete entries without a photo use a coloured monogram (no broken images).

---

## Attribution block to add before launch

```
Photos : Wikimedia Commons (Calanque de Sugiton ; Plaza de España, Séville),
Unsplash (road trip). Autres visuels : banque d'images Roamy / AIDA.
Polices : Anton & Nunito Sans, SIL Open Font License.
```

> Reminder: do not use any third-party brand logo, trademark, or unlicensed editorial photo.
