---
title: Security
description: Web security rules the agent applies while writing code.
sidebar:
  order: 2
---

Background rules (model-invoked) that keep the agent away from common web vulnerabilities. Recommended for **every** web project.

**Role in the lifecycle:** **Build** and **Review**, model-invoked: the rules apply while code is written and again when `code-review` reads the diff.

<!-- skills:start -->
## Skills

- [`web-security`](./web-security.md) — Enforce web security and avoid security vulnerabilities. Use when handling user input, rendering untrusted content, or adding dependencies.

Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill web-security
```
<!-- skills:end -->
