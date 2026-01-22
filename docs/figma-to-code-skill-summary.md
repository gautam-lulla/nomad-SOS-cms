# Figma-to-Code Skill - File Summary

This document summarizes every file in the `figma-to-code` skill located at `~/.claude/skills/figma-to-code/`.

---

## Core Files

### SKILL.md
**Purpose:** Main entry point and master reference for the entire skill.

**Contents:**
- Skill metadata (version 1.7.0, dependencies, allowed tools)
- **Critical Rules**: Zero Hardcoded Content, Inline Editor Data Attributes, CMS Data Structure, Anti-Hallucination Rules
- **Three-Tier Content Model**: Global → Components → Pages architecture
- **Content Layer Requirement**: `transformImageUrls()` pattern for handling inline editor image saves
- **14-Phase Execution Workflow** overview with links to each phase file
- **Project Configuration** format and auto-discovery features
- **Quick Reference** for data attributes and checkpoint commands
- Common pitfalls to avoid and best practices
- Version history (v1.0.0 through v1.7.0)

---

## Phase Files (Execution Workflow)

### PHASE-1-PREFLIGHT.md
**Purpose:** Pre-flight validation and authentication before building.

**Steps:**
1. Save user configuration to `/project-config/config.md`
2. Read config and collect CMS credentials
3. Authenticate with CMS via login mutation
4. **Auto-discover Figma pages** using Figma MCP (desktop/mobile frames)
5. **Component library discovery** from Figma Components page
6. Font availability check

**Outputs:** `config.md`, `pages.md`, `components.md`, `font-manifest.json`

---

### PHASE-2-INIT.md
**Purpose:** Project initialization and CMS integration setup.

**Steps:**
1. Reference CMS API from `sphereos-cms-api` skill
2. Initialize Next.js 14+ project with TypeScript, Tailwind, App Router
3. Create directory structure (`src/app`, `src/components`, `src/lib`)
4. Install dependencies (Apollo Client, Playwright)
5. Create `.env.local` with CMS configuration
6. **Create Edit Mode Middleware** (`middleware.ts`) for cache bypass
7. **Create Apollo Client** with edit mode awareness
8. Create GraphQL queries, content layer, CMS write utilities
9. Create `Editable` helper component

**Key Pattern:** Middleware sets `cms-edit-mode` cookie when `?edit=true` for fresh data fetching.

---

### PHASE-3-TOKENS.md
**Purpose:** Extract design tokens from Figma for pixel-perfect implementation.

**Steps:**
1. Extract Figma variables via `mcp__figma__get_variable_defs`
2. Create `/docs/design-tokens.json` with colors, spacing, typography
3. Create `/src/styles/tokens.css` with CSS custom properties
4. Update `tailwind.config.ts` to use design tokens
5. Create `/docs/design-tokens.md` as QA reference

---

### PHASE-4-ASSETS.md
**Purpose:** Asset extraction and CDN upload.

**Steps:**
1. Configure fonts (Google Fonts or custom)
2. Export icons from Figma
3. Export and upload images to CMS (via `uploadMedia` mutation)
4. Create `/docs/image-manifest.json` tracking all images
5. Image optimization (WebP, responsive sizes)
6. **Image Migration Script** (`scripts/migrate-figma-images.ts`) for production
7. Update `next.config.mjs` with CDN remote patterns

**Critical:** Figma MCP URLs are temporary - must migrate to CDN before production.

---

### PHASE-5-CONTENT-TYPES.md
**Purpose:** CMS content type setup based on Figma component patterns.

**Key Concepts:**
- **Three-Tier Model:**
  - Tier 1 (Global): `site-settings`, `navigation`, `footer` - 1 entry each
  - Tier 2 (Components): `hero-section`, `content-section`, `gallery`, `faq-item`, etc.
  - Tier 3 (Pages): Single `page` type referencing components

**Critical Rule:** Never use `type: 'json'` for image arrays - use individual MEDIA fields instead.

**Steps:**
1. Analyze Figma components first
2. Create Tier 1 global content types
3. Create Tier 2 component content types
4. Create Tier 3 page content type

