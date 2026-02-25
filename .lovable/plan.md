
# AI Creative Studio — Implementation Plan

## Visual Foundation
- **Dark theme** with background `#09090B`, card surfaces `#18181B`, and neon accent gradients (electric blue `#3B82F6` → purple `#8B5CF6`)
- **Glassmorphism** effects on modals, sidebars, and panels (backdrop-blur, semi-transparent backgrounds)
- **Plus Jakarta Sans** font imported via Google Fonts
- Soft glow/box-shadow on active elements, buttons, and focused inputs
- Custom CSS variables for the entire dark palette

## Layout Structure
- **SidebarProvider** wrapping the entire app with a collapsible left sidebar (icons: Dashboard, Image Studio, Video & Motion, Audio & Voice, Stock Assets, Settings)
- **Top Header** bar with: editable Project Title input, "API Keys" button (opens settings modal), and a glowing gradient "Export / Save" button
- **Main Workspace** area that renders the active tool's screen via React Router
- **Right Properties Panel** that shows contextual controls depending on the active screen (prompt inputs, sliders, filters)
- Fully responsive: sidebar collapses to hamburger on mobile, right panel stacks below workspace

## Screens & Features

### 1. Dashboard (`/`)
- Welcome hero section with greeting and quick-start template cards ("Create Image", "Enhance Voice", "Find Stock Video") — each card with a gradient icon and hover glow
- "Recent Projects" grid with skeleton placeholders and mock project thumbnails

### 2. Image & Graphics Studio (`/image-studio`)
- Large prompt textarea with a glowing gradient "Generate" button
- Dropdowns for Aspect Ratio (1:1, 16:9, 9:16, 4:3) and Style (Photorealistic, Anime, Digital Art, Oil Painting)
- Toggle switches for "Magic Remove" and "Upscale"
- Masonry grid output area showing mock generated images with hover overlay actions
- Right panel: generation settings, seed input, number of images slider
- Pulsing skeleton loader state while "generating"

### 3. Video & Color Grading Hub (`/video-studio`)
- Central video player placeholder (dark frame with play icon)
- Timeline scrubber bar below the player
- Right panel with sliders: Brightness, Contrast, Saturation, Temperature
- 1-click AI Color Grading preset buttons: Cinematic, Vintage, Teal & Orange, Moody — each with a color swatch preview
- Before/After toggle visualization

### 4. Audio & Voice Enhancer (`/audio-studio`)
- Large dashed drag-and-drop zone with upload icon and "Drop your audio file here" text
- Animated audio waveform visualizer (CSS/SVG bars)
- Prominent toggle switch labeled "Enhance Speech (AI)"
- Noise reduction level slider
- "Export High-Quality Audio" gradient button
- Empty state illustration when no file is loaded

### 5. Stock Footage Library (`/stock-assets`)
- Large centered search bar with magnifying glass icon and glassmorphism styling
- Filter chips row: All, Images, Videos, 4K, HD
- Pinterest-style responsive masonry grid of mock stock thumbnails
- Hover overlay on each thumbnail with a download icon button and resolution badge
- Skeleton loading grid while "searching"

### 6. Settings Modal
- Glassmorphism modal overlay
- Sections for API key inputs: Hugging Face, Pexels, Supabase URL & Key
- Password-style inputs with show/hide toggle
- Save button with toast confirmation
- Stored in localStorage for persistence

## Micro-Interactions & UX
- **Skeleton loaders** on all grids and content areas during loading states
- **Toast notifications** via Sonner for success ("Image Generated!", "Voice Enhanced!") and error states
- **Empty states** with illustrated SVG graphics and clear call-to-action text
- Smooth page transitions with fade-in animations
- Hover scale effects on cards and buttons
- Active sidebar item highlighted with gradient accent bar
- Circular spinner overlays for AI processing tasks

## Responsiveness
- Mobile: sidebar hidden behind hamburger menu trigger in header
- Right properties panel stacks below main workspace on screens < 1024px
- Masonry grids adjust from 4 → 2 → 1 columns
- Touch-friendly controls and adequate tap targets
