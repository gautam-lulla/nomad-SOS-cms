# NoMad Wynwood - Project Context

## Project Overview
A production-ready Next.js 14+ website for NoMad Wynwood restaurant, built from Figma designs.

## Tech Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **Fonts:** Sabon (serif), Gotham (sans-serif) - local fonts

## Directory Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Primitive UI components (buttons, inputs)
│   ├── blocks/             # Section-level components (hero, features)
│   ├── layout/             # Layout components (header, footer, nav)
│   └── shared/             # Shared utilities
├── content/
│   ├── global/             # Site-wide content (nav, footer, metadata)
│   └── pages/              # Page-specific content JSON
├── lib/                    # Utility functions
└── types/                  # TypeScript interfaces

public/
├── fonts/                  # Custom fonts (Sabon, Gotham)
├── images/                 # Exported images from Figma
└── icons/                  # SVG icons

docs/
├── figma-exports/          # PDF exports from Figma
├── browser-renders/        # QA screenshots
├── font-manifest.json      # Font configuration
└── figma-reference-frames.md
```

## Design Tokens

### Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-background-default` | #0e0e0e | Dark background |
| `--color-background-highlight` | #f07aaa | Pink accent/footer |
| `--color-surface-button-default` | #f6f4eb | Off-white buttons |
| `--color-typography-body` | #f6f4eb | Body text (light) |
| `--color-typography-body-invert` | #0e0e0e | Body text (dark) |

### Typography
| Style | Font | Weight | Size | Line Height | Letter Spacing |
|-------|------|--------|------|-------------|----------------|
| h2 | Sabon | 400 | 36px | 1.3 | -0.72px |
| h3 | Sabon | 400 | 24px | 1.3 | -0.48px |
| h5 | Gotham | 700 | 14px | 1.6 | 0.42px |
| body | Sabon | 400 | 16px | 1.6 | -0.32px |
| cta | Gotham | 700 | 12px | 1.3 | 0.36px |

### Spacing Scale
- 4xxs: 0px
- 2xxs: 8px
- xxs: 10px
- 3xs: 12px
- 2xs: 14px
- xs: 16px
- s: 18px
- 2s: 20px
- 3s: 26px
- m: 36px
- 3m: 60px
- l: 70px
- 2l: 80px
- 3l: 100px
- xl: 120px

## Pages
1. Homepage (/, /home)
2. About (/about)
3. Private Events (/private-events)
4. Menu (/menu)
5. Programming (/programming)
6. Contact & Getting Here (/contact)
7. FAQ (/faq)
8. 404 (not-found)

## Figma Reference
- **File:** https://www.figma.com/design/bGCUY43jJhcFUafm33ncgW/Nomad-Wynwood
- PDF exports available in `/docs/figma-exports/`
- Design frames documented in `/docs/figma-reference-frames.md`

## Commands
```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint    # Run ESLint
npm run start   # Production server
```

## Important Notes
- All content must come from Figma - never invent text
- Use exact design token values - no approximations
- Mobile-first responsive design with Tailwind breakpoints
- All images exported from Figma - no placeholders
