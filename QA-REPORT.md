# NoMad Wynwood - Design Token QA Report

**Date:** 2026-01-20
**Reviewed By:** Claude Code
**Figma Source:** https://www.figma.com/design/bGCUY43jJhcFUafm33ncgW/Nomad-Wynwood

---

## Executive Summary

Overall, the implementation shows **good adherence** to the design tokens with some areas requiring attention. The token system is well-structured in `tokens.css` and `tailwind.config.ts`, but there are several hardcoded values throughout components that should use tokens instead.

| Category | Status | Issues Found |
|----------|--------|--------------|
| Colors | PASS | Minor: 1 hardcoded color |
| Typography | PASS | Minor: Some non-standard sizes |
| Spacing | NEEDS REVIEW | Multiple hardcoded pixel values |
| Breakpoints | PASS | Consistent mobile/tablet/desktop |
| Components | PASS | Good token usage in core components |

---

## Detailed Findings

### 1. COLORS

#### Token Implementation: CORRECT
The token file (`src/styles/tokens.css`) correctly defines all colors from Figma:

| Token | Implementation | Figma Spec | Status |
|-------|---------------|------------|--------|
| `--color-off-white-100` | `#f6f4eb` | `#f6f4eb` | MATCH |
| `--color-black-900` | `#0e0e0e` | `#0e0e0e` | MATCH |
| `--color-pink-500` | `#f07aaa` | `#f07aaa` | MATCH |
| `--color-surface-background-default` | `#0e0e0e` | `#0e0e0e` | MATCH |
| `--color-surface-background-highlight` | `#f07aaa` | `#f07aaa` | MATCH |
| `--color-surface-button-default` | `#f6f4eb` | `#f6f4eb` | MATCH |
| `--color-surface-button-hover` | `#f07aaa` | `#f07aaa` | MATCH |

#### Issues Found:
1. **Hardcoded color in getting-here/page.tsx:128**
   - Code: `bg-[#1a1a2e]`
   - This color (`#1a1a2e`) is not in the design tokens
   - **Recommendation:** Add this as a token if needed for maps, or use existing `black-900`

---

### 2. TYPOGRAPHY

#### Font Families: CORRECT
- Sabon: Properly loaded with Regular, Italic, Bold, Bold Italic variants
- Gotham: Properly loaded with Book, Medium, Bold variants (and italics)
- CSS variables `--font-sabon` and `--font-gotham` are correctly configured

#### Font Sizes: CORRECT
| Token | Implementation | Figma Spec | Status |
|-------|---------------|------------|--------|
| `--font-size-h2` | `36px` | `36px` | MATCH |
| `--font-size-h3` | `24px` | `24px` | MATCH |
| `--font-size-h5` | `14px` | `14px` | MATCH |
| `--font-size-body-s` | `16px` | `16px` | MATCH |
| `--font-size-cta` | `12px` | `12px` | MATCH |

#### Letter Spacing: CORRECT
| Token | Implementation | Figma Spec | Status |
|-------|---------------|------------|--------|
| `--letter-spacing-h2` | `-0.72px` | `-0.72px` | MATCH |
| `--letter-spacing-h3` | `-0.48px` | `-0.48px` | MATCH |
| `--letter-spacing-body` | `-0.32px` | `-0.32px` | MATCH |
| `--letter-spacing-cta` | `0.36px` | `0.36px` | MATCH |
| `--letter-spacing-h5` | `0.42px` | `0.42px` | MATCH |

#### Line Heights: CORRECT
| Token | Implementation | Figma Spec | Status |
|-------|---------------|------------|--------|
| `--line-height-tight` | `1.3` | `1.3` | MATCH |
| `--line-height-relaxed` | `1.6` | `1.6` | MATCH |

