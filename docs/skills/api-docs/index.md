---
title: API docs
description: Turn a backend's Swagger/OpenAPI spec into agent-readable Markdown.
sidebar:
  order: 6
---

For frontends integrating with a backend. Snapshot the API into Markdown files the agent can read instead of guessing endpoints.

**Role in the lifecycle:** before **Plan**. Run `/swagger-to-md` when a backend contract appears or changes, so grilling, specs and tickets reference real endpoints and payloads.

<!-- skills:start -->
## Skills

- [`swagger-to-md`](./swagger-to-md.md) — Fetch a remote Swagger/OpenAPI (v2 or v3) spec from a URL and emit a directory of Markdown files (one per tag) documenting all endpoints, parameters, request payloads, and responses. Refs are inlined; request bodies are rendered as example JSON payloads. Use when user wants to convert a Swagger/OpenAPI URL to Markdown, document a remote API, snapshot endpoints from a backend, or asks "swagger to md" / "openapi to markdown".

Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill swagger-to-md
```
<!-- skills:end -->
