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
- Game workspace uses validated URL tabs and passes submitted text into Canvas; browser-only Phaser is dynamically imported after mounting, and demo playtests never imply AI generation or persistent project storage.
- Subscription dialogs keep reference pricing in a browser-safe shared module and session-only selections; payment and entitlement actions must not imply a completed purchase without a separately connected payment service.
- Theme state is shared by a browser-safe root provider and persisted as a local device preference; semantic CSS tokens switch the whole workspace without changing layouts.
- Build-page minigames make a fresh browser-side random selection on each mount without score-driven transitions; Phaser games dynamically import Arcade after mounting to keep SSR safe and collisions library-driven.
- Workspace search uses the shared browser-safe demo project catalogue and works catalogue; canvas matches open project pages with a validated URL filter so direct links and refresh retain the selected search.
- The sidebar asset entry reuses the project page with validated URL asset mode; its project selector preserves that mode and search across project changes and refreshes.
- Keep the create-page media composer separate from the homepage/game composer; reuse create-page Skill data and keep media modes, settings, canvas toggle and reference rates session-only until generation and billing services are connected.
