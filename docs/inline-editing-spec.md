# Inline Editing Specification

## Overview

Enable non-technical users to edit website content directly on the live site with visual context. Users authenticate via the existing CMS, and their permissions determine what they can do.

## Goals

1. **User-friendly editing**: Layusers see the actual website and click edit buttons on sections
2. **Secure access**: CMS authentication required, role-based permissions enforced
3. **Visual context**: Users see exactly what they're changing
4. **Seamless integration**: Leverages existing CMS infrastructure (auth, roles, content API)
5. **Reusable**: Core components work with any SphereOS-powered website

---

## Code Architecture (CMS vs Website)

The inline editing functionality is split between two codebases:

```
┌─────────────────────────────────────────────────────────────────────┐
│              CMS PROJECT (headless-cms)                             │
│              Published as: @sphereos/inline-editor                  │
│                                                                     │
│  REUSABLE CORE - Works with ANY SphereOS website                    │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Components:                                                        │
│  ├── EditModeProvider      # Context, state management              │
│  ├── EditToolbar           # Floating "Edit Mode" toolbar           │
│  ├── EditableSection       # Wrapper that adds edit buttons         │
│  ├── EditDrawer            # Side drawer UI shell                   │
│  ├── MediaLibraryModal     # Image picker from CMS media            │
│  └── fields/                                                        │
│      ├── TextField         # Single-line text input                 │
│      ├── RichTextField     # WYSIWYG editor                         │
│      ├── MediaField        # Image picker                           │
│      ├── NumberField       # Numeric input                          │
│      ├── BooleanField      # Toggle/checkbox                        │
│      ├── SelectField       # Dropdown                               │
│      ├── DateField         # Date picker                            │
│      ├── ArrayField        # Repeatable items                       │
│      └── ObjectField       # Nested fields                          │
│                                                                     │
│  Utilities:                                                         │
│  ├── auth.ts               # Token validation, permission checks    │
│  ├── client.ts             # GraphQL client for CMS API             │
│  ├── permissions.ts        # Role → permission mapping              │
│  └── save.ts               # Save content mutation helpers          │
│                                                                     │
│  Types:                                                             │
│  ├── FieldSchema           # Field definition interface             │
│  ├── UserPermissions       # Permission flags                       │
│  └── EditModeContext       # Context value types                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │  npm install @sphereos/inline-editor
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│              WEBSITE PROJECT (nomad-SOS-cms)                        │
│                                                                     │
│  SITE-SPECIFIC CONFIG - Unique to this website                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Configuration:                                                     │
│  ├── section-schemas.ts    # Field definitions for each section     │
│  │   ├── heroSchema        # Logo, left image, right image          │
│  │   ├── introSchema       # Heading, paragraph, button             │
│  │   ├── eventsSchema      # Heading, image, CTA                    │
│  │   ├── gallerySchema     # Array of images                        │
│  │   └── ...               # Other page sections                    │
│  │                                                                  │
│  ├── editable-config.ts    # Which sections are editable            │
│  │   └── { homepage: ['hero', 'intro', 'events', 'gallery'], ... }  │
│  │                                                                  │
│  └── theme.ts              # Custom styling for edit UI (optional)  │
│                                                                     │
│  Integration:                                                       │
│  ├── middleware.ts         # Auth check for ?edit=true              │
│  ├── layout.tsx            # Wrap with EditModeProvider             │
│  └── components/           # Wrap sections with EditableSection     │
│      ├── HeroSection.tsx   # <EditableSection sectionId="hero">     │
│      ├── IntroSection.tsx  # <EditableSection sectionId="intro">    │
│      └── ...                                                        │
│                                                                     │
│  Environment:                                                       │
│  ├── CMS_GRAPHQL_URL       # CMS API endpoint                       │
│  ├── CMS_ORGANIZATION_ID   # Org ID for this website                │
│  └── CMS_LOGIN_URL         # Login page redirect URL                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Why This Split?

| Aspect | CMS Project | Website Project |
|--------|-------------|-----------------|
| **Scope** | Generic, reusable | Site-specific |
| **Purpose** | "How to edit" | "What to edit" |
| **Changes** | Rarely (stable API) | Often (new sections) |
| **Ownership** | Platform team | Site developers |
| **Examples** | Field rendering, auth | Section schemas |

### Package Structure (@sphereos/inline-editor)

```
@sphereos/inline-editor/
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   └── styles.css
├── src/
│   ├── components/
│   │   ├── EditModeProvider.tsx
│   │   ├── EditToolbar.tsx
│   │   ├── EditableSection.tsx
│   │   ├── EditDrawer.tsx
│   │   ├── MediaLibraryModal.tsx
│   │   └── fields/
│   │       └── ... (all field components)
│   ├── hooks/
│   │   ├── useEditMode.ts
│   │   ├── usePermissions.ts
│   │   └── useSaveContent.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── permissions.ts
│   │   └── save.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts              # Public exports
├── package.json
└── README.md
```

### Website Integration Example

```tsx
// Website: src/app/layout.tsx
import { EditModeProvider } from '@sphereos/inline-editor';
import { validateEditSession } from '@/lib/cms/auth';

