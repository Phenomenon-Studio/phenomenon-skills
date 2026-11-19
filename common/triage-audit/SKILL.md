---
name: triage-audit
description: Triage an audit — a document listing many feedback points from a client, QA, or an auditor agent — into a summary report plus per-point verdicts checked against the codebase. Use when the user points at an audit, review, or QA report with multiple items. For one point, use triage-feedback.
---

# Triage Audit

Turn an **audit** (any document holding many feedback points) into a **review**: one summary report and point reports, every point given a **verdict** backed by evidence from the codebase. This skill reads and reports; it changes no source code.

Work through the steps in order. Each ends on a completion criterion; start the next step only once it is met.

## Verdicts

Every point gets exactly one:

- **valid** — the code produces the reported problem, or lacks the reported behaviour, and the fix is ours to make.
- **invalid** — the code contradicts the claim: already fixed, by design (cite the spec, ADR, or commit), not reproducible on any path the code allows, a misread of the UI, or a duplicate of another point.
- **needs approval** — the code matches the claim, but whether it is wrong is a product decision the client owns: design intent, scope, copy, a trade-off between two reasonable behaviours.
- **needs data** — the verdict hangs on a source of truth this repo cannot reach: backend behaviour or contract, production data, a Figma frame or spec we lack, a device, a third-party service, analytics.

Evidence is something a reader can re-check: `file:line`, a command with its output, a commit hash, a test name. "Looks fine" is no evidence.

## 1. Ledger

Read the whole audit, including attachments and screenshots. Extract every point into a **ledger**: a stable ID (`P01`, `P02`, … or the audit's own IDs when it has them), a one-line title, the source quote or section reference, the reporter type (client / QA / agent), and the user flow if the audit gives one.

A point is one claim. Split an item that bundles several claims (`P07a`, `P07b`); merge items that restate the same claim, keeping both source references.

**Done when** every item in the audit maps to a ledger row, and the count of source items, splits, and merges reconciles.

## 2. Groups

Find each point's **owning layer**: the module where the behaviour originates, not where it surfaces. Read `CONTEXT-MAP.md` and the relevant `packages/<pkg>/CONTEXT.md` to name it in domain vocabulary. Group points by **scope of influence**:

- one group per owning feature or module (a route, a domain section, one UI-kit primitive family);
- one **cross-cutting** group for points whose owning layer reaches many surfaces (tokens, shell, shared components in `packages/core`, i18n, auth).

Order groups by scope, widest first: a fix there reaches the most surfaces.

Choose the layout: 10 points or fewer → one `points.md`; more → one `points-<group-slug>.md` per group.

**Done when** every ledger row has an owning layer and a group, and the layout is chosen.

## 3. Evaluate

Test each point against the code. Trace the responsible path from the surface to the data. Use the cheapest evidence that settles it: reading the path, `git log -S` / `git blame`, an existing or throwaway test, running the app (`/run`). For a point whose mechanism stays unclear after reading, run the `/diagnosing-bugs` loop. Check that the point is still live on the current branch: audits go stale.

With more than three groups, dispatch one subagent per group. Give each: the group's ledger rows with source quotes, the audit's path, the verdict definitions above, [`TEMPLATES.md`](TEMPLATES.md), and the output file to write. Each returns its summary rows (ID, title, verdict, impact, fix size). Read a sample of each group file it wrote and re-check one evidence citation per verdict type before trusting the batch.

**Done when** every ledger row has a verdict with evidence, and each **valid** point names its mechanism at `file:line`.

## 4. Point reports

Write each point with the template for its verdict from [`TEMPLATES.md`](TEMPLATES.md). Inside each point file, order sections by verdict: valid, needs approval, needs data, invalid.

For a **valid** point, size the fix:

- **patch** — the fix touches three files or fewer, needs no design decision, and adds no public API. Write the diff sketch.
- **planner brief** — anything larger, or any fix with an open decision. Write a brief self-contained enough to paste into a fresh `/grilling` session with no other context.

**Done when** every ledger row has a section in a point file, and every template slot is filled or marked _n/a_ with a reason.

## 5. Summary

Write `README.md` with the summary template from [`TEMPLATES.md`](TEMPLATES.md): counts per verdict, the full ledger table linking each point to its section, themes that recur across groups, the fix order, and one consolidated list of questions for the client and data requests, each tagged with the point IDs it unblocks.

Write the review beside the audit: `<audit-dir>/<audit-stem>-review/`. For an audit pasted in chat or living outside the repo, use `docs/audit-reviews/<yyyy-mm-dd>-<slug>/`. Link files relatively.

**Done when** every ledger ID appears in the summary table with a working link, the verdict counts sum to the ledger count, and every open question names who answers it.
