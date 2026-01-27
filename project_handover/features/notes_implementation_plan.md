# Feature Implementation: Optimized Therapist Note-Taking

## Overview
We will implement a premium, "zen-like" note-taking experience for therapists. This feature is designed to solve the "note bloat" and "time burden" pain points by offering a structured, intelligent, and aesthetically pleasing interface.

## Tech Stack Recommendations
-   **Editor Engine**: [Tiptap](https://tiptap.dev/) (Headless, supports extensions, highly customizable).
-   **UI Components**: `shadcn/ui` (Textareas, Buttons, Dialogs) + Custom Tiptap Toolbar.
-   **Animations**: `framer-motion` for smooth mode transitions (e.g., maximizing the editor).
-   **State Management**: `react-hook-form` for managing the note metadata (Date, Type, Client).
-   **Database**: Supabase `notes` table (already exists, but may need JSONB column for Tiptap content).

## Key Features & User Experience

### 1. The "Zen Mode" Editor
-   **Distraction-Free Writing**: A toggle to expand the editor to full screen, dimming the sidebar.
-   **Split View**: Option to view "Last Session's Note" or "Client Profile" side-by-side with the active cursor.
-   **Rich Text Support**: Bold, Bullet points, Headers—but kept minimal to avoid clutter.

### 2. Smart Templates (The "Golden Thread")
Instead of a blank page, therapists select a template:
-   **SOAP**: Subjective, Objective, Assessment, Plan (Pre-filled headers).
-   **DAP**: Data, Assessment, Plan.
-   **BIRP**: Behavior, Intervention, Response, Plan.
-   **Custom**: Allow saving a draft as a custom template.

### 3. Problem-Solving Features
-   **Auto-Save**: Save to local storage/drafts every 30 seconds to prevent data loss.
-   **"Copy Previous Plan"**: One-click button to pull the "Plan" section from the last note into the current "Subjective" or "Plan" section for continuity.
-   **Quick Phrases**: A "/" command menu (like Notion) to insert common phrases (e.g., "Client arrived on time", "Mood: Anxious").

## Implementation Steps

### Phase 1: Infrastructure
1.  **DB Update**: Ensure `public.notes` has a `content_json` (JSONB) column to store the Tiptap document structure, in addition to the raw text.
2.  **Dependencies**: Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`.

### Phase 2: Component Architecture
Create the following components in `src/components/notes/`:
-   `NoteEditor.tsx`: The main Tiptap wrapper.
-   `NoteToolbar.tsx`: The formatting bar (Bold, Italic, List).
-   `TemplateSelector.tsx`: A modal/dropdown to insert SOAP/DAP structure.
-   `NoteSidebar.tsx`: The side-panel showing previous note history.

### Phase 3: Integration
1.  **Route**: Implement `src/app/dashboard/therapist/clients/[id]/notes/page.tsx`.
2.  **Data Fetching**: Fetch client details and previous notes to populate the "Side View".
3.  **Saving**: Create server action `saveNote` to handle the upsert to Supabase.

## Aesthetic Guidelines
-   **Typography**: Use `Inter` for UI elements but consider `Merriweather` or `Playfair Display` for the note headers to give a "Journal" feel.
-   **Spacing**: Use generous padding (`p-6` or `p-8`) inside the editor container.
-   **Colors**: Use `bg-white` for the paper, but `bg-zen-50` for the surroundings. Use a soft shadow for the paper container.

## Folder Structure
```
src/
  components/
    features/
      notes/
        NoteEditor.tsx
        Toolbar.tsx
        Templates.ts
```

## Immediate Next Task
Execute the setup of the `NoteEditor` component using Tiptap.
