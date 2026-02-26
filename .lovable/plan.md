

# OmniCraft AI — Major Expansion Plan

## Summary

The current app has 5 pages (Dashboard, Image Studio, Video Studio, Audio Studio, Stock Assets) with basic tooling. This plan expands it into a comprehensive platform with 13+ distinct tool pages, a floating AI chat assistant, expanded sidebar navigation, enhanced settings page, and mock Supabase auth/gallery UI.

---

## New Pages to Create

### SECTION 1: Image Studio Expansion
1. **Background Remover** (`/bg-remover`) — Drag-and-drop image upload, before/after preview, "Remove Background" button with loading state
2. **Image Upscaler** (`/image-upscaler`) — Upload image zone, quality selector (2x/4x), side-by-side comparison, "Upscale to 4K" button
3. **Face Swap** (`/face-swap`) — Two upload zones (Base Image + Face Image), "Swap Face" button, result preview area

### SECTION 2: Video Expansion
4. **AI Video Generator** (`/video-generator`) — Text prompt input, duration/style selectors, generate button, video output placeholder
5. **Video Color Grading** — Already exists at `/video-studio`, will be enhanced with a drag-and-drop upload zone

### SECTION 3: Audio & Music Expansion
6. **AI Music Generator** (`/music-generator`) — Prompt input for BGM generation, genre/mood selectors, audio player output
7. **Full Song Creator** (`/song-creator`) — Lyrics textarea + music style input, "Create Song" button, audio player output
8. **Voice Enhancement** — Already exists at `/audio-studio`, keeping as-is

### SECTION 4: Editing & Captions
9. **Auto Subtitles** (`/auto-subtitles`) — Video upload zone, timeline placeholder, generated transcript text area with editable subtitle lines

### SECTION 5: Stock Assets Expansion
10. **SFX Search** (`/sfx-search`) — Separate search bar for sound effects, audio wave player cards with play/download buttons

### Enhanced Existing Pages
11. **Settings Page** (`/settings`) — Full dedicated page (not just modal) with API key management for: Hugging Face, Gemini, Pexels, Groq, Cloudinary. Keep modal trigger in header too
12. **Dashboard** — Add feature cards for ALL new tools (13+ cards in a grid)

---

## Floating AI Chat Assistant

- A persistent floating button (bottom-right corner) with a chat icon and gradient glow
- Clicking opens a glassmorphism chat panel (400px wide, ~500px tall)
- Header says "OmniCraft AI Assistant" with a close button
- Message list area with user/assistant message bubbles
- Input field + send button at the bottom
- Mock responses (no real API call — conceptually powered by Gemini 3 Flash)
- Context-aware mock responses based on current route (e.g., on Image Studio: "I can help you write better prompts!")
- Component: `src/components/AIChatAssistant.tsx`, rendered in `Layout.tsx`

---

## Sidebar Navigation Update

Reorganize `AppSidebar.tsx` with grouped sections:

```text
Dashboard
─────────────
IMAGE STUDIO
  AI Image Generator
  Background Remover
  Image Upscaler
  Face Swap
─────────────
VIDEO & MOTION
  AI Video Generator
  Video Color Grading
─────────────
AUDIO & MUSIC
  AI Music Generator
  Full Song Creator
  Voice Enhancement
─────────────
EDITING
  Auto Subtitles
─────────────
STOCK ASSETS
  Stock Footage
  SFX Search
─────────────
Settings
```

Each group uses `SidebarGroup` with a label. Icons from lucide-react for each item.

---

## Settings Page (Full Page)

- Route: `/settings`
- Full-page layout with glassmorphism cards
- API key inputs for: Hugging Face, Gemini API, Pexels, Groq, Cloudinary
- Password-type inputs with show/hide toggle
- Save to localStorage
- Toast confirmation on save
- Also keep the modal version accessible from the header "API Keys" button

---

## Mock Auth & Gallery UI

- A simple mock auth section on the Settings page with "Sign In" / "Sign Up" form (email + password fields, no real Supabase connection — just UI)
- A "My Gallery" section on the Dashboard or a separate route showing saved creations in a grid (mock data)
- Supabase client file created at `src/integrations/supabase/client.ts` with placeholder URL/key from localStorage

---

## Router Updates (`App.tsx`)

Add routes for all new pages:
- `/bg-remover`
- `/image-upscaler`
- `/face-swap`
- `/video-generator`
- `/music-generator`
- `/song-creator`
- `/auto-subtitles`
- `/sfx-search`
- `/settings`

---

## Dashboard Update

Replace current 4 tool cards with a comprehensive grid of 13+ feature cards, each with:
- Unique gradient accent
- Icon + title + short description
- Click navigates to the tool page
- Organized by section headers (Image, Video, Audio, Editing, Stock)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/AIChatAssistant.tsx` | Floating AI chat widget |
| `src/pages/BackgroundRemover.tsx` | BG removal tool |
| `src/pages/ImageUpscaler.tsx` | Image upscaling tool |
| `src/pages/FaceSwap.tsx` | Face swap tool |
| `src/pages/VideoGenerator.tsx` | Text-to-video tool |
| `src/pages/MusicGenerator.tsx` | AI music/BGM tool |
| `src/pages/SongCreator.tsx` | Full song creation tool |
| `src/pages/AutoSubtitles.tsx` | Auto subtitle generator |
| `src/pages/SfxSearch.tsx` | Sound effects search |
| `src/pages/Settings.tsx` | Full settings/API keys page |

## Files to Edit

| File | Changes |
|------|---------|
| `src/App.tsx` | Add all new routes |
| `src/components/AppSidebar.tsx` | Grouped navigation with all tools |
| `src/components/Layout.tsx` | Add AIChatAssistant component |
| `src/pages/Index.tsx` | Expanded dashboard with all 13+ feature cards |
| `src/pages/VideoStudio.tsx` | Add drag-and-drop upload zone |
| `src/components/SettingsModal.tsx` | Add Gemini, Groq, Cloudinary fields |

---

## Technical Notes

- No new dependencies needed — all built with existing Tailwind, Radix, lucide-react, sonner
- All tool pages follow the same layout pattern: main workspace + right properties panel
- Mock/simulated processing with `setTimeout` and loading states
- All data stored in localStorage (API keys)
- Fully responsive — right panels stack below on mobile
- Each page uses `animate-fade-in` class for smooth entry

