<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PathTrick UI/UX Design Rules & Preferences
Always adhere to these specific guidelines when modifying the PathTrick landing page or components:

1. **Background Transitions**: Background images (like `new section.png`) must align perfectly. Do NOT use `cover` if it causes disproportionate scaling or cropping that breaks the visual flow. Use `100% auto` and precise positioning (e.g., `center calc(100vh - 2px)`) to ensure seamless transitions between sections (no "patah" or gaps).
2. **Hover Effects on Cards**: Do NOT use physical movement (`transform: translateY`) on cards for hover states unless explicitly requested. Instead, use an internal image zoom: apply padding (e.g., `padding: 8px`) to the image element inside an `overflow: hidden` container, and use `transform: scale(1.1)` on the image itself. This creates a "pop out" (menonjol) effect without the image being cropped by the container borders.
3. **Card Styling**: Use dark borders (e.g., `3px solid #1a2a3a`) and rounded corners (`border-radius: 12px`) for cards to maintain the pixel-art/game aesthetic.
4. **Layout & Spacing**: Keep generous margins between section titles, content grids, and CTA buttons (e.g., `margin-bottom: 48px` to `64px`). Titles like "FEATURED COURSES" must be explicitly centered (`justify-content: center`).
5. **Typography Colors**: Use `#DD1A21` and `font-weight: bold` for critical highlight text (like "YOUR JOURNEY TO A FUTURE STARTS HERE") to make them stand out.
6. **Scroll Indicators**: "Scroll to explore" or similar hints must always be placed at the **bottom center** of the screen (`justify-content: center; width: 100%`) rather than the left edge, and must be large enough to be clearly legible (e.g., `0.5rem` for pixel fonts).
7. **Asset Sizing & Spacing**: When placing pixel art assets (like feature icons or floating gems/chests) in wide sections, make sure they are scaled up proportionally (e.g., feature cards to `180px` rather than `120px`) to prevent them from looking "lost" or too small in the empty space.
8. **Social Icons**: Always use the official pixel-art PNG assets (e.g., `icon twitter.png`, `icon discord.png`) for social buttons instead of inline SVGs or generic CSS background colors.