export default async function RootLayout({ children }) {
  const editSession = await validateEditSession();

  return (
    <html>
      <body>
        <EditModeProvider
          isEditMode={editSession.isValid}
          user={editSession.user}
          permissions={editSession.permissions}
          cmsUrl={process.env.CMS_GRAPHQL_URL}
          organizationId={process.env.CMS_ORGANIZATION_ID}
        >
          {children}
        </EditModeProvider>
      </body>
    </html>
  );
}
```

```tsx
// Website: src/components/blocks/HeroSection.tsx
import { EditableSection } from '@sphereos/inline-editor';
import { heroSchema } from '@/lib/cms/section-schemas';

export function HeroSection({ data }) {
  return (
    <EditableSection
      sectionId="hero"
      schema={heroSchema}
      data={data}
    >
      {/* Actual hero section markup */}
      <section className="hero">
        <img src={data.logoSrc} alt="Logo" />
        <img src={data.leftImage} alt="" />
        <img src={data.rightImage} alt="" />
      </section>
    </EditableSection>
  );
}
```

```tsx
// Website: src/lib/cms/section-schemas.ts
import type { FieldSchema } from '@sphereos/inline-editor';

export const heroSchema: FieldSchema[] = [
  { slug: 'logoSrc', name: 'Logo Image', type: 'media', required: true },
  { slug: 'leftImage', name: 'Left Image', type: 'media', required: true },
  { slug: 'rightImage', name: 'Right Image', type: 'media', required: true },
];

export const introSchema: FieldSchema[] = [
  { slug: 'heading', name: 'Heading', type: 'text', required: true },
  { slug: 'paragraph', name: 'Description', type: 'richText', required: true },
  { slug: 'buttonText', name: 'Button Text', type: 'text', required: true },
];

// ... schemas for other sections
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WEBSITE (Next.js)                           │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Public Mode   │    │   Preview Mode  │    │    Edit Mode    │ │
│  │   (default)     │    │   (VIEWER)      │    │ (CONTENT_EDITOR+)│ │
│  │                 │    │                 │    │                 │ │
│  │  - No edit UI   │    │  - View drafts  │    │  - Edit buttons │ │
│  │  - Cached       │    │  - No editing   │    │  - Save to CMS  │ │
│  │  - Public       │    │  - Auth required│    │  - Auth required│ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │       SphereOS CMS API        │
                    │   (GraphQL + Authentication)  │
                    │                               │
                    │  - User authentication        │
                    │  - Role/permission checks     │
                    │  - Content CRUD operations    │
                    │  - Media library              │
                    └───────────────────────────────┘
```

---

## Authentication Flow

### Entry Points

1. **Direct URL**: `https://nomadwynwood.com?edit=true`
2. **CMS Admin Link**: "Open in Edit Mode" button in CMS admin
3. **Bookmarklet**: JavaScript bookmarklet for quick access

