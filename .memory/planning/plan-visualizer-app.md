# Plan Visualizer Dashboard (.plans/)

**Status**: ✅ Complete
**Last Updated**: 2026-03-08 00:00
**Related**: `setup/skills.md`

## Summary
Vite + React 19 + TypeScript dashboard at `localhost:1998`. AI writes to `plan.json`, Vite HMR auto-reloads. 8 sections with dark theme + violet accent.

## Changes Made
- Dir: `.plans/` — full Vite project (tracked in git, `node_modules/` excluded)
- File: `.plans/src/data/plan.json` — single source of truth, AI writes here
- File: `.plans/src/types/plan.ts` — full TypeScript types for all plan sections
- File: `.plans/src/hooks/usePlan.ts` — static import of plan.json
- File: `.plans/src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- File: `.plans/src/App.tsx` — sidebar nav + section routing
- File: `.plans/src/components/Overview.tsx` — project card, stats, phase progress
- File: `.plans/src/components/Roadmap.tsx` — timeline with milestone checklist
- File: `.plans/src/components/Kanban.tsx` — 4-column board with task cards
- File: `.plans/src/components/ERD.tsx` — reactflow entity diagram
- File: `.plans/src/components/Features.tsx` — filterable feature grid
- File: `.plans/src/components/Suggestions.tsx` — impact/effort matrix + cards
- File: `.plans/src/components/Architecture.tsx` — ADR cards + patterns list
- File: `.plans/src/components/SessionLog.tsx` — timeline feed with agent badges

## Key Decisions
- **Static JSON import**: Vite HMR handles reload when file changes — no polling needed
- **reactflow for ERD**: Pannable/zoomable entity diagram, custom node component
- **CSS variables for theme**: `--bg`, `--surface`, `--accent` etc. — no Tailwind config needed
- **Port 1998**: Fixed via `vite.config.ts` `server.strictPort: true`

## Dependencies
- `@phosphor-icons/react`, `reactflow`, `@radix-ui/react-*`, `tailwindcss@v4`
- `class-variance-authority`, `clsx`, `tailwind-merge`, `date-fns`

## Dev Server
```bash
cd .plans && npm run dev   # http://localhost:1998
```

## Next Steps
- [ ] Update `plan.json` as project progresses (kanban moves, phase completions)
