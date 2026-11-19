---
title: swagger-to-md
description: "Fetch a remote Swagger/OpenAPI (v2 or v3) spec from a URL and emit a directory of Markdown files (one per tag) documenting all endpoints, parameters, request payloads, and responses. Refs are inlined; request bodies are rendered as example JSON payloads. Use when user wants to convert a Swagger/OpenAPI URL to Markdown, document a remote API, snapshot endpoints from a backend, or asks \"swagger to md\" / \"openapi to markdown\"."
---

<!-- skills:start -->
Fetch a remote Swagger/OpenAPI (v2 or v3) spec from a URL and emit a directory of Markdown files (one per tag) documenting all endpoints, parameters, request payloads, and responses. Refs are inlined; request bodies are rendered as example JSON payloads. Use when user wants to convert a Swagger/OpenAPI URL to Markdown, document a remote API, snapshot endpoints from a backend, or asks "swagger to md" / "openapi to markdown".

**User-invoked** — type `/swagger-to-md`, or the agent loads it when the task matches the description.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill swagger-to-md
```

Part of [API docs](./index.md) · [Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/api-docs/swagger-to-md)
<!-- skills:end -->
