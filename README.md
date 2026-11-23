# Nimbus Client Website (`nimbus-web`)

Official website for **Nimbus Client & Nimbus Launcher**, ready for 1-click deployment on **Vercel** directly from GitHub.

## Features
- **Automatic Latest Version Download:** Pulls `NimbusSetup.exe` & `NimbusLauncher.exe` dynamically from `watrak77-prog/nimbus-launcher` GitHub Releases (with clean `/download` and `/download/portable` redirect URLs).
- **Live Download Counter:** Starts at `1789` (`BASE_DOWNLOADS`) + real cumulative `.exe` download counts across all GitHub Releases via Vercel Edge-cached serverless API (`/api/release`).
- **Interactive Client Preview:** Visitors can toggle live HUD widgets (FPS, CPS, Coords, Keystrokes, Potions, Waypoints), switch to the In-Game Title Screen or Launcher mockup, and compare FPS presets.
- **PL / EN Language Switcher**, searchable 36+ built-in modules catalog, official Minecraft version artwork, live GitHub Changelog, and FAQ.

## Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import **`watrak77-prog/nimbus-web`**.
2. Keep default settings (Framework Preset: **Other**, zero build command needed) and click **Deploy**.
3. *(Optional)* Add environment variables in Vercel Project Settings:
   - `BASE_DOWNLOADS` — starting download offset (default: `1789`)
   - `NIMBUS_REPO` — GitHub releases repo (default: `watrak77-prog/nimbus-launcher`)
   - `GITHUB_TOKEN` — optional read-only GitHub token to raise API rate limits even further.
4. *(Optional)* Attach your custom domain (e.g. `nimbusclient.world`) under **Project Settings → Domains**.
