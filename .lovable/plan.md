# KMs Creative — Futuristic Rebuild

A staged plan so we ship in reviewable chunks instead of one huge unreviewable turn. Each stage is independently useful.

## Stage 1 — Visual foundation (this turn)

**Goal:** the whole site instantly looks different — liquid glass everywhere, unique WebGL background, light/dark toggle, expandable "device" navigation inspired by your reference.

- **WebGL shader background** replacing the current radial gradients. Custom fragment shader — flowing liquid-metal plasma tinted by the active theme, drifts slowly, reacts to cursor. Unique (not a generic three.js scene), GPU-light, gracefully falls back to a CSS gradient if WebGL is unavailable.
- **Liquid-glass design tokens** in `src/styles.css`: new `--glass-*` variables (blur, saturation, tint, inner light, hairline border) applied to nav, cards, buttons, dashboard panels, service tiles, forms. Real backdrop-filter + layered specular highlight (iPhone-style, not flat frosted).
- **Light + dark mode toggle** in the nav. Both palettes tuned properly (not just inverted); shader tint follows theme; preference persisted in `localStorage`, respects `prefers-color-scheme` on first load.
- **Expandable "device" nav** modelled on your reference image: collapsed as a floating glass pill with just the logo + a morph button; taps/hover expands it horizontally into a full nav bar with icons for each section (Home, About, Services, Dashboard/Login, Inquire). Smooth spring animation. Mobile: same pill, expands into a stacked glass sheet.

## Stage 2 — Service pages with sub-categories

**Goal:** every service card on the home page opens into its own explorable page with sub-services.

Each service (`/services/$slug`) becomes a rich page with:
- Hero with the service name, tagline, and a floating 3D glass artefact themed to the service.
- **Sub-categories** as expandable glass cards. For example Video Production → Short-form Reels, Long-form YouTube, Commercials, Event Recaps, Wedding Films — each with description, deliverables, timeline, sample formats.
- Process section (Discover → Plan → Craft → Deliver).
- Pricing tiers or "starts from" indicator with a Telegram CTA.
- Related services carousel.

Sub-category data lives in `src/lib/services.ts` (extended). Each service gets its own metadata for SEO.

## Stage 3 — Dashboard upgrade

**Goal:** the client area feels like a premium ops cockpit, not a plain list.

- Liquid-glass panels matching the new system.
- Greeting card with time-of-day awareness and next-action prompt.
- Projects board grouped by status (To Do / In Progress / Completed) with progress bars, due-date pills, quick status change.
- **"Start a new project"** flow: a glass modal wizard — pick service → pick sub-category → describe → submit. Creates a `projects` row scoped to the signed-in user (uses existing table + RLS).
- Messages panel with unread badge, mark-as-read, empty state.
- Account section with sign-out.

## Stage 4 — Email 2FA on signup + login

**Goal:** after entering credentials, user gets a 6-digit code by email and must enter it to finish signing in.

Requires email domain setup (you confirmed yes). Steps:

1. Configure email domain (opens the setup dialog) → set up email infrastructure → scaffold auth email templates styled to match the new glass look.
2. New table `auth_codes` (user_id, code_hash, purpose, expires_at, consumed_at, attempts) with RLS locked down, only server functions touch it.
3. Server functions:
   - `requestAuthCode` — after successful password check, generate a 6-digit code, hash+store, email it via the scaffolded transactional pipeline, return a challenge id.
   - `verifyAuthCode` — accept challenge id + code, verify hash, expiry (10 min), attempt cap (5), then set the Supabase session cookie.
4. Auth page becomes a two-step flow: credentials → code entry (glass OTP input, resend cooldown, expiry countdown).
5. Once verified, land on `/dashboard` where "Start a new project" from Stage 3 is waiting.

## Order of operations

Ship **Stage 1** this turn (biggest visual payoff, unblocks everything else). Then Stages 2 → 3 → 4 in follow-up turns. Reply "go" to start Stage 1, or tell me to reorder / drop a stage.

## Technical notes

- Shader: single full-screen quad, GLSL fragment shader with FBM + domain warping, tinted by theme uniform. `requestAnimationFrame` paused when tab is hidden.
- Theme: `class="dark"` toggled on `<html>`; both palettes defined in `src/styles.css`; `SiteShell` reads/writes the preference.
- Nav: framer-motion (already fine with our stack via Motion) or pure CSS spring — I'll use CSS + `useState` to avoid a new dependency unless Motion is already installed.
- 2FA: codes hashed with Web Crypto SHA-256 + a per-code random salt stored alongside; codes never logged.
- Loader safety: dashboard and code-verify server fns stay under `_authenticated` or are called from components with `useServerFn` (never from public loaders).