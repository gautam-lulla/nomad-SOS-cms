# Component Inventory

## UI Primitives

### Button
- **Variants:** fill-to-stroke, stroke-to-fill
- **States:** default, hover
- **Props:** children, variant, onClick
- **Usage:** Reserve a Table, See Menu, Contact Us, etc.

### Input
- **Variants:** email input with arrow
- **States:** default, focused
- **Props:** placeholder, type, onChange
- **Usage:** Newsletter subscription in footer

### Checkbox
- **States:** unchecked, checked
- **Usage:** Privacy policy agreement

## Layout Components

### Navigation (Desktop)
- Logo mark (centered, 110x110px)
- Hamburger menu button (left)
- Reserve a Table button (right, pink background)

### Navigation (Mobile)
- Logo mark (centered)
- Hamburger menu icon (left)
- Reserve button (right)

### Expanded Menu
- Full-screen overlay
- Background image (right side)
- Menu links (Home, Menu, Private Events, Programming, About)
- Location & Hours info
- Close button

### Footer
- Pink background (#f07aaa)
- Four columns: Address, Hours, Links, Newsletter
- NoMad Wynwood logo (centered, dark)
- Horizontal wordmark
- Bottom bar with legal links (dark background)

## Block Components

### HeroSplitScreen
- Two images side by side
- Optional gradients (top/bottom)
- Logo overlay
- **Usage:** Homepage hero

### HeroWithHeading
- Full-width image/video
- Heading text
- **Usage:** About page hero

### SectionHalfScreen
- **Variants:** image-left, image-right
- Content: heading, paragraph(s), optional button
- **Usage:** Homepage sections, About sections

### TextSection
- Centered text content
- Heading + paragraph
- **Usage:** About page quotes

### Gallery
- Three images in a row
- Equal width
- **Usage:** Homepage gallery

### TeamGrid
- Three staff cards in a row
- Image, name, title, description
- **Usage:** About page team section

### AwardsCarousel
- Grid of award logo cards
- Carousel arrows
- **Usage:** About page awards

### FAQAccordion
- Question text
- Add/minus icon
- Expandable answer
- **Usage:** About page FAQ, FAQ page

### InstagramFeed
- Title + handle
- Four images in a row
- **Usage:** Homepage, About page

### MenuLink (Navigation)
- Large text link
- Hover state (italic, pink)
- **Usage:** Expanded navigation menu

## Page Structures

### Homepage (1440px)
1. Navigation (sticky)
2. HeroSplitScreen
3. Text + Button section with Location/Hours
4. Gallery (3 images)
5. Menu section (text + full-width image)
6. SectionHalfScreen (image right) - Events
7. SectionHalfScreen (image left) - Contact
8. InstagramFeed
9. Footer

### About
1. Navigation (sticky)
2. HeroWithHeading
3. SectionHalfScreen - Heritage
4. TextSection
5. TeamGrid (3 cards)
6. Full-width image
7. AwardsCarousel
8. FAQAccordion (5 items)
9. InstagramFeed
10. Footer

### Private Events
1. Navigation
2. Hero image
3. Content sections
4. Gallery
5. Footer

### Menu
1. Navigation
2. Menu categories
3. Footer

### Programming
1. Navigation
2. Events listing
3. Footer

### Contact
1. Navigation
2. Contact info + map
3. Footer

### FAQ
1. Navigation
2. FAQ accordions
3. Footer

### 404
1. Navigation
2. Error message + link
3. Footer