### Flow Diagram

```
User visits site with ?edit=true (or /edit route)
                │
                ▼
┌───────────────────────────────────┐
│  Check for CMS auth cookie        │
│  (cms_access_token / HTTP-only)   │
└───────────────┬───────────────────┘
                │
        ┌───────┴───────┐
        │               │
    No cookie       Has cookie
        │               │
        ▼               ▼
┌───────────────┐  ┌───────────────────────┐
│ Redirect to   │  │ Validate token with   │
│ CMS login     │  │ CMS API               │
│               │  │ GET /auth/me          │
│ Return URL:   │  └───────────┬───────────┘
│ ?edit=true    │              │
└───────────────┘      ┌───────┴───────┐
                       │               │
                   Invalid          Valid
                       │               │
                       ▼               ▼
              ┌─────────────┐  ┌─────────────────────┐
              │ Clear cookie│  │ Fetch user roles    │
              │ Redirect to │  │ for organization    │
              │ CMS login   │  └──────────┬──────────┘
              └─────────────┘             │
                                          ▼
                              ┌───────────────────────┐
                              │ Render site with      │
                              │ appropriate mode      │
                              └───────────────────────┘
```

### CMS Login Integration

After successful CMS login, redirect back to website with auth cookie:

```
CMS Login Page
     │
     ▼
POST /auth/login
     │
     ▼
Set HTTP-only cookie: cms_access_token
     │
     ▼
Redirect to: return_url (e.g., https://nomadwynwood.com?edit=true)
```

---

## Authorization / Permissions

### Role Mapping

| CMS Role | Slug | Website Access |
|----------|------|----------------|
| System Admin | `SYSTEM_ADMIN` | Full edit access to all organizations |
| Org Admin | `ORG_ADMIN` | Full edit access within their organization |
| Content Editor | `CONTENT_EDITOR` | Can edit content, cannot change settings |
| Viewer | `VIEWER` | Preview mode only (see drafts, no editing) |
| Org Member | `ORG_MEMBER` | Based on additional permissions |
| No Role | - | Redirect to public site |

### Permission Check Logic

```typescript
interface UserPermissions {
  canEdit: boolean;      // Can modify content
  canPublish: boolean;   // Can publish changes (future)
  canPreview: boolean;   // Can see draft content
  canManageMedia: boolean; // Can upload/delete media
}

function getPermissions(userRoles: string[]): UserPermissions {
  const isAdmin = userRoles.some(r =>
    ['SYSTEM_ADMIN', 'ORG_ADMIN'].includes(r)
  );
  const isEditor = userRoles.includes('CONTENT_EDITOR');
  const isViewer = userRoles.includes('VIEWER');

  return {
    canEdit: isAdmin || isEditor,
    canPublish: isAdmin,
    canPreview: isAdmin || isEditor || isViewer,
    canManageMedia: isAdmin || isEditor,
  };
}
```

### Organization Scoping

Users can only edit content for organizations they belong to:

```typescript
// Middleware check
const userOrganizations = await getUserOrganizations(userId);
const siteOrganizationId = process.env.CMS_ORGANIZATION_ID;

if (!userOrganizations.includes(siteOrganizationId)) {
  // User has no access to this site's organization
  redirect('/unauthorized');
}
```

---

## User Interface

### Edit Mode Indicator

When in edit mode, show a floating toolbar:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔵 Edit Mode │ Logged in as: editor@example.com │ [Exit Edit]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                         [Rest of page]                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Section Edit Buttons

