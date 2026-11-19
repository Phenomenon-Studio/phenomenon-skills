---
name: client-brief
description: Turn engineering verdicts (audit validation, triage report, review findings, fix plan) into client-facing messages — email, Slack, ticket comments — each point re-checked in the codebase and told in product terms. Use when the user wants findings sent, explained, or summarised for a client, PM, or other non-engineering reader, or one report rendered into several channels.
---

# client-brief

One **source** in, several **renders** out. The source is the verdict list; every render tells the same points with the same verdicts. Readers are outside the code: they know screens, roles and workflows, not files.

## Steps

### 1. Build the point list

Read the source document(s) the user names. Extract one row per point:

`id · claim (what was reported) · verdict (valid / invalid / partial / needs decision / priority change) · evidence · action`

Keep the source's IDs so the client can cross-reference.

**Done when** every point in the source is a row, and the row count matches the source's own totals (or the mismatch is listed).

### 2. Research each point in the codebase

Re-check every row at the current HEAD of the relevant branch(es) before a word goes to the client; verdicts go stale.

- Re-run the evidence: open the cited file/line, re-run the cited command (lint, test, `git grep` on the release branch), confirm the cited commit is in the branch.
- Find the **product face** of the point: the route, the screen, the on-screen label/button text (read the actual string from the component or i18n file), the user role who sees it, and what the user observes before and after.
- Note what the client can verify themselves: a screen to open, a click path.

Record per row: `checked at <sha>` + product face + still-true / changed.

**Done when** every row has a product face drawn from real code strings and a `checked at <sha>` mark; rows whose verdict changed are flagged to the user before step 3.

### 3. Sort for the reader

Group: **invalid** (what we won't do and why) → **priority changes** → **decisions needed** → **valid, scheduled** (summary count, details only when asked). Points needing a client decision go through the `decision-request` skill; the brief carries its questions verbatim.

**Done when** each row sits in exactly one group.

### 4. Render each channel

Write every render the user asked for, following [CHANNELS.md](CHANNELS.md). Default: one message file (markdown). Per point use **Claim → Finding → Evidence → Conclusion → Question (optional)**, in plain language:

- Name things by on-screen text and route, e.g. "the **Start Test** button on the device support page".
- Evidence in a form the reader trusts: "verified in the app", "nothing on the release version displays it", "covered by an automated test". Commit hashes and file paths only for a technical reader.
- State the consequence of a rejected fix ("the suggested change would break saving a phone number on mobile").
- Fair tone: credit valid points; describe the reporter's claim neutrally.

Save renders next to the source unless the user names a location.

### 5. Cross-check renders

**Done when** every render covers the same point set with the same verdict per ID, counts in intros match the groups, and no render contains a file path, hash, or internal jargon its audience can't read.