#### Issues Found:
1. **Non-standard font sizes used (hardcoded)**:
   - `text-[10px]` in Navigation.tsx:105, 165 (mobile button)
   - `text-[16px]` in TeamGrid.tsx:51, 57 and programming/page.tsx:125
   - `text-[28px]` in Navigation.tsx:198, not-found.tsx:37, 41 (mobile h2 - should be `text-h2-mobile` if available)
   - `text-[32px]` in Navigation.tsx:198 (tablet size - not in tokens)
   - `text-[36px]`, `text-[48px]`, `text-[56px]` in contact/page.tsx:35 (hero heading sizes)

   **Recommendation:** Consider adding mobile typography tokens:
   - `--font-size-h2-mobile: 28px`
   - `--font-size-cta-small: 10px`

2. **Non-standard tracking value**:
   - `tracking-[0.48px]` in TeamGrid.tsx, programming/page.tsx
   - **Recommendation:** This appears to be +3% at 16px. Consider if this needs a token.

---

### 3. SPACING

#### Token Implementation: CORRECT
All spacing tokens match Figma specifications:

| Token | Implementation | Figma Spec | Status |
|-------|---------------|------------|--------|
| `--spacing-4xxs` | `0px` | `0px` | MATCH |
| `--spacing-2xxs` | `8px` | `8px` | MATCH |
| `--spacing-xxs` | `10px` | `10px` | MATCH |
| `--spacing-3xs` | `12px` | `12px` | MATCH |
| `--spacing-2xs` | `14px` | `14px` | MATCH |
| `--spacing-xs` | `16px` | `16px` | MATCH |
| `--spacing-s` | `18px` | `18px` | MATCH |
| `--spacing-2s` | `20px` | `20px` | MATCH |
| `--spacing-3s` | `26px` | `26px` | MATCH |
| `--spacing-m` | `36px` | `36px` | MATCH |
| `--spacing-3m` | `60px` | `60px` | MATCH |
| `--spacing-l` | `70px` | `70px` | MATCH |
| `--spacing-2l` | `80px` | `80px` | MATCH |
| `--spacing-3l` | `100px` | `100px` | MATCH |
| `--spacing-xl` | `120px` | `120px` | MATCH |

#### Missing Token:
- `--spacing-2xxl: 210px` from Figma is **NOT** defined in tokens.css

#### Issues Found - Hardcoded Values:

**Heights (non-token values used):**
| Location | Value | Recommendation |
|----------|-------|----------------|
| HeroSplitScreen.tsx:36 | `h-[500px]` (mobile) | Consider token |
| HeroSplitScreen.tsx:36 | `h-[700px]` (tablet) | Consider token |
| HeroSplitScreen.tsx:36 | `h-[840px]` (desktop) | Matches Figma - consider token |
| Gallery.tsx:37 | `h-[300px]`, `h-[500px]`, `h-[700px]` | Consider tokens |
| Navigation.tsx:72 | `h-[80px]`, `h-[100px]`, `h-[110px]` | Nav heights |
| SectionHalfScreen.tsx:57, 69 | `h-[400px]`, `h-[840px]` | Section heights |
| Footer.tsx:124 | `h-[40px]`, `h-[70px]`, `h-[96px]` | Logo heights |
| InstagramFeed.tsx:51 | `h-[200px]`, `h-[300px]`, `h-[444px]` | Feed item heights |

**Widths (non-token values used):**
| Location | Value | Note |
|----------|-------|------|
| Navigation.tsx:130 | `w-[720px]` | Half-screen - Figma spec |
| Navigation.tsx:216, 244 | `w-[187px]` | Info column - matches Figma |
| Footer.tsx:42 | `max-w-[1440px]` | Container max - matches breakpoint |
| Footer.tsx:46 | `w-[229px]` | Footer column - matches Figma |
| Footer.tsx:95 | `w-[433px]` | Newsletter width - matches Figma |
| Footer.tsx:124 | `max-w-[1320px]` | Logo width - matches Figma |
| TextSection.tsx:40 | `max-w-[454px]` | Centered text width |
| TextSection.tsx:65 | `max-w-[544px]` | Heading max-width - matches Figma |
| TextSection.tsx:73 | `w-[715px]` | Content column - matches Figma |
| TextSection.tsx:76 | `max-w-[433px]` | Content max-width - matches Figma |
| TextSection.tsx:104, 120 | `w-[186px]` | Info column (should be 187px per Figma) |