**Pattern:** `galleryImage1`, `galleryImage1Alt`, `galleryImage2`, `galleryImage2Alt`... for image collections.

---

### PHASE-6-GLOBAL-CONTENT.md
**Purpose:** Extract global content from Figma and populate CMS.

**Steps:**
1. Extract navigation content (menu links, CTA)
2. Extract footer content (links, copyright)
3. Extract site settings (logo, contact info)
4. Create additional global content if present
5. Create error page content (if 404 in Figma)
6. Verify all global content entries

**Rule:** Extract ONLY what exists in YOUR Figma - don't invent content.

---

### PHASE-7-COMPONENTS.md
**Purpose:** Generate React components with zero hardcoded content.

**Critical Requirements:**
- Accept ALL content via props
- Include `data-cms-entry` and `data-cms-field` on ALL editable elements
- Reference `/project-config/components.md` inventory first

**Patterns:**
- UI components: Text via props, no defaults
- Layout components: Props for all links, images, text
- Page sections: `entry` prop for CMS entry slug
- Array sections: Indexed field paths `items[0].name`

**Verification:** No quoted strings render to users, all elements have CMS attributes.

---

### PHASE-8-PAGE-CONTENT.md
**Purpose:** Extract page content from Figma and populate CMS.

**Steps:**
1. Extract ALL text from Figma verbatim
2. Map images to CDN URLs
3. Create CMS entry with FLAT data structure

**Critical:** Use `entry.data.hero.title` NOT `entry.data.data.hero.title`.

---

### PHASE-9-PAGES.md
**Purpose:** Assemble pages with global content.

**Patterns:**
- Root layout fetches global content (settings, nav, footer)
- Pages fetch page-specific content
- All elements have `data-cms-*` attributes
- Use `force-dynamic` export

**Process:** Build pages sequentially, get approval at each.

---

### PHASE-10-AUDIT.md
**Purpose:** Zero Hardcoded Content Audit.

**Process:**
1. Automated grep for potential hardcoded strings
2. Manual audit of every `.tsx` file
3. Check each quoted string (CSS class OK, displayed text NOT OK)
4. Report format: List files with 0 violations
5. Fix violations before proceeding

---

### PHASE-11-EDITOR-AUDIT.md
**Purpose:** Verify all editable elements have CMS data attributes.

**Validation Rules:**
| Element | Required Attributes |
|---------|---------------------|
| Text | `data-cms-entry`, `data-cms-field` |
| Image | + `data-cms-type="image"` |
| Rich text | + `data-cms-type="richtext"` |
| Array | + `data-cms-type="array"`, indexed paths |

---

### PHASE-12-QA.md
**Purpose:** Automated QA testing.

**Steps:**
1. Screenshot capture with Playwright (desktop, tablet, mobile)
2. Structural verification against component inventory
3. Layout verification against Figma
4. Content verification (all from CMS, no hardcoded)
5. Responsive check
6. Design token QA (no hardcoded hex/px values)

---

### PHASE-13-PRODUCTION.md
**Purpose:** Production readiness audit.

**Steps:**
1. **Migrate Figma images to CDN** (critical!)
2. Build verification (`npm run build`, lint, tsc)
3. Verification checklist:
   - Images use CDN URLs
   - Content from CMS, no hardcoded strings
   - Data attributes correct
   - Flat CMS structure
   - Accessibility (alt text, semantic HTML)
   - Performance, error handling, security

---

### PHASE-14-DEPLOY.md
**Purpose:** Deployment to production.

**Platforms covered:**
- Vercel (primary)
- AWS Amplify
- Netlify

**Post-deployment:**
- Add `InlineEditorLoader` component for `?edit=true` mode
- Run Lighthouse audit (target: >90 all categories)
- Verify production site

---

## Reference Files

### CMS-FIELD-DEFINITIONS.md
**Purpose:** Comprehensive guide for CMS content type field definitions.

**Key Rules:**
1. **NEVER use JSON for image arrays** - use individual MEDIA fields
2. Content types before entries
3. Flat field slugs (no dot notation)
4. Use `{sectionName}{FieldName}` naming convention

