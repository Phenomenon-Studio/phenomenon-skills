---
name: triage-feedback
description: Triage a short piece of feedback into an engineer-ready report — claim, verdict, root cause, fix options, plan, guardrail. Use when the user pastes or points at client feedback, a QA ticket, or another agent's review finding.
---

# Triage Feedback

Turn terse feedback into a **triage report** an engineer can act on without re-reading the source. This skill reads and reports; it changes no source code. The fix is a separate step the engineer starts.

Work through the steps in order. Each ends on a completion criterion; do not start the next step until the current one is met.

## 1. Claim

Gather the feedback: the pasted text, or the file at the path the user gives (tickets live under `docs/ui-redesign/phases/`, see `docs/agents/issue-tracker.md`). Read attached screenshots.

Rewrite it as one **claim**:

> On `<surface: route / component / package>`, when `<action or state>`, `<observed>`; expected `<expected>`.

Feedback from a client names the symptom in user words; map those words to the domain vocabulary in the relevant `packages/<pkg>/CONTEXT.md`. Feedback from an agent or QA often names a cause instead of a symptom; recover the symptom it implies, and treat the named cause as a hypothesis for step 2.

**Done when** the claim has every slot filled, and each slot you inferred rather than read is marked _(inferred)_. If the `expected` slot cannot be inferred from the feedback, the spec, Figma, or existing behaviour elsewhere in the app, ask the user that one question and stop.

## 2. Verdict

Test the claim against the code. Find the responsible code path and trace it from the surface to the data. Use the cheapest evidence that settles it: reading the path, an existing or throwaway test, running the app (`/run`), `git log -S` / `git blame` on the suspect lines. If the mechanism stays unclear after reading, run the `/diagnosing-bugs` feedback loop.

Pick one **verdict**:

- **confirmed** — the code produces the observed behaviour.
- **by design** — the behaviour is intended; cite the spec, ADR, or commit that intends it.
- **not reproducible** — the path cannot produce the observed behaviour as described; say what was tried.
- **duplicate** — already tracked or already fixed; cite the ticket or commit.
- **unclear** — evidence conflicts; name exactly what is missing.

**Done when** the verdict cites evidence a reader can re-check: `file:line`, a command with its output, or a commit hash. Any verdict other than **confirmed** skips to step 6 and reports only claim, verdict, and evidence.

## 3. Blast radius

Map everything the fix could touch. Read `CONTEXT-MAP.md`, the `CONTEXT.md` of each package involved, and ADRs in the area (`docs/adr/`, `packages/<pkg>/docs/adr/`). Then find every consumer of the responsible code: callers, re-exports, stories, tests, GraphQL operations and generated types that depend on it. `packages/core` changes reach both apps; check both.

**Done when** you can name the **owning layer** (the module where the wrong behaviour originates, not where it surfaces) and every consumer of it is listed with its path, marked _affected_ or _unaffected_ with a one-line reason.

## 4. Root cause

State the **root cause** in two parts:

- **Mechanism** — what in the code produces the wrong behaviour, in one or two sentences, anchored to `file:line`.
- **Escape** — why it reached the reporter: no test covered this state, the spec was silent, a refactor changed a contract its consumers relied on, a type allowed the invalid state, a design deviation went unreviewed. Use `git log` on the owning layer to find the introducing commit when it is cheap.

**Done when** the mechanism explains every detail of the claim, and the escape names a specific missing check, not "insufficient testing".

## 5. Options

Propose two or three fixes. Rank candidate fixes by where they land, preferring the earliest that fits without distortion:

1. Existing behaviour or helper already covers it — reuse.
2. The owning layer — fix it there.
3. A platform, library, or installed dependency owns it — use that.
4. A small new piece where the invariant belongs.
5. A refactor, when the structure hides ownership.

A patch at the surface while the owning layer stays wrong is an option only when the owning layer is out of scope; say why. For each option give: what changes, which consumers from step 3 it affects, risk, and rough size (files touched). Recommend one.

**Done when** each option names its files and affected consumers, and one is marked _recommended_ with the reason it beats the others.

## 6. Report

Deliver the triage report. If the feedback came from a ticket file, append it under that file's `## Comments` heading; otherwise reply in chat. Keep it terse: an engineer should read it in under two minutes. Omit sections that do not apply to the verdict.

```md
### Triage — <short title>

**Claim:** On …, when …, …; expected ….
**Verdict:** confirmed | by design | not reproducible | duplicate | unclear — <evidence>

**Root cause**

- Mechanism: … (`file:line`)
- Escape: …

**Blast radius:** owning layer `<path>`; affected: `<path>`, `<path>`; unaffected: …

**Options**

1. _(recommended)_ … — touches …; risk …
2. … — touches …; risk …

**Plan** (recommended option)

1. <change> — `<path>`
2. <test that goes red before the fix, green after> — `<path>`

**Guardrail:** <the check that stops this class of failure recurring>
```

The **guardrail** answers the escape from step 4 with one concrete check, the strongest that fits: a type that makes the invalid state unrepresentable, a lint rule, a regression test at the owning layer, a story or lab-story covering the state, an ADR, or an `AGENTS.md` line. Name where it lives.

**Done when** the report is delivered, every plan step names a path, and the guardrail is a concrete check rather than an intention.
