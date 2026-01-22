# Nomad Wynwood — Content Model

> Generated: January 21, 2026
> Organization: spherical-hospitality (4a8061e8-ea3e-4b95-8c30-9143a8f7e803)

## Three-Tier Content Architecture

### Tier 1: Global Content Types (3)

Site-wide configuration with exactly one entry each.

| Content Type | Slug | Purpose |
|--------------|------|---------|
| Site Settings | `site-settings` | Logo, contact info, social links, hours |
| Navigation | `navigation` | Menu links, CTA button |
| Footer | `footer` | Footer columns, newsletter, copyright |

### Tier 2: Component Content Types (8)

Reusable building blocks from Figma components.

| Content Type | Slug | Purpose | Expected Entries |
|--------------|------|---------|------------------|
| Hero Section | `hero-section` | Page heroes (3 variants) | ~7 (one per page) |
| Content Section | `content-section` | Half-screen sections | ~10-15 |
| Gallery | `gallery` | Image galleries (up to 8 images) | ~3 |
| Instagram Feed | `instagram-feed` | Instagram section (4 images) | 1 |
| FAQ Item | `faq-item` | FAQ questions/answers | ~15-20 |
| Event | `event` | Programming/events | ~6 |
| Menu Category | `menu-category` | Restaurant menu categories | ~8-10 |
| Award | `award` | Press/awards recognition | ~6 |

### Tier 3: Page Content Type (1)

| Content Type | Slug | Purpose |
|--------------|------|---------|
| Page | `page` | References component entries |

---

## Field Patterns

### Individual MEDIA Fields for Images

All image collections use individual MEDIA fields (NOT JSON arrays):

```
image1, image1Alt, image2, image2Alt, ... image8, image8Alt
```

This enables:
- Media picker in CMS admin
- Image preview
- CDN validation
- Inline editor support

### JSON for Link Arrays

JSON fields are used for non-image arrays:
- `menuLinks` - Navigation links
- `socialLinks` - Social media links
- `items` - Menu items (text only)
- `sections` - Page section references

---

## Entry Slug Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Global | `global-{name}` | `global-settings`, `global-navigation` |
| Hero | `hero-{page}` | `hero-homepage`, `hero-menu` |
| Section | `section-{page}-{name}` | `section-homepage-intro` |
| Gallery | `gallery-{name}` | `gallery-homepage` |
| Page | `{page-name}` | `home`, `menu`, `about` |

---

## Content Type IDs (Local)

```
site-settings:   c675b32e-649c-4c6b-94db-cb57224d1a9b
navigation:      4744dd96-44f1-42e1-8b42-f7e437db2d35
footer:          1ac54fb2-fed8-49d8-b483-2c1d6c1a9eff
hero-section:    f568e78c-1037-40d3-8a65-4f52685a1eb2
content-section: bd2974d6-39ad-44bc-8beb-ee4b5c25811c
gallery:         7e05102c-b270-45bd-8a34-e402d63e7852
instagram-feed:  53f450dc-916c-4618-9388-e2b6cf05ab2e
faq-item:        1cf0fa5e-59b3-46dc-9ea2-a45aee6b2ac3
event:           23d0f666-0a0e-465f-80ba-6cf396c2447c
menu-category:   3a4388ed-9fb2-4351-ba40-0c4d05c4b804
award:           4db4496a-a5d8-4300-ad60-fba0202b2a7e
page:            54d15929-4f6a-4939-9423-338d7f9fd21f
```

---

## Global Content Entries (Phase 6)

| Content Type | Entry Slug | ID |
|--------------|------------|-----|
| site-settings | `global-settings` | 3db16075-f42e-4463-8d32-b832aa1a8ece |
| navigation | `global-navigation` | 70ecfeb2-46fb-45c4-b04b-3f3cd4543625 |
| footer | `global-footer` | 556cad9c-cd16-4487-aa63-d1a22d0113dc |
| instagram-feed | `global-instagram` | 05046022-214c-46eb-912b-6bfd6f5238f8 |

