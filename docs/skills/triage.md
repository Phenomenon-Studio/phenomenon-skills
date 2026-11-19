---
title: Triage
description: Turn client feedback, QA tickets and audits into engineer-ready verdicts and fix plans.
sidebar:
  order: 7
---

Entry point for incoming feedback. Each point gets checked against the codebase and a verdict (valid, invalid, needs approval, needs data) with root cause and fix plan.

- One point (a client comment, a QA ticket, another agent's review finding) → `triage-feedback`.
- A document with many points (audit, QA report) → `triage-audit`.

Valid points feed straight into the [workflow](../workflow.md): `/to-tickets`, then continue from **Implement**.

<!-- skills:start -->
Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill triage-audit triage-feedback
```

### `triage-audit`

Triage an audit — a document listing many feedback points from a client, QA, or an auditor agent — into a summary report plus per-point verdicts checked against the codebase. Use when the user points at an audit, review, or QA report with multiple items. For one point, use triage-feedback.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill triage-audit
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/triage/triage-audit)

### `triage-feedback`

Triage a short piece of feedback into an engineer-ready report — claim, verdict, root cause, fix options, plan, guardrail. Use when the user pastes or points at client feedback, a QA ticket, or another agent's review finding.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill triage-feedback
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/triage/triage-feedback)
<!-- skills:end -->
