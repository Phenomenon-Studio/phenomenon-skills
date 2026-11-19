# Review templates

Templates for [`triage-audit`](SKILL.md). Keep each point terse: an engineer reads one in under two minutes. Mark any slot you inferred rather than read as _(inferred)_.

## Valid

```md
### P07 — <title> · valid · <blocker | major | minor | cosmetic>

**Finding:** <the audit's claim, one or two sentences> (source: <section / quote ref>)
**Reason:** <mechanism, why the code does this> (`file:line`)
**Impact:** <who is affected, on which surfaces, how badly; consumers of the owning layer that inherit it>
**User flow:** 1. … 2. … 3. → <observed>; expected <expected> _(from audit | inferred)_
**Evidence:** `file:line`, `<command>` → <output>, `<commit>`

**Fix — patch** _(≤ 3 files, no open decision)_

- `path/to/file.tsx` — <change, with the key changed lines>
- `path/to/file.test.tsx` — <test that goes red before, green after>

**Fix — planner brief** _(larger, or an open decision)_

> **Goal:** <outcome in user terms>
> **Context:** <owning layer, mechanism, `file:line` anchors, related ADRs and specs>
> **Constraints:** <what must keep working; consumers in blast radius>
> **Open decisions:** <each choice the planner must settle, with the options seen>
> **Done when:** <observable acceptance check>
```

Keep exactly one of the two fix blocks.

## Invalid

```md
### P12 — <title> · invalid (<already fixed | by design | not reproducible | misread | duplicate of P03>)

**Finding:** <the audit's claim> (source: <ref>)
**Conclusion:** <one sentence: what is actually true>
**Evidence:**

- `file:line` — <what it shows>
- `<command>` → <output> | `<commit>` — <what it changed>
```

## Needs approval

```md
### P15 — <title> · needs approval

**Finding:** <the audit's claim> (source: <ref>)
**Current behaviour:** <what the code does, and why it plausibly does it> (`file:line`)
**Decision needed:**

- <question for the client> — options: <A> → <consequence> | <B> → <consequence>
```

## Needs data

```md
### P19 — <title> · needs data

**Finding:** <the audit's claim> (source: <ref>)
**What the code shows:** <the part we could verify> (`file:line`)
**Data needed:**

- <exact datum> — from <backend team | client | Figma | prod logs | device> — if <answer A> → <verdict>, if <answer B> → <verdict>
```

## Summary (`README.md`)

```md
# Review — <audit title>

Source: <relative link to audit> · Reviewed: <yyyy-mm-dd> on `<branch>@<short sha>` · Points: <N>

| Verdict        | Count |
| -------------- | ----- |
| valid          | n     |
| needs approval | n     |
| needs data     | n     |
| invalid        | n     |

## Ledger

| ID  | Title | Group | Verdict | Impact | Fix                  |
| --- | ----- | ----- | ------- | ------ | -------------------- |
| P01 | …     | …     | valid   | major  | [patch](points.md#…) |

## Themes

- <pattern recurring across groups, with point IDs and the shared root cause>

## Fix order

1. <point IDs> — <why first: widest scope, blocker, unblocks others>

## Open questions

**For the client**

- <question> — unblocks P15, P16

**Data requests**

- <datum> — from <source> — unblocks P19
```
