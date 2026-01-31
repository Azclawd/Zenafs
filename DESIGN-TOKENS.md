# Zenafs UI Direction (TheraDash + TheraDash2)

North star: **TheraDash (primary)** with selective upgrades from **TheraDash2**.

## Keep from TheraDash (the “feel”)
- Airy layout, lots of negative space
- Calm, light canvas background
- Soft card radius and subtle elevation (more border than shadow)
- Clear 3-column structure: sidebar + main + right rail

## Borrow from TheraDash2 (the “best bits”)
- Better information hierarchy inside cards (title → primary metric → supporting meta)
- Schedule/timeline blocks (color-coded but muted)
- Small filter controls (e.g., week selector), but keep minimal
- Card action affordances (kebab menu) — optional

## Zenafs-specific adjustments
- Avoid overly clinical vibe; lean **serene + human**
- Accent palette: soft sage/teal + calm blue (no harsh neon)
- Motions: subtle fades/staggers, gentle hover lift, no aggressive gradients

## Component set to implement first (Therapist dashboard)
1) App shell: sidebar + top header + right rail
2) KPI cards (4)
3) Today’s schedule (timeline or list)
4) Upcoming sessions table/list
5) Quick actions: “Start session”, “Add note”, “Message client” (placeholder)

## Tokens (initial)
- radius:
  - card: 16px
  - input/button: 12px
  - pill: 9999px
- shadows:
  - base: 0 1px 3px rgba(15, 23, 42, 0.06)
  - hover: 0 12px 32px rgba(15, 23, 42, 0.10)
- spacing:
  - page padding: 24–32px
  - card padding: 20–24px
  - grid gap: 16–20px
