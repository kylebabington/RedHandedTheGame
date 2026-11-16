# Design System — The Evidence Room

**Status:** Approved requirements from master plan §9. Token foundation implemented in M0 CSS. Cinematic UI foundation implemented in Milestone 2.

## Design philosophy

Premium editorial true crime meets cinematic detective interface. The experience should feel like an interactive investigative documentary, not a dashboard.

## Palette (approved)

| Token | Color | Usage |
| --- | --- | --- |
| Background | `#0B0B0D` | Main background |
| Surface | `#17171B` | Panels |
| Elevated | `#232329` | Dialogs and overlays |
| Crimson | `#B91C2B` | Primary accent |
| Crimson Bright | `#E33445` | Interactive highlights |
| Paper | `#E9E1D2` | Evidence documents |
| White / Ink | `#F5F3EF` | Primary text |
| Muted | `#A5A2A3` | Secondary text |
| Border | `#39373C` | Dividers |
| Success | `#79A88C` | Confirmed findings |
| Warning | `#D6A45B` | Unresolved findings |

These are proposed game colors, not verified official RedHanded brand specifications.

## Typography (approved)

| Role | Font | License note |
| --- | --- | --- |
| Display | Fraunces | Google Fonts (OFL) |
| Interface | DM Sans | Google Fonts (OFL) |
| Metadata | IBM Plex Mono | Google Fonts (OFL) |

Loaded via Google Fonts CSS in `src/styles/global.css` for the prototype.

## Spacing and radius

8px-based spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96.

Border radius: small 4px, medium 8px, large 12px. Avoid excessive rounding.

## Motion and audio

Animations must communicate discoveries and transitions. Respect `prefers-reduced-motion`.

Audio must be original. No unauthorized host voice imitation or copyrighted podcast recordings.

## Implemented in M0

- CSS `@theme` tokens matching the approved palette
- Font loading for Fraunces, DM Sans, IBM Plex Mono
- Focus-visible styles and reduced-motion baseline
- Minimal accessible shell (superseded visually by M2)

## Implemented in M2

- Cinematic AppShell with atmospheric background and original grain texture (`public/textures/`)
- Shared crimson-accent buttons
- Case-file transition on case introduction (Motion; respects reduced motion)
- Paper texture on case-file surface
- In-app reduced-motion preference (combined with OS preference)
- Text-size preference (`default` / `large`) via `data-text-size`
- Shared primary navigation across screens

## Planned (later)

Evidence inspection polish, board/interview/timeline visuals, audio skinning, pitch packaging motion.
