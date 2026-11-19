---
name: decision-request
description: Turn open points that need a product/client decision into closed questions — each researched in the codebase, with options, consequences, effort and a default — tracked in a decision log until answered. Use when findings, tickets or a plan contain "needs discussion" / "ask the client" items, or when the client's answers arrive and must be recorded and turned into follow-up work.
---

# decision-request

A **decision** is a choice that belongs to the client: product behaviour, scope, priority, wording, or a dependency on their backend/team. Every question leaves as a **closed question** (pick an option) with a **default** we act on if no answer comes.

Two branches: **ask** (steps 1–4) and **record** (step 5, when answers arrive).

## Steps

### 1. Collect candidates

Gather open points from what the user names (findings, specs, tickets, threads). Split each into:

- **decision**: the client must choose → continues.
- **engineering call**: we can decide from code and conventions → decide it, list it as info ("we'll do X").

One decision per question: a point holding two choices becomes two decisions.

**Done when** every open point is tagged decision or engineering call, and each decision has an ID (reuse the source's IDs).

### 2. Research each decision in the codebase

Per decision, establish from code, not from the source's prose:

- **Current behaviour**: what the user sees now on each relevant branch/environment (e.g. production vs the new branch), named by on-screen text and route.
- **Blocker**: what prevents the obvious fix (missing backend mutation/endpoint, feature flag, data not exposed, design missing). Name the API/schema element checked.
- **Options**: at least two, including "leave as is / hide it" when that is real. Per option: what the user experiences, effort (S/M/L), files/areas touched, risk, and who must act (us / client backend / design).
- **Default**: the option we take if no answer arrives, usually the safest reversible one.

**Done when** every decision has current behaviour checked at a named commit, a named blocker or "none", ≥2 options each with consequence + effort + owner, and a default.

### 3. Write the questions

Per decision, in the client's language:

```
**<ID> — <short title>.** <Current behaviour in one or two sentences.> <Why it can't just be fixed, if a blocker exists.>
- A) <option> — <what users get>, <effort / who acts>
- B) <option> — …
Default: <A/B> — what we do meanwhile: <interim state>. Answer by <date>, then the default applies.
```

Name UI by on-screen text; keep file paths and hashes in the log only. Order by impact on users, then by how long the default can safely stand.

**Done when** each question can be answered with a letter.

### 4. Open the decision log

Append each decision to the project's decision log (create `DECISIONS.md` beside the source if none exists, or use the project's issue tracker if it has one):

`ID · question · options · default · status: open · asked <date> · answer by <date> · research refs (file:line, commit) · answer · follow-up`

Hand the rendered questions to the user, or to the `client-brief` skill when they ship inside a larger message.

**Done when** every question sent has an `open` log entry.

### 5. Record answers

When answers arrive: set `status: answered`, store the answer verbatim with date and who answered, then create the follow-up the answer implies (ticket/spec in the project's tracker, ADR when it fixes a lasting rule, or "no change"). Answers that pick no option or raise a new choice become a new decision via step 2.

**Done when** every answered entry links to its follow-up or says "no change", and unanswered entries past their deadline are listed for the user with the default about to apply.
