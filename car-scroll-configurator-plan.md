# Master Implementation Plan — 3D Scroll Car Configurator Demo

**Stack:** Vite + React + TypeScript · Tailwind CSS (v4, via `@tailwindcss/vite`) · R3F/Three.js · GSAP ScrollTrigger · Lenis · Framer Motion · Drei

**Target outcomes (from brief):**
1. Scroll-driven storytelling: Exterior → Performance Specs → Interior Cabin
2. Dynamic, high-res feature showcases (contrast packages, styling details)
3. Interactive spec matrix — real-time color/trim configuration
4. No lag, anywhere

---

## Model — Confirmed

**Tesla Roadster 2020** by metarex.4d (reuploaded by vecarz.com), CC-BY-4.0.
Credit required: *"3D model by metarex.4d, via Sketchfab, CC Attribution."*
Source: https://sketchfab.com/3d-models/tesla-roadster-2020-wwwvecarzcom-fac3d813620f4c4a95da1933c2592069

Component: `src/components/Roadster.tsx` (exported as `Roadster`), asset at `public/scene.glb` (6.37MB, Draco-compressed via gltf.report — Edgebreaker/Mesh quantize).

**⚠️ Do not run `gltf-transform dedup`/`weld`/`draco` on `scene.glb` again** — it silently merges materials with identical property values (lost `indicator_right`, `Glass_rear_lights_main`, `Glass_rear_lights_DHO` on first attempt) and re-inflates file size after decoding existing Draco compression. The current `scene.glb` is final for this project.

**Confirmed material map (26 materials) — use these exact names in code:**

| Purpose | Material name(s) |
|---|---|
| Body paint (configurator target) | `car_main_paint` — untextured, safe for `.color.set(hex)` |
| Wheels/rims | `Rims` |
| Interior | `interior`, `seats` |
| Trim/accent | `chrome`, `carbon_fibre`, `non_lustrous_metal` |
| Glass (by tint) | `Glass_mid_tint`, `Glass_Amber`, `Glass_Clear`, `Glass_Tint_max`, `Glass_rear_lights_main`, `Glass_rear_lights_DHO` |
| Lights | `headlights_AHO`, `headlights_main`, `indicator_left`, `indicator_right`, `licence_plate_light` |
| Misc | `Brake_Disc`, `Thread`, `Sidewall`, `mirror`, `grill`, `calipers`, `ior_1`, `` `Metal_-_Black_rough` `` (note: literal hyphen — must use bracket access `materials['Metal_-_Black_rough']`, not dot notation) |

---

## Progress

- [x] Phase 0 — Model sourced, validated, compressed, `gltfjsx`'d, component renamed/relocated
- [ ] Phase 1 — Scene & camera skeleton (in progress: Canvas/Suspense/Environment scaffolded, `npm run dev` confirmed running — visual confirmation of render pending)
- [ ] Phase 2 — Scroll engine
- [ ] Phase 3 — Section content
- [ ] Phase 4 — Configurator
- [ ] Phase 5 — Perf pass & polish

---

## Phase 0 — Setup & Asset Validation ✅ COMPLETE

**Model:** Tesla Roadster 2020 by metarex.4d (reuploaded by vecarz), Sketchfab, **CC-BY-4.0**.
Attribution required — add to site footer/README:
> 3D model "Tesla Roadster 2020" by metarex.4d, via Sketchfab (vecarz reupload), CC-BY-4.0.
> https://sketchfab.com/3d-models/tesla-roadster-2020-wwwvecarzcom-fac3d813620f4c4a95da1933c2592069

**Asset stats:** `scene.glb` — 6.37MB (Draco-compressed via gltf.report, Edgebreaker method, Mesh quantize), 105 draw calls, 257MB VRAM uncompressed. Compressed further by gltfjsx's own `--transform` pass to 2.16MB, **but that pass merges materials and was discarded** — see pitfall note below.

**Component:** `src/components/Roadster.tsx` — generated via `npx gltfjsx public/scene.glb --types`, exported as `Roadster` (renamed from default `Model`). Asset served from `public/scene.glb`, referenced in-component as `useGLTF('/scene.glb')`.

