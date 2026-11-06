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
