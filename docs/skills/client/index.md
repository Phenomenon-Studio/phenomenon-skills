---
title: Client communication
description: Turn open questions and engineering verdicts into decisions and messages a client can act on.
sidebar:
  order: 9
---

The outward half of [Triage](../triage/index.md): triage decides what is true in the code, these skills tell the client in product terms and get their decisions back. The full flow, and why it matters, is in [Working with clients](../../clients.md).

- Points only the client can decide (behaviour, scope, priority, wording) → `decision-request`: closed questions with options, effort and a default, tracked in a decision log.
- A report, verdict list or fix plan to send → `client-brief`: one message per channel (email, Slack, ticket), every point re-checked at the current commit.

**Role in the lifecycle:** after **Triage** and before **Build** — and again when answers arrive, to turn them into tickets.

<!-- skills:start -->
## Skills

- [`client-brief`](./client-brief.md) — Turn engineering verdicts (audit validation, triage report, review findings, fix plan) into client-facing messages — email, Slack, ticket comments — each point re-checked in the codebase and told in product terms. Use when the user wants findings sent, explained, or summarised for a client, PM, or other non-engineering reader, or one report rendered into several channels.
- [`decision-request`](./decision-request.md) — Turn open points that need a product/client decision into closed questions — each researched in the codebase, with options, consequences, effort and a default — tracked in a decision log until answered. Use when findings, tickets or a plan contain "needs discussion" / "ask the client" items, or when the client's answers arrive and must be recorded and turned into follow-up work.

Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill client-brief decision-request
```
<!-- skills:end -->
