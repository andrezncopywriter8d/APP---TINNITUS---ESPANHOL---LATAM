# Project Agent Instructions

Before editing UI, layout, components, CSS, copy, navigation, or visual design, read and apply:

- `.skills/frontend-skill.md`

Stitch skills are installed locally in this project under:

- `.skills/stitch-skills/skills/`

When a task involves Stitch, design generation, prompt enhancement, React component generation, shadcn/ui, Remotion, or iterative design workflows, read and apply the relevant local `SKILL.md` from `.skills/stitch-skills/skills/<skill-name>/SKILL.md` before making changes. Prefer these project-local Stitch skills over ad hoc instructions for those workflows.

The Composio Awesome Codex Skills pack is installed locally under:

- `.skills/awesome-codex-skills/`

When a task matches one of the installed Composio skills or agents, inspect the relevant `.skills/awesome-codex-skills/<skill-name>/SKILL.md` before acting and apply it when useful. Prefer the most specific matching skill for GitHub/CI, deployment, webapp testing, brand guidelines, design, content research, planning, MCP, support triage, Sentry/Datadog/Linear/Notion, document/media workflows, and other workflows covered by that pack.

This project is a premium tinnitus support product called **Onda Tesla**, not a generic meditation or wellness app.

## Required UI Process

1. Inspect the existing files.
2. Identify the app structure.
3. Create a short implementation plan.
4. Make scoped changes.
5. Run `npm run build`.
6. Validate the rendered mobile layout around 390px width.
7. Fix visual or functional issues before final response.

## Product Navigation

The target navigation is:

1. Hoje
2. Player
3. Emergencia
4. Progresso
5. Guia

## Copy Rules

Avoid generic wellness terms. Prefer tinnitus/protocol language:

- AudioWave -> Onda Tesla
- Mindful Reset -> Sessao Gamma
- Meditation Session -> Protocolo Auditivo
- Routine -> Rotina Auditiva
- Insights -> Progresso
- Mood -> Clareza / Calma / Zumbido

## Quality Bar

The result should feel like a premium neurotechnology product:

- Mobile-first.
- Large touch targets.
- One dominant action per screen.
- Minimal bottom nav.
- No generic dashboard-card mosaics.
- Persistent user state via localStorage where relevant.
