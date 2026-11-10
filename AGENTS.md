<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the homepage creation composer in a browser-safe component with session-only UI state; service connections and generation require a separately implemented Cloud integration.
- Creation workspace uses a validated URL mode to select entry-specific examples and composer defaults while reusing the sidebar and layout; this keeps refresh and direct links consistent.
- Featured-work detail content is browser-safe demo data in src/lib/works.ts; the detail route resolves it by id and 404s unknown ids instead of rendering an empty panel.

- Subscription dialogs keep reference pricing in a browser-safe shared module and session-only selections; payment and entitlement actions must not imply a completed purchase without a separately connected payment service.
- Theme state is shared by a browser-safe root provider and persisted as a local device preference; semantic CSS tokens switch the whole workspace without changing layouts.
- Build-page minigames make a fresh browser-side random selection on each mount without score-driven transitions; Phaser games dynamically import Arcade after mounting to keep SSR safe and collisions library-driven.
- Workspace search uses the shared browser-safe demo project catalogue and works catalogue; canvas matches open project pages with a validated URL filter so direct links and refresh retain the selected search.
- The sidebar asset entry reuses the project page with validated URL asset mode; its project selector preserves that mode and search across project changes and refreshes.
- Keep the create-page media composer separate from the homepage/game composer; reuse create-page Skill data and keep media modes, settings, canvas toggle and reference rates session-only until generation and billing services are connected.
- Keep homepage image-template catalogue browser-safe and separate from featured-work data; category filters and preview dialogs are session-only, while creation links reuse /create without implying generation.

- Build reuses the shared composer in game-only mode while story and homepage keep their own choices; this prevents non-game requests entering the game workspace.
- Game workspace (/game?id=) is AI-generated and persisted in Cloud: browser drives design → assets → code steps via server functions in src/lib/games.functions.ts; generated HTML runs only in a sandboxed iframe. Why: each step stays short, resumable after refresh, and isolated from the app.
- Sidebar tasks and the game library share the persisted game-list query; invalidate it after creation and generation changes. Why: new games and updated titles must remain consistent across navigation and refresh.

- Homepage and game Chat reuse the browser-safe creation model picker and ordered catalogue; specialized game APIs are separated from language models, hide unsupported thinking-depth controls, and remain session-only without changing generation calls until connected. Why: consistent selection without implying an unconnected provider is live.
- Provider configuration uses a separate browser-safe dialog; keep non-secret drafts session-only and discard credential inputs on close or save until a secure service integration exists. Why: reference UI must not persist secrets or claim a live connection.
- Canvas and Assets use React Flow for draggable nodes and pan/fit, with per-game documents, generated images and positions stored in device IndexedDB; image generation streams through a same-origin validated server route while image-editing tools remain display-only. Why: real creation and movement do not mutate the saved game's assets or generation pipeline.
- From Library reads public game assets through the RLS browser client and current-device canvas images, then inserts independent local canvas nodes without changing original assets. Why: search and multi-selection reuse real imagery while retaining the existing local persistence boundary.
- Persist canvas deletion tombstones alongside local nodes, migrating legacy node arrays on read; Delete/Backspace remove selected visible nodes only outside editors. Why: refresh must not restore removed game assets or delete elements while typing.