Each editable section gets a hover overlay with edit button:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────┐  [✏️] │  │
│  │ │                                                     │       │  │
│  │ │              HERO SECTION                           │       │  │
│  │ │                                                     │       │  │
│  │ │   [Logo]    Welcome to NoMad    [Image]            │       │  │
│  │ │                                                     │       │  │
│  │ └─────────────────────────────────────────────────────┘       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────┐  [✏️] │  │
│  │ │                                                     │       │  │
│  │ │              INTRO SECTION                          │       │  │
│  │ │                                                     │       │  │
│  │ │   "Leo bibendum sem urna fringilla quisque..."     │       │  │
│  │ │                                                     │       │  │
│  │ └─────────────────────────────────────────────────────┘       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Legend:
  ┌─────┐
  │     │  = Hover overlay (semi-transparent border)
  └─────┘

  [✏️]    = Edit button (appears on hover or always visible)
```

### Edit Modal/Drawer

Clicking edit opens a side drawer or modal with form fields:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                    ┌──────────────┐ │
│                                                    │ Edit Hero    │ │
│                                                    │ Section   [×]│ │
│   [Main page content visible                       │──────────────│ │
│    but slightly dimmed]                            │              │ │
│                                                    │ Logo Image   │ │
│                                                    │ ┌──────────┐ │ │
│                                                    │ │ [image]  │ │ │
│                                                    │ │ [Change] │ │ │
│                                                    │ └──────────┘ │ │
│                                                    │              │ │
│                                                    │ Left Image   │ │
│                                                    │ ┌──────────┐ │ │
│                                                    │ │ [image]  │ │ │
│                                                    │ │ [Change] │ │ │
│                                                    │ └──────────┘ │ │
│                                                    │              │ │
│                                                    │ Right Image  │ │
│                                                    │ ┌──────────┐ │ │
│                                                    │ │ [image]  │ │ │
│                                                    │ │ [Change] │ │ │
│                                                    │ └──────────┘ │ │
│                                                    │              │ │
│                                                    │──────────────│ │
│                                                    │[Cancel][Save]│ │
│                                                    └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Field Types in Edit Modal

| Field Type | UI Component | Description |
|------------|--------------|-------------|
| `text` | Text input | Single line text |
| `richText` | Rich text editor | WYSIWYG with formatting |
| `media` | Image picker | Opens media library modal |
| `number` | Number input | Numeric values |
| `boolean` | Toggle switch | On/off values |
| `select` | Dropdown | Single selection |
| `date` | Date picker | Date selection |
| `reference` | Reference picker | Link to other content |

---

## Technical Implementation

### Project Structure

Code is split between the CMS project (reusable) and website project (site-specific):

```
headless-cms/                          # CMS PROJECT
├── packages/
│   └── inline-editor/                 # @sphereos/inline-editor package
│       ├── src/
│       │   ├── components/
│       │   │   ├── EditModeProvider.tsx
│       │   │   ├── EditToolbar.tsx
│       │   │   ├── EditableSection.tsx
│       │   │   ├── EditDrawer.tsx
│       │   │   ├── MediaLibraryModal.tsx
│       │   │   └── fields/
│       │   │       ├── TextField.tsx
│       │   │       ├── RichTextField.tsx
│       │   │       ├── MediaField.tsx
│       │   │       ├── NumberField.tsx
│       │   │       ├── BooleanField.tsx
│       │   │       ├── SelectField.tsx
│       │   │       ├── ArrayField.tsx
│       │   │       └── ObjectField.tsx
│       │   ├── hooks/
│       │   │   ├── useEditMode.ts
│       │   │   ├── usePermissions.ts
│       │   │   └── useSaveContent.ts
│       │   ├── lib/
│       │   │   ├── auth.ts
│       │   │   ├── client.ts
│       │   │   ├── permissions.ts
│       │   │   └── save.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
nomad-SOS-cms/                         # WEBSITE PROJECT
├── src/
│   ├── app/
│   │   └── layout.tsx                 # Wrap with EditModeProvider
│   ├── components/
│   │   └── blocks/                    # Section components
│   │       ├── HeroSection.tsx        # Uses EditableSection
│   │       ├── IntroSection.tsx
│   │       └── ...
│   └── lib/
│       └── cms/
│           ├── section-schemas.ts     # SITE-SPECIFIC field schemas
│           ├── editable-config.ts     # Which sections are editable
│           └── auth.ts                # Thin wrapper for session check
├── middleware.ts                      # Auth check for ?edit=true
└── .env.local                         # CMS_GRAPHQL_URL, etc.
```

### Key Components

#### 1. EditModeProvider

```tsx
// src/components/inline-edit/EditModeProvider.tsx

