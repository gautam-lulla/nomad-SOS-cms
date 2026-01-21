# NoMad Wynwood - Design System Tokens

> Extracted from Figma: https://www.figma.com/design/bGCUY43jJhcFUafm33ncgW/Nomad-Wynwood

---

## Table of Contents
1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Breakpoints](#breakpoints)
5. [Components](#components)
6. [Pages](#pages)

---

## Colors

### Surface Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color/surface/background-default` | `#0e0e0e` | Primary dark background |
| `--color/surface/background-highlight` | `#f07aaa` | Pink accent background (footer) |
| `--color/surface/button-default` | `#f6f4eb` | Default button/link color |
| `--color/surface/button-hover` | `#f07aaa` | Hover state for buttons/links |
| `--color/surface/stroke-light` | `#f6f4eb` | Light border/stroke color |

### Typography Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color/typography/headings` | `#f6f4eb` | Heading text on dark backgrounds |
| `--color/typography/body` | `#f6f4eb` | Body text on dark backgrounds |
| `--color/typography/body-invert` | `#0e0e0e` | Body text on light backgrounds |

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--off-white-100` | `#f6f4eb` | Primary off-white/cream |
| `--neutral/black` | `#000000` | Pure black |
| `--neutral/neutral-30` | `#cccccc` | Light gray |
| `--neutral/neutral-50` | `#666666` | Medium gray |
| `--neutral/neutral-90` | `#191919` | Dark gray |

### Color Palette Summary
| Color Name | Hex | RGB | Preview |
|------------|-----|-----|---------|
| Dark Background | `#0e0e0e` | `rgb(14, 14, 14)` | Dark charcoal |
| Off White / Cream | `#f6f4eb` | `rgb(246, 244, 235)` | Warm cream |
| Pink Accent | `#f07aaa` | `rgb(240, 122, 170)` | Vibrant pink |
| Black | `#000000` | `rgb(0, 0, 0)` | Pure black |
| Dark Gray | `#191919` | `rgb(25, 25, 25)` | Near black |
| Medium Gray | `#666666` | `rgb(102, 102, 102)` | 50% gray |
| Light Gray | `#cccccc` | `rgb(204, 204, 204)` | Light gray |

---

## Typography

### Font Families
| Token | Font | Style | Usage |
|-------|------|-------|-------|
| `--typography/font-family/h2` | Sabon | Regular | H2 headings |
| `--typography/font-family/h3` | Sabon | Regular, Italic | H3 headings |
| `--typography/font-family/h5` | Gotham | Bold | H5 headings, footer links |
| `--typography/font-family/body` | Sabon | Regular | Body copy |
| `--typography/font-family/cta` | Gotham | Bold | Call-to-action buttons |
| `--typography/font-family/menu-link` | Sabon | Regular, Italic | Navigation menu links |

### Font Sizes
| Token | Desktop | Mobile |
|-------|---------|--------|
| `--typography/font-family/font-size/h2` | 36px | 28px |
| `--typography/font-family/font-size/h3` | 24px | 20px |
| `--typography/font-family/font-size/h5` | 14px | 14px |
| `--typography/font-family/font-size/body-s` | 16px | 16px |
| `--typography/font-family/font-size/cta` | 12px | 12px |

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--typography/font-family/font-weight/headings-sabon` | 400 (Regular) | Sabon headings |
| `--typography/font-family/font-weight/headings-gotham` | 700 (Bold) | Gotham headings |
| `--typography/font-family/font-weight/body-copy` | 400 (Regular) | Body text |
| `--typography/font-family/font-weight/cta` | 700 (Bold) | CTA buttons |
| `--typography/font-family/font-weight/links` | 400 (Regular) | Links |

### Line Heights
| Style | Line Height |
|-------|-------------|
| Headings (h2, h3) | 1.3 (130%) |
| Body copy | 1.6 (160%) |
| CTA | 1.3 (130%) |
| H5 / Footer links | 1.6 (160%) |
| Menu link | 1.2 (120%) |

### Letter Spacing
| Style | Letter Spacing | Calculated (for reference) |
|-------|----------------|----------------------------|
| Headings (Sabon) | -2% | -0.72px at 36px, -0.56px at 28px |
| CTA (Gotham) | +3% | +0.36px at 12px |
| H5 (Gotham) | +3% | +0.42px at 14px |
| Body (Sabon) | -2% | -0.32px at 16px |

### Typography Styles Summary

#### Desktop Styles
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| headings/h2 | Sabon | 36px | Regular | 1.3 | -2% |
| headings/h3-sabon | Sabon | 24px | Regular | 1.3 | -2% |
| headings/h3-sabon-italic | Sabon | 24px | Italic | 1.3 | -2% |
| headings/h5 | Gotham | 14px | Bold | 1.6 | +3% |
| body/body-copy-s | Sabon | 16px | Regular | 1.6 | -2% |
| ctas/cta | Gotham | 12px | Bold | 1.3 | +3% |
| ctas/menu-link | Sabon | 36px | Regular | 1.2 | -2% |
| ctas/menu-link-hover | Sabon | 36px | Italic | 1.2 | -2% |

#### Mobile Styles
| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| mobile/h2 | Sabon | 28px | Regular | 1.3 | -2% |
| mobile/h3 | Sabon | 20px | Regular | 1.3 | -2% |
| mobile/h3-italic | Sabon | 20px | Italic | 1.3 | -2% |
| mobile/menu-link | Sabon | 28px | Regular | 1.3 | -2% |
| mobile/menu-link-italic | Sabon | 28px | Italic | 1.3 | -2% |

---

## Spacing

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--spacing/4xxs` | 0px | No spacing |
| `--spacing/2xxs` | 8px | Extra small gaps |
| `--spacing/xxs` | 10px | Small gaps |
| `--spacing/3xs` | 12px | Checkbox/icon spacing |
| `--spacing/2xs` | 14-16px | Small padding |
| `--spacing/xs` | 16px | Base small spacing |
| `--spacing/s` | 18px | Button horizontal padding |
| `--spacing/2s` | 20px | Small section padding |
| `--spacing/3s` | 26px | Medium gaps |
| `--spacing/m` | 30-36px | Medium spacing |
| `--spacing/3m` | 60px | Large section padding |
| `--spacing/l` | 70px | Large bottom padding |
| `--spacing/2l` | 80px | Large top padding |
| `--spacing/xl` | 80-120px | Extra large section spacing |
| `--spacing/2xxl` | 210px | Hero section top padding |
| `--spacing/3l` | 100px | Large section gaps |

### Common Spacing Patterns
| Pattern | Value | Usage |
|---------|-------|-------|
| Section padding (horizontal) | 60px | `.px-[var(--spacing/3m,60px)]` |
| Section padding (vertical) | 100px | `.py-[var(--spacing/3l,100px)]` |
| Content gap large | 120px | `.gap-[var(--spacing/xl,120px)]` |
| Content gap medium | 26px | `.gap-[var(--spacing/3s,26px)]` |
| Button padding | 12px top, 14px bottom, 18px horizontal | Button component |
| Navigation logo size | 110px | Square logo in nav |

---

## Breakpoints

### Device Widths
| Device | Width | Notes |
|--------|-------|-------|
| Mobile | 375px | Standard mobile viewport |
| Desktop | 1440px | Primary desktop breakpoint |
| Desktop Large | 1920px | Reference/large screens |

### Responsive Behavior
| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero height | 786px | 840px |
| Logo in hero | 315px x 22px | 1320px x 96px |
| Section padding | 30px | 60px |
| Gallery columns | 1-2 | 3 |
| Instagram feed images | Stacked | 4 columns |

---

## Components

### Component Library
| Component | Node ID | Variants |
|-----------|---------|----------|
| hero-option-1 | 340:2071 | Split screen, Full screen, Desktop/Mobile |
| hero-option-2 | 340:2077 | With copy block |
| hero-option-3 | 354:2418 | With gallery |
| button | 102:1410 | Default/Hover, Fill/Stroke, Desktop/Mobile |
| hamburger | 112:2063 | Default, Hover, Expanded, Close |
| menu-link | 112:3230 | Default/Hover, Desktop/Mobile |
| filter-link | 151:1690 | Default/Hover, Desktop/Mobile |
| footer-link | 291:2360 | Default/Hover, Dark/Light |
| pagination-number | 112:5688 | Selected, Default, Hover |
| carousel-arrows | 352:2648 | Left/Right arrows |
| gallery | 345:2626 | 3-column layout |
| instagram-feed | 342:2504 | 4-column grid |
| navigation-desktop | 112:3823 | With hamburger and reserve button |
| footer | 165:1002 | Desktop only |
| subscription-form | 355:7628 | Email input with checkbox |

### Button Styles
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default (fill to stroke) | `#f07aaa` | none | `#0e0e0e` |
| Hover (fill to stroke) | transparent | `#f6f4eb` | `#f6f4eb` |
| Default (stroke to fill) | transparent | `#f6f4eb` | `#f6f4eb` |
| Hover (stroke to fill) | `#f07aaa` | none | `#0e0e0e` |

### Button Specifications
```
Font: Gotham Bold
Size: 12px
Letter Spacing: +3% (0.36px)
Text Transform: UPPERCASE
Padding: 12px top, 14px bottom, 18px horizontal
Line Height: 1.3
Animation: Dissolve, 300ms, ease-out
```

---

## Pages

### Page Structure
| Page Name | Node ID | Width | Height | Description |
|-----------|---------|-------|--------|-------------|
| 1440 - homepage | 195:1342 | 1440px | 6826px | Main homepage |
| 1920-homepage REFERENCE | 466:5734 | 1920px | 8604px | Large desktop reference |
| menu | 297:1732 | 1440px | 4427px | Menu page |
| programming | 102:1105 | 1440px | 5777px | Events/programming page |
| private-events | 112:4894 | 1440px | 4715px | Private events form page |
| about | 112:6096 | 1440px | 7324px | About page |
| contact & getting here | 151:1772 | 1440px | 3794px | Contact information page |
| 404 | 214:1680 | 1440px | 840px | Error page |
| FAQ | 218:1518 | 1440px | 3089px | FAQ page |
| expanded-menu | 112:1811 | 1440px | 840px | Navigation overlay |

### Design System Frames
| Frame Name | Node ID | Description |
|------------|---------|-------------|
| Heroes | 355:6661 | Hero component documentation |
| Buttons & links | 355:7366 | Button/link component documentation |
| Inputs | 355:9050 | Form input documentation |

---

## CSS Variables Reference

### Complete Token List
```css
:root {
  /* Colors - Surface */
  --color-surface-background-default: #0e0e0e;
  --color-surface-background-highlight: #f07aaa;
  --color-surface-button-default: #f6f4eb;
  --color-surface-button-hover: #f07aaa;
  --color-surface-stroke-light: #f6f4eb;

  /* Colors - Typography */
  --color-typography-headings: #f6f4eb;
  --color-typography-body: #f6f4eb;
  --color-typography-body-invert: #0e0e0e;

  /* Colors - Neutral */
  --off-white-100: #f6f4eb;
  --neutral-black: #000000;
  --neutral-30: #cccccc;
  --neutral-50: #666666;
  --neutral-90: #191919;

  /* Typography - Font Families */
  --font-family-h2: 'Sabon', serif;
  --font-family-h3: 'Sabon', serif;
  --font-family-h5: 'Gotham', sans-serif;
  --font-family-body: 'Sabon', serif;
  --font-family-cta: 'Gotham', sans-serif;
  --font-family-menu-link: 'Sabon', serif;

  /* Typography - Font Sizes */
  --font-size-h2: 36px;
  --font-size-h2-mobile: 28px;
  --font-size-h3: 24px;
  --font-size-h3-mobile: 20px;
  --font-size-h5: 14px;
  --font-size-body-s: 16px;
  --font-size-cta: 12px;

  /* Typography - Line Heights */
  --line-height-headings: 1.3;
  --line-height-body: 1.6;
  --line-height-cta: 1.3;
  --line-height-menu-link: 1.2;

  /* Typography - Letter Spacing */
  --letter-spacing-sabon: -0.02em;
  --letter-spacing-gotham: 0.03em;

  /* Spacing */
  --spacing-4xxs: 0px;
  --spacing-2xxs: 8px;
  --spacing-xxs: 10px;
  --spacing-3xs: 12px;
  --spacing-2xs: 14px;
  --spacing-xs: 16px;
  --spacing-s: 18px;
  --spacing-2s: 20px;
  --spacing-3s: 26px;
  --spacing-m: 36px;
  --spacing-3m: 60px;
  --spacing-l: 70px;
  --spacing-2l: 80px;
  --spacing-xl: 120px;
  --spacing-2xxl: 210px;
  --spacing-3l: 100px;

  /* Breakpoints */
  --breakpoint-mobile: 375px;
  --breakpoint-desktop: 1440px;
  --breakpoint-desktop-lg: 1920px;
}
```

---

## Gradients

### Hero Gradients
| Name | Direction | Colors |
|------|-----------|--------|
| gradient-top | to bottom | `rgba(14,14,14,0)` → `#0e0e0e` |
| gradient-bottom | to bottom | `rgba(14,14,14,0)` → `#0e0e0e` |

```css
.gradient-top {
  background: linear-gradient(to bottom, rgba(14, 14, 14, 0), #0e0e0e);
  height: 480px; /* desktop */
  height: 293px; /* mobile */
}

.gradient-bottom {
  background: linear-gradient(to bottom, rgba(14, 14, 14, 0), #0e0e0e);
  height: 480px; /* desktop */
  height: 393px; /* mobile */
}
```

---

## Animation Specifications

### Button Hover
- Type: Dissolve
- Easing: ease-out
- Duration: 300ms

### Menu Loading
- Frame: menu-loading-animation (264:2105)

---

*Generated on: 2026-01-20*
*Source: Figma file bGCUY43jJhcFUafm33ncgW*