**⚠️ Pitfall — do not re-run `gltf-transform dedup` or `gltfjsx --transform` on this file.** Both merge materials with identical property values, silently collapsing distinct materials (e.g. `indicator_right` got merged into `indicator_left`, `Glass_rear_lights_main`/`DHO` disappeared). The current `scene.glb` (exported directly from gltf.report, no further transform) is the clean, correct source — treat it as final, don't reprocess it.

**Confirmed material map (26 total) — use these exact names in code:**

| Material | Use |
|---|---|
| `car_main_paint` | Body paint — **no texture**, pure color, ideal for live color-swap |
| `Rims` | Wheel rims — configurable finish |
| `interior` | Cabin interior |
| `seats` | Seats — separate from interior |
| `chrome` | Chrome accents — good for "contrast package" blackout option |
| `carbon_fibre` | Trim accents (13 instances) |
| `non_lustrous_metal` | Matte metal trim |
| `Metal_-_Black_rough` | ⚠️ has a hyphen — access via `materials['Metal_-_Black_rough']`, not dot notation |
| `mirror`, `calipers`, `Brake_Disc`, `Thread`, `Sidewall`, `grill` | Wheel/body detail parts |
| `Glass_Clear`, `Glass_Amber`, `Glass_mid_tint`, `Glass_Tint_max` | Glass variants by tint |
| `Glass_rear_lights_main`, `Glass_rear_lights_DHO` | Rear light lenses |
| `indicator_left`, `indicator_right` | Turn signals — separate, don't merge |
| `headlights_AHO`, `headlights_main`, `licence_plate_light`, `ior_1` | Lighting detail materials |

**Exit criteria — met:** `<Roadster />` renders, all 26 materials confirmed distinct and correctly named, `car_main_paint` confirmed texture-free (safe for `.color.set()` at runtime), file under 7MB.

---

## Phase 1 — Scene & Camera Skeleton

Goal: a static 3D scene that will later be driven by scroll. No scroll logic yet — just prove the render pipeline is clean.

1. `<Canvas dpr={[1, 2]} camera={{ fov: 35 }}>` — cap DPR from day one, not as a later optimization.
2. Wrap scene in `<Suspense fallback={<Loader />}>` — build a lightweight skeleton/spinner now, you'll need it.
3. Add `<Environment preset="studio">` (or a custom HDRI) for realistic paint reflections — this matters a lot visually for "bespoke contrast packages."
4. Place `<Car />`, add basic key/fill lighting only if Environment alone isn't enough.
5. Define **3 fixed camera "shots"** as plain data (position + lookAt + fov) for:
   - Exterior hero (wide 3/4 angle)
   - Performance/detail (close orbit on a feature — wheel, badge, vents)
   - Interior cabin (inside-facing or dashboard close-up)
6. Manually test switching between the 3 camera states with a temporary debug button (not scroll yet) — confirms transitions look good in isolation before you wire up scroll math.

**Exit criteria:** you can jump between 3 camera states and each one looks intentional/composed, not just "camera pointed at car."

---

## Phase 2 — Scroll Engine (the core engineering challenge)

This is where "without lag" is won or lost.

1. Initialize **Lenis** at app root, sync its `scroll` event into GSAP's ticker (`gsap.ticker.add`) so Lenis and GSAP share one RAF loop — never run two independent animation loops.
2. Build a single **scroll-progress-driven camera controller**:
   - One long scroll container (e.g. 300vh–400vh) divided into 3 sections.
   - GSAP `ScrollTrigger` with `scrub: true` reading progress (0→1) across the whole timeline.
   - Interpolate camera position/lookAt using `gsap.utils.interpolate` or a manual lerp between your Phase 1 camera keyframes — **do not re-render React state on every scroll tick**; mutate `camera.position` / a `ref` directly inside `useFrame` or a GSAP `onUpdate`, keyed off a ref holding scroll progress. This is the single biggest lag source if done wrong (React re-renders on scroll = jank).
