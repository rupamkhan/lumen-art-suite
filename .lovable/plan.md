

# Premium Homepage & UI/UX Overhaul

## Current State
The dashboard is functional but basic — a simple welcome text, 3 quick-start cards (not filling the grid properly), and skeleton placeholder projects. It lacks the "wow factor" of a premium creative studio.

## What Will Change

### 1. Hero Section — Dramatic & Animated
- Full-width hero with animated gradient mesh background (CSS keyframe animation)
- Large bold headline: "Create. Enhance. Transform." with gradient text
- Subtitle with typing-style fade-in effect
- Two CTA buttons: "Start Creating" (gradient glow) and "Explore Tools" (outline)
- Floating decorative orbs with blur for depth

### 2. Stats/Trust Bar
- A row of 4 glass cards showing mock stats: "10K+ Images Generated", "5K+ Audio Enhanced", "HD & 4K Stock", "AI Powered"
- Animated count-up numbers on scroll
- Subtle neon icon accents

### 3. Quick Start Tools — 4 Cards, Better Layout
- Add a 4th card: "Edit Video" linking to video studio
- Larger cards with icon, title, description, and a subtle arrow indicator
- Hover: card lifts with glow shadow, icon scales up
- Each card gets a unique gradient accent line on top

### 4. "How It Works" Section
- 3-step horizontal flow: "Choose a Tool" → "Customize with AI" → "Export & Share"
- Step numbers in gradient circles, connected by a dashed line
- Clean iconography and short descriptions

### 5. Feature Showcase — Bento Grid
- A modern bento-style grid (mixed sizes) showcasing key features:
  - Large card: "AI Image Generation" with mock preview
  - Medium card: "Voice Enhancement" with waveform graphic
  - Medium card: "Color Grading" with preset swatches
  - Small card: "Stock Library" with search icon
- Each with glass effect and hover glow

### 6. Recent Projects — Improved
- Better card design with gradient overlay on thumbnails
- "View All" link button
- Show project type badge (Image, Video, Audio)

### 7. CTA Footer Banner
- Full-width glass banner: "Ready to create something amazing?"
- Gradient "Get Started" button
- Decorative background blur elements

### 8. Global UI Polish (across all pages)
- Add smooth fade-in animation class for page content (`animate-in` with CSS)
- Improve sidebar active state with a left accent bar
- Add subtle hover transitions to all interactive elements
- Ensure consistent spacing and typography scale

## Technical Approach
- All changes in `src/pages/Index.tsx` for the homepage
- Add new CSS animations in `src/index.css` (gradient mesh, fade-in, float)
- Minor touch-ups to `Layout.tsx` and `AppSidebar.tsx` for polish
- No new dependencies needed — pure Tailwind CSS + existing components

## Files to Create/Edit
- `src/pages/Index.tsx` — Complete rewrite with premium sections
- `src/index.css` — New animation keyframes and utility classes
- `src/components/AppSidebar.tsx` — Active state accent bar
- `src/components/AppHeader.tsx` — Minor spacing polish