**Gaps/Padding (non-token values used):**
| Location | Value | Recommendation |
|----------|-------|----------------|
| Navigation.tsx:188 | `space-y-[3px]` | Very small gap - consider token |
| Navigation.tsx:214 | `gap-[60px]` | Use `gap-3m` instead |
| Footer.tsx:77 | `gap-[2px]` | Very small gap - consider token |
| not-found.tsx:36 | `gap-[8px]` | Use `gap-2xxs` instead |
| getting-here/page.tsx:72 | `gap-[60px]` | Use `gap-3m` instead |

**Positions (non-token values):**
| Location | Value | Note |
|----------|-------|------|
| Navigation.tsx:83 | `top-[24px]`, `top-[30px]`, `top-[34px]` | Hamburger position |
| Navigation.tsx:186 | `top-[120px]`, `top-[160px]`, `top-[190px]` | Menu links position |
| Navigation.tsx:213 | `bottom-[80px]`, `bottom-[120px]`, `bottom-[178px]` | Location info position |

---

### 4. BREAKPOINTS

#### Implementation: CORRECT
The implementation uses consistent breakpoints via Tailwind defaults:
- Mobile: Default (< 768px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

Figma specifies:
- Mobile: 375px
- Desktop: 1440px
- Desktop Large: 1920px

**Note:** The implementation uses Tailwind's standard breakpoints rather than custom ones matching Figma exactly. This is acceptable but worth noting.

---

### 5. COMPONENT-SPECIFIC FINDINGS

#### Button Component: PASS
- Correctly uses tokens for colors, spacing, typography
- Transition timing: `duration-300` matches Figma's 300ms spec
- Both `filled` and `outline` variants implemented correctly

#### Navigation Component: MOSTLY PASS
- Good token usage for colors and typography
- Issue: Uses hardcoded position values (see spacing issues)

#### Footer Component: PASS
- Correctly uses `bg-pink-500` for background
- Good typography token usage
- Width values match Figma specifications

#### Hero Component: PASS
- Gradient colors use tokens (`from-black-900`)
- Heights are hardcoded but match Figma specs
- Logo dimensions match Figma (96px height at 1320px width)

---

## Recommendations Summary

### High Priority
1. **Create mobile typography tokens** - Add `--font-size-h2-mobile: 28px` and similar for consistent responsive typography

### Medium Priority
2. **Replace hardcoded gaps with tokens**:
   - `gap-[60px]` → `gap-3m`
   - `gap-[8px]` → `gap-2xxs`

3. **Add missing spacing token**: `--spacing-2xxl: 210px`

4. **Investigate hardcoded color**: `#1a1a2e` in getting-here/page.tsx

### Low Priority
5. **Consider creating height tokens** for commonly used values:
   - `--height-hero-mobile: 500px`
   - `--height-hero-tablet: 700px`
   - `--height-hero-desktop: 840px`
   - `--height-nav: 110px`

6. **Width values** - Most hardcoded widths match Figma specs exactly. Consider tokenizing only if reused frequently.

---

## Token Coverage Score

| Category | Score | Notes |
|----------|-------|-------|
| Colors | 95% | 1 undefined color used |
| Typography | 85% | Missing mobile sizes |
| Spacing | 70% | Many hardcoded values |
| Components | 90% | Good semantic usage |

**Overall Score: 85%** - Good foundation with room for improvement in spacing consistency.

---

## Files Reviewed

- `src/styles/tokens.css`
- `src/app/globals.css`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/blocks/HeroSplitScreen.tsx`
- `src/components/blocks/TextSection.tsx`
- `src/components/blocks/Gallery.tsx`
- `src/components/blocks/SectionHalfScreen.tsx`
- `src/components/blocks/InstagramFeed.tsx`
- `src/components/blocks/TeamGrid.tsx`
- `src/components/blocks/FAQAccordion.tsx`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/app/contact/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/getting-here/page.tsx`
- `src/app/programming/page.tsx`
- `src/app/private-events/page.tsx`
- `src/app/menu/page.tsx`

---

*Report generated by Claude Code*