3. Add per-section `ScrollTrigger` markers for text/UI overlay timing (separate, lighter triggers — these *can* drive React state since they fire once per section, not every scroll pixel).
4. Test scroll on a mid-range device/throttled CPU (Chrome DevTools 4x slowdown) — this is your lag QA, do it now, not at the end.

**Exit criteria:** scrolling through all 3 sections is smooth at 4x CPU throttle with camera lerping via refs, not React state.

---

## Phase 3 — Storytelling Content Per Section

Build section-by-section, testing scroll feel after each one (don't build all 3 blind then test).

**Exterior:**
- Camera orbits/pulls into hero shot
- Overlay text (Framer Motion fade/slide, triggered by section-level ScrollTrigger from Phase 2)
- Optional: subtle auto-rotate paused during active user scroll interaction

**Performance Specs:**
- Camera pushes into a detail (wheel, vent, badge)
- This is the "dynamic, high-res feature showcase" — use close-up framing + shallow depth-of-field feel (achievable via `bokehScale`/postprocessing if budget allows, otherwise tight framing alone sells it) to highlight contrast packages/styling
- Spec callouts (HP, torque, 0-60) as animated numeric counters (Framer Motion or GSAP `textContent` tween) synced to this section's scroll entry

**Interior Cabin:**
- Camera transitions to interior-facing angle
- Highlight materials/trim close-ups

**Exit criteria:** full scroll from top to bottom tells the story with no visual dead zones or jarring camera snaps between sections.

---

## Phase 4 — Interactive Spec Matrix (Color/Trim Configurator)

Build this last, once the base scroll experience is solid — it's additive UI, not scroll-dependent.

1. Config panel as a fixed/sticky UI element (likely pinned during the Exterior section, or a dedicated 4th section — your call on UX, flag if you want my opinion).
2. State: `useState<{ color: string; trim: string }>()` — no external state library needed at this scope.
3. On selection change:
   - Color: `materials.car_main_paint.color.set(hex)` directly (mutate, don't recreate the material — recreating triggers a shader recompile = visible stutter). `car_main_paint` is untextured, so this is a clean, safe swap.
   - Trim options: expose `chrome` (accent finish — e.g. chrome vs blackout), `Rims` (wheel finish), and `interior`/`seats` (cabin material) as separate configurable slots — all confirmed distinct materials, no merge risk
   - If any trim option needs a texture swap rather than flat color, pre-load all texture variants upfront via `useTexture` and swap `.map` reference — never load textures on click, that's a guaranteed lag spike
4. Swatch UI: simple button/swatch row, active state styled with Framer Motion `layoutId` for a smooth selection indicator.

**Exit criteria:** clicking a color/trim swatch updates the model with zero frame drop, textures pre-loaded not fetched on demand.

---

## Phase 5 — Performance Pass & Polish

1. Lighthouse + manual 4x CPU throttle pass on the full scroll experience end-to-end.
2. Confirm: DPR capped, textures ≤2048px, Draco compression applied, no React state updates inside the per-frame scroll loop, all textures preloaded.
3. Add loading screen covering initial GLTF/texture fetch (avoid pop-in).
4. Cross-check on an actual mid-tier mobile device if possible, not just desktop DevTools throttle.
5. Final polish pass: easing curves on camera moves (avoid linear lerp — use `power2.inOut` or similar in GSAP for natural motion), overlay text timing fine-tuned against camera arrival, not fixed scroll percentages.

---

## Build Order Summary (do not skip ahead)

```
Phase 0: Model sourced + validated + optimized + gltfjsx'd
Phase 1: Static 3-shot camera scene, no scroll
Phase 2: Scroll engine wired, lag-tested at 4x throttle
Phase 3: Section content, one section at a time
Phase 4: Color/trim configurator
Phase 5: Perf pass + polish
```

Each phase has an explicit exit criteria — don't move to the next until the current one is genuinely done. Given the iPhone demo's issue was jerky scroll discovered *after* the build, the sequencing here front-loads the lag-risk work (Phase 0 model validation, Phase 2 scroll engine) before any content polish, so problems surface early instead of at the end.
