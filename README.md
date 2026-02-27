# Electromagnetic Field Explorer

An interactive, university-level electromagnetic visualization app built with React, Vite, TypeScript, and Tailwind CSS.

It helps students explore:
- electric fields and dipoles
- magnetic field behavior around a bar magnet
- electromagnetic wave propagation
- combined electro-magnetic visual overlays

## Features

### Simulation Modes
1. Electric Mode
- Place positive and negative charges directly on the canvas
- Drag charges to move them
- Right-click a charge to remove it
- See live field lines and force vectors

2. Magnetic Mode
- Visualize dynamic magnetic field patterns around a bar magnet
- Drag the magnet in the canvas
- Adjust magnet strength and angle in real time

3. EM Wave Mode
- Observe electric and magnetic components propagating as a wave
- Control wavelength and amplitude live

4. Combined Mode
- Overlay electric charge field behavior with magnetic field visualization
- Useful for conceptual comparison in one view

### Interactivity and Learning Tools
- Dipole quick-create button
- Per-charge magnitude slider
- Live field probe with vector direction and magnitude
- Test particle simulation with trajectory trail
- Built-in quiz mode with scoring and feedback
- Educational panel highlighting:
  - Coulomb's law
  - Faraday's law
  - Electromagnetic induction

### Responsive UI
- Mobile-friendly controls drawer
- Desktop collapsible controls panel
- Touch + mouse + pen support via pointer events

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Canvas 2D rendering

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## How to Use

### Electric Field Workflow
1. Select `Electric` mode.
2. Choose positive or negative charge type.
3. Click/tap canvas to place charges.
4. Drag charges to explore interaction patterns.
5. Use `Create Dipole Pair` for a fast dipole setup.

### Magnetic Workflow
1. Select `Magnetic` mode.
2. Drag the magnet in canvas.
3. Adjust `Strength` and `Angle` from controls.

### EM Wave Workflow
1. Select `EM Wave` mode.
2. Tune `Amplitude` and `Wavelength`.
3. Observe how visual wave shape changes in real time.

### Combined Workflow
1. Select `Combined` mode.
2. Place charges and reposition magnet.
3. Compare electric and magnetic effects simultaneously.

## Controls Reference

### Global
- Show/Hide controls panel
- Learn panel toggle
- Quiz mode toggle
- Grid toggle
- Animation speed

### Electric-specific
- Add polarity selector
- Clear all charges
- Selected charge magnitude slider
- Field density slider
- Force vector toggle
- Test particle toggle

### Magnetic-specific
- Magnet strength slider
- Magnet angle slider
- Magnet drag interaction

### Wave-specific
- Wave amplitude slider
- Wavelength slider

## Project Structure

```text
src/
  App.tsx                      # Root composition and page layout
  main.tsx                     # React entrypoint
  index.css                    # Tailwind + custom visual styles
  components/
    Layout.tsx                 # Header, controls, canvas, education, quiz UI
  hooks/
    useSimulationState.ts      # State orchestration and app-level actions
    useCanvasEngine.ts         # Pointer interaction + animation loop bridge
  lib/
    physics.ts                 # Core field/potential calculations
    renderer.ts                # Canvas rendering and visual simulation logic
  types/
    simulation.ts              # Shared domain types
```

## Physics Notes

- Electric field calculations are based on Coulomb's law.
- Potential at a point is computed from the sum of charge contributions.
- Magnetic and EM wave visuals are educational renderings designed for intuition and interaction.

## Customization Guide

### Visual/Theming
- Update gradients, typography, and panel styles in `src/index.css`.
- Modify panel and layout behavior in `src/components/Layout.tsx`.

### Simulation Behavior
- Adjust constants and formatting in `src/lib/physics.ts`.
- Tweak animation style and mode renderers in `src/lib/renderer.ts`.

### State and UX Logic
- Add new mode-level controls in `src/hooks/useSimulationState.ts`.
- Extend pointer interactions in `src/hooks/useCanvasEngine.ts`.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - type-check and production build
- `npm run preview` - preview built app locally

## Audience

Designed for university students studying electromagnetism who need visual intuition alongside formal equations.

## Author

Mofetoluwa

---

Copyright (c) current year. Made with love by Mofetoluwa.