---

## Page Content Entries (Phase 8)

### Hero Sections

| Slug | Page | Variant |
|------|------|---------|
| `hero-homepage` | Homepage | split-screen |
| `hero-menu` | Menu | split-screen |
| `hero-programming` | Programming | full-screen |
| `hero-private-events` | Private Events | full-screen |
| `hero-about` | About | full-screen |
| `hero-getting-here` | Getting Here | full-screen |
| `hero-faq` | FAQ | text-only |
| `hero-404` | 404 | text-only |

### Content Sections

| Slug | Page | Variant |
|------|------|---------|
| `section-homepage-intro` | Homepage | text-only |
| `section-homepage-menu` | Homepage | text-only |
| `section-homepage-events` | Homepage | image-right |
| `section-homepage-contact` | Homepage | image-left |
| `section-about-story` | About | text-only |

### Galleries

| Slug | Page |
|------|------|
| `gallery-homepage` | Homepage |

### Events

| Slug | Title |
|------|-------|
| `event-jazz-night` | Live Jazz Night |
| `event-wine-dinner` | Winemaker Dinner |
| `event-valentines` | Valentine's Day Prix Fixe |

### FAQ Items

| Slug | Question |
|------|----------|
| `faq-reservations` | How do I make a reservation? |
| `faq-dress-code` | Is there a dress code? |
| `faq-parking` | Is parking available? |
| `faq-dietary` | Do you accommodate dietary restrictions? |
| `faq-private-events` | Can I host a private event? |

### Pages

| Slug | URL | Title |
|------|-----|-------|
| `home` | `/` | Home |
| `menu` | `/menu` | Menu |
| `programming` | `/programming` | Programming |
| `private-events` | `/private-events` | Private Events |
| `about` | `/about` | About |
| `getting-here` | `/getting-here` | Getting Here |
| `faq` | `/faq` | FAQ |
| `404` | `/404` | 404 |

---

### Site Settings Content

```json
{
  "siteName": "NoMad Wynwood",
  "phone": "+1-877-666-2312",
  "email": "info@nomadwynwood.com",
  "address": {"street": "280 NW 27th St", "city": "Miami", "state": "FL", "zip": "33127"},
  "instagramHandle": "@nomadwynwood",
  "reservationUrl": "https://resy.com/cities/mia/nomad-wynwood",
  "hours": [
    {"days": "Tue-Fri", "open": "11 AM", "close": "10 PM"},
    {"days": "Sat-Sun", "open": "12 PM", "close": "10 PM"},
    {"days": "Mon", "closed": true}
  ]
}
```

### Navigation Content

```json
{
  "menuLinks": [
    {"label": "Home", "href": "/"},
    {"label": "Menu", "href": "/menu"},
    {"label": "Private Events", "href": "/private-events"},
    {"label": "Programming", "href": "/programming"},
    {"label": "About", "href": "/about"}
  ],
  "ctaText": "Reserve a Table",
  "ctaUrl": "https://resy.com/cities/mia/nomad-wynwood"
}
```

### Footer Content

```json
{
  "column1Links": [
    {"label": "THE NOMAD BAR"},
    {"label": "280 NW 27th St, Miami, FL 33127"}
  ],
  "column2Links": [
    {"label": "Tue-Fri 11 AM — 10 PM"},
    {"label": "Sat-Sun 12 PM — 10 PM"},
    {"label": "Mon (Closed)"}
  ],
  "column3Links": [
    {"label": "Gift Cards", "url": "/gift-cards"},
    {"label": "Contact us", "url": "/contact"},
    {"label": "FAQ", "url": "/faq"}
  ],
  "legalLinks": [
    {"label": "accessibility", "url": "/accessibility"},
    {"label": "Terms & Conditions", "url": "/terms"},
    {"label": "Privacy policy", "url": "/privacy"},
    {"label": "careers", "url": "/careers"}
  ],
  "copyrightText": "Copyright © 2025"
}
```