interface EditModeContextValue {
  isEditMode: boolean;
  permissions: UserPermissions;
  user: CmsUser | null;
  openEditor: (sectionId: string, sectionData: unknown, schema: FieldSchema[]) => void;
  closeEditor: () => void;
  saveSection: (sectionId: string, data: unknown) => Promise<void>;
}

export function EditModeProvider({
  children,
  user,
  permissions
}: EditModeProviderProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<unknown>(null);

  // ... implementation

  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
      <EditToolbar />
      <EditDrawer
        isOpen={!!editingSection}
        sectionId={editingSection}
        data={sectionData}
        onClose={closeEditor}
        onSave={saveSection}
      />
    </EditModeContext.Provider>
  );
}
```

#### 2. EditableSection

```tsx
// src/components/inline-edit/EditableSection.tsx

interface EditableSectionProps {
  sectionId: string;           // e.g., "hero", "intro", "events"
  sectionData: unknown;        // Current data for this section
  schema: FieldSchema[];       // Field definitions for the edit form
  children: React.ReactNode;   // The actual section content
}

export function EditableSection({
  sectionId,
  sectionData,
  schema,
  children
}: EditableSectionProps) {
  const { isEditMode, permissions, openEditor } = useEditMode();

  if (!isEditMode || !permissions.canEdit) {
    return <>{children}</>;
  }

  return (
    <div className="group relative">
      {children}

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                      border-2 border-blue-500 border-dashed
                      pointer-events-none transition-opacity" />

      {/* Edit button */}
      <button
        onClick={() => openEditor(sectionId, sectionData, schema)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                   bg-blue-600 text-white p-2 rounded-full shadow-lg
                   hover:bg-blue-700 transition-all"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
```

#### 3. Section Schema Definitions

```tsx
// src/lib/cms/section-schemas.ts

export const sectionSchemas: Record<string, FieldSchema[]> = {
  hero: [
    { slug: 'logoSrc', name: 'Logo Image', type: 'media', required: true },
    { slug: 'leftImage', name: 'Left Image', type: 'media', required: true },
    { slug: 'rightImage', name: 'Right Image', type: 'media', required: true },
  ],

  intro: [
    { slug: 'heading', name: 'Heading', type: 'text', required: true },
    { slug: 'paragraph', name: 'Description', type: 'richText', required: true },
    { slug: 'buttonText', name: 'Button Text', type: 'text', required: true },
    {
      slug: 'location',
      name: 'Location',
      type: 'json',
      fields: [
        { slug: 'label', name: 'Label', type: 'text' },
        { slug: 'address', name: 'Address', type: 'text' },
        { slug: 'phone', name: 'Phone', type: 'text' },
      ]
    },
  ],

  events: [
    { slug: 'heading', name: 'Heading', type: 'text', required: true },
    { slug: 'paragraph', name: 'Description', type: 'richText', required: true },
    { slug: 'imageSrc', name: 'Image', type: 'media', required: true },
    { slug: 'buttonText', name: 'Button Text', type: 'text', required: true },
    { slug: 'buttonHref', name: 'Button Link', type: 'text', required: true },
  ],

  gallery: [
    {
      slug: 'images',
      name: 'Gallery Images',
      type: 'array',
      itemSchema: [
        { slug: 'src', name: 'Image', type: 'media', required: true },
        { slug: 'alt', name: 'Alt Text', type: 'text', required: true },
      ]
    }
  ],

  // ... more sections
};
```

### Middleware for Auth

```typescript
// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isEditMode = request.nextUrl.searchParams.get('edit') === 'true';

  if (!isEditMode) {
    return NextResponse.next();
  }

  // Check for CMS auth cookie
  const authToken = request.cookies.get('cms_access_token')?.value;

  if (!authToken) {
    // Redirect to CMS login with return URL
    const loginUrl = new URL(process.env.CMS_LOGIN_URL!);
    loginUrl.searchParams.set('return_url', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Validate token with CMS (could be done server-side in page)
  // For performance, basic validation here, full check in page

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Save Flow

```typescript
// src/lib/cms/save-section.ts

export async function saveSectionContent(
  pageSlug: string,
  sectionId: string,
  sectionData: unknown,
  authToken: string
): Promise<{ success: boolean; error?: string }> {

  // 1. Fetch current page content
  const currentPage = await fetchPageContent(pageSlug, authToken);

  // 2. Merge section data into page content
  const updatedData = {
    ...currentPage.data,
    [sectionId]: sectionData,
  };

  // 3. Save to CMS
  const result = await graphqlMutation({
    query: UPDATE_CONTENT_ENTRY,
    variables: {
      id: currentPage.id,
      input: { data: updatedData },
    },
    token: authToken,
  });

  // 4. Revalidate page cache
  await revalidatePath(`/${pageSlug}`);

  return { success: true };
}
```

---

## API Endpoints

### CMS GraphQL Mutations Used

```graphql
# Update content entry (save section changes)
mutation UpdateContentEntry($id: ID!, $input: UpdateContentEntryInput!) {
  updateContentEntry(id: $id, input: $input) {
    id
    slug
    data
    updatedAt
  }
}

# Upload media (for image picker)
mutation UploadMedia($input: UploadMediaInput!) {
  uploadMedia(input: $input) {
    id
    filename
    mimeType
    variants {
      original
      thumbnail
      medium
      large
    }
  }
}

# Get current user and permissions
query Me {
  me {
    id
    email
    firstName
    lastName
    roles {
      role {
        name
      }
      organizationId
    }
  }
}
```

### Website API Routes (if needed)

```
POST /api/edit/save-section
  Body: { pageSlug, sectionId, data }
  Auth: CMS token in cookie
  Response: { success: boolean, error?: string }

GET /api/edit/media
  Query: { organizationId }
  Auth: CMS token in cookie
  Response: { items: MediaAsset[], total: number }
```

---

## Security Considerations

### 1. Token Security

- Use HTTP-only cookies for auth tokens (not accessible via JavaScript)
- Set `Secure` flag for HTTPS-only transmission
- Set `SameSite=Strict` to prevent CSRF
- Token expiration and refresh flow

```typescript
// Cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
};
```

### 2. Server-Side Validation

- Always validate permissions server-side before saving
- Never trust client-side permission checks alone
- Validate organization membership for every write operation

```typescript
// Server-side permission check
async function validateEditPermission(
  authToken: string,
  organizationId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const user = await verifyToken(authToken);
  if (!user) return { allowed: false, reason: 'Invalid token' };

  const roles = await getUserRolesForOrg(user.id, organizationId);
  const canEdit = roles.some(r =>
    ['SYSTEM_ADMIN', 'ORG_ADMIN', 'CONTENT_EDITOR'].includes(r)
  );

  if (!canEdit) return { allowed: false, reason: 'Insufficient permissions' };

  return { allowed: true };
}
```

### 3. Input Sanitization

- Sanitize rich text input to prevent XSS
- Validate media uploads (handled by CMS)
- Validate URLs and references

### 4. Rate Limiting

- Implement rate limiting on save endpoints
- Prevent abuse of media upload

---

## Edge Cases

### 1. Concurrent Editing

If two users edit the same section simultaneously:
- Last write wins (simple approach)
- Or: Show warning if content changed since load (optimistic locking)

```typescript
// Optimistic locking
const savedEntry = await save(data);
if (savedEntry.updatedAt !== originalUpdatedAt) {
  throw new Error('Content was modified by another user. Please refresh.');
}
```

### 2. Session Expiry

- Detect expired session when saving
- Show login modal without losing unsaved changes
- Re-authenticate and retry save

### 3. Network Errors

- Show clear error messages
- Allow retry
- Auto-save drafts to localStorage as backup

### 4. Large Media Uploads

- Show upload progress
- Handle timeout gracefully
- Compress images client-side if needed

---

## Future Enhancements

1. **Draft/Publish Workflow**: Save as draft, preview, then publish
2. **Version History**: View and restore previous versions
3. **Real-time Preview**: See changes instantly without saving
4. **Collaborative Editing**: See who else is editing
5. **Scheduled Publishing**: Set publish date/time
6. **Content Locking**: Lock section while editing to prevent conflicts

---

## Implementation Phases

### Phase 1: Foundation (CMS Project)
**Location:** `headless-cms/packages/inline-editor/`

- [ ] Set up package structure with TypeScript and build config
- [ ] EditModeProvider component and context
- [ ] EditToolbar component (floating bar)
- [ ] EditableSection wrapper component
- [ ] Basic EditDrawer UI shell
- [ ] Types and interfaces exported

### Phase 2: Field Components (CMS Project)
**Location:** `headless-cms/packages/inline-editor/src/components/fields/`

- [ ] TextField (single-line text)
- [ ] NumberField (numeric input)
- [ ] BooleanField (toggle/checkbox)
- [ ] SelectField (dropdown)
- [ ] DateField (date picker)

### Phase 3: Rich Fields (CMS Project)
**Location:** `headless-cms/packages/inline-editor/src/components/fields/`

- [ ] RichTextField (WYSIWYG editor - TipTap or similar)
- [ ] MediaField with MediaLibraryModal
- [ ] ArrayField (repeatable items)
- [ ] ObjectField (nested fields)

### Phase 4: Auth & Save (CMS Project)
**Location:** `headless-cms/packages/inline-editor/src/lib/`

- [ ] Auth utilities (token validation, permission helpers)
- [ ] GraphQL client for CMS API
- [ ] Save content mutation helpers
- [ ] Permission checking utilities

### Phase 5: Website Integration (Website Project)
**Location:** `nomad-SOS-cms/`

- [ ] Install @sphereos/inline-editor package
- [ ] Create section-schemas.ts with all page section schemas
- [ ] Add middleware.ts for ?edit=true auth check
- [ ] Wrap layout with EditModeProvider
- [ ] Wrap section components with EditableSection
- [ ] Configure environment variables

### Phase 6: Polish (Both Projects)
**CMS Project:**
- [ ] Error handling and retry logic
- [ ] Loading states and animations
- [ ] Success/error toast notifications
- [ ] Mobile responsive edit UI
- [ ] Publish package to npm

**Website Project:**
- [ ] Custom theme/styling overrides
- [ ] Test all editable sections
- [ ] Documentation for content editors

### Phase 7: Advanced Features (Future)
**CMS Project:**
- [ ] Draft/publish workflow
- [ ] Version history
- [ ] Real-time preview (optimistic updates)
- [ ] Collaborative editing indicators
- [ ] Scheduled publishing

---

## Related Files

### CMS Project (headless-cms)
- Roles: `src/common/auth/constants/roles.constant.ts`
- Field Types: `admin/src/types/content-type.ts`
- Field Renderer (reference): `admin/src/components/fields/field-renderer.tsx`
- Inline Editor Package: `packages/inline-editor/` (to be created)

### Website Project (nomad-SOS-cms)
- Section Schemas: `src/lib/cms/section-schemas.ts` (to be created)
- Editable Config: `src/lib/cms/editable-config.ts` (to be created)
- Page Content JSON: `src/content/pages/*.json`
- Middleware: `middleware.ts` (to be updated)

---

## References

- SphereOS CMS GraphQL API
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- TipTap Editor: https://tiptap.dev/ (recommended for RichTextField)
- Radix UI: https://www.radix-ui.com/ (recommended for accessible UI primitives)
