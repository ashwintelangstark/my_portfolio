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

- Keep portfolio content in `src/lib/portfolio-data.ts` and render its showcase through `src/components/portfolio.tsx` so the home preview and projects page remain consistent.
- Keep About, Projects, and Contact as separate TanStack routes while the home page previews those sections, so each page has a shareable URL.
- Use one subject-specific image per portfolio project and keep imagery and descriptions in the shared project data, so home and Projects remain visually and factually aligned.