**Field Types:**
- `text`: Titles, labels, alt text
- `richText`: Formatted paragraphs
- `media`: ALL images, videos
- `json`: Link arrays, structured text (NOT images)
- `reference`: Links to other entries

**Frontend Pattern:** `buildImageArray()` to reconstruct arrays from individual fields.

---

### CMS-REFERENCE.md
**Purpose:** Quick reference for content type and entry slugs.

**Global Types:**
- `site-settings` → `global-settings`
- `site-navigation` → `global-navigation`
- `site-footer` → `global-footer`

**Page Type:** `page-content` → use page slug (e.g., `home`, `about`)

**Collection Types:** `faq-item`, `team-member`, `product`, etc.

---

### COMPONENT-PATTERNS.md
**Purpose:** Quick reference for building components with inline editor support.

**Data Attributes:**
```tsx
data-cms-entry="entry-slug"
data-cms-field="path.to.field"
data-cms-type="image|richtext|array"
```

**Patterns:** Simple text, Image (use `"image"` not `"url"`), Links, Arrays, Form placeholders.

---

### GRAPHQL-EXAMPLES.md
**Purpose:** GraphQL query/mutation examples.

**Includes:**
- Authentication (login)
- Content type creation
- Content entry CRUD
- Apollo Client setup
- Content layer functions (`getPageContent`, `getSiteSettings`, etc.)

---

### LEARNINGS.md
**Purpose:** Accumulated insights, patterns, and lessons learned.

**Key Patterns:**
1. **Image Object Handling**: `transformImageUrls()` extracts URLs from inline editor image objects
2. **Individual MEDIA Fields**: Never use JSON for image arrays
3. **`buildImageArray()`**: Reconstruct arrays from individual fields

**Gotchas:**
- Inline editor string URL spread bug (fixed)
- `isImageObject()` too aggressive (fixed)
- Nested data structure breaks inline editing

---

### EXAMPLE-DESIGN-TOKENS.md
**Purpose:** Template format for design tokens documentation.

**Sections:**
- Colors (primitives and semantic)
- Typography (families, sizes)
- Spacing scale
- Breakpoints
- Component specs (buttons, navigation)
- Page inventory

---

## Summary Table

| File | Category | Primary Purpose |
|------|----------|-----------------|
| SKILL.md | Core | Master reference, critical rules, 14-phase overview |
| PHASE-1-PREFLIGHT.md | Phase | Auth, Figma discovery, config |
| PHASE-2-INIT.md | Phase | Project setup, middleware, Apollo |
| PHASE-3-TOKENS.md | Phase | Design token extraction |
| PHASE-4-ASSETS.md | Phase | Asset export, CDN upload, migration script |
| PHASE-5-CONTENT-TYPES.md | Phase | CMS schema creation (3-tier model) |
| PHASE-6-GLOBAL-CONTENT.md | Phase | Global content extraction |
| PHASE-7-COMPONENTS.md | Phase | Component generation |
| PHASE-8-PAGE-CONTENT.md | Phase | Page content extraction |
| PHASE-9-PAGES.md | Phase | Page assembly |
| PHASE-10-AUDIT.md | Phase | Zero hardcoded content audit |
| PHASE-11-EDITOR-AUDIT.md | Phase | Data attributes audit |
| PHASE-12-QA.md | Phase | Automated QA testing |
| PHASE-13-PRODUCTION.md | Phase | Production readiness |
| PHASE-14-DEPLOY.md | Phase | Deployment |
| CMS-FIELD-DEFINITIONS.md | Reference | Field definition rules |
| CMS-REFERENCE.md | Reference | Content type/entry slugs |
| COMPONENT-PATTERNS.md | Reference | Component code patterns |
| GRAPHQL-EXAMPLES.md | Reference | GraphQL queries/mutations |
| LEARNINGS.md | Reference | Accumulated patterns & gotchas |
| EXAMPLE-DESIGN-TOKENS.md | Reference | Design tokens template |
