---
name: pnpm-audit-update
description: Find outdated dependencies, audit each upgrade with npq, and apply approved ones with pnpm. Use when the user wants to update dependencies, check for outdated packages, or upgrade versions safely.
---

# pnpm Audit Update

Security-first bulk updates: every upgrade candidate passes an [npq](https://github.com/lirantal/npq) audit at its **target version** before pnpm writes it to `package.json`. Add `-r` to the `pnpm` commands below in a workspace (monorepo) root.

## Workflow

### 1. Discover

```bash
pnpm outdated --format json || true   # exits non-zero when anything is outdated
pnpm audit --json || true             # current advisories
```

`pnpm outdated` lists both `wanted` (in-range) and `latest` (may be a major). Report each package as current → wanted / latest, grouped by `dependencies` / `devDependencies`, marking majors and any package an update would clear an advisory for.

### 2. Audit each candidate

One package per run, against the exact version it would move to:

```bash
pnpm dlx npq install <pkg>@<target-version> --dry-run --disable-auto-continue
```

Sort into `SAFE` and `BLOCKED` (with the reason). **Hard block**: any Snyk CVE or typosquatting warning. Done when every candidate sits in one list.

### 3. Confirm

Show the `SAFE` / `BLOCKED` split and get the user's explicit approval of the exact set to apply. Call out every major bump (breaking changes expected) and every blocked package (the user may want an alternative).

### 4. Apply

```bash
pnpm update <pkg>...            # in-range (minor/patch)
pnpm update <pkg>... --latest   # majors: rewrites the range in package.json
```

Name packages explicitly so only the approved set moves. pnpm regenerates `pnpm-lock.yaml`.

### 5. Verify

Run in order, stopping at the first failure:

1. `pnpm audit`: no new advisories.
2. The project's typecheck, lint, test, and build scripts from `package.json`.

Done when all pass. On failure, offer to revert with `git checkout -- package.json pnpm-lock.yaml && pnpm install`, then retry with a narrower set.

## Rules

- Commit `dependencies` and `devDependencies` updates separately when practical.
- For adding new packages, use the `pnpm-audit-install` skill.

| Variable | Purpose |
|---|---|
| `SNYK_TOKEN` | Enables the Snyk vulnerability DB (recommended) |
| `GITHUB_TOKEN` | Raises GitHub API rate limits |
