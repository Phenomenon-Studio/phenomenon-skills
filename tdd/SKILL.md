---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants unit tests for utilities or hooks, or asks for test-first development.
---

# Test-Driven Development

## Philosophy

**Core principle**: Tests verify behavior through a unit's public interface, not its implementation details. A utility's exported function signature is its public interface. A hook's return value and observable side effects are its public interface. Tests should survive refactors that preserve behavior.

**Unit-first**: The default test granularity is the smallest meaningful unit — a utility function or a hook. Integration tests exist but are not the focus of this skill.

**Good tests** assert on observable outcomes: return values, hook state exposed through `result.current`, side effects at module boundaries. They describe WHAT the unit does.

**Bad tests** assert on internal mechanics: which collaborators were called, how many renders happened, which React primitives ran. They describe HOW the unit does it.

See [tests.md](tests.md) for examples, [mocking.md](mocking.md) for when and where to mock, and [refactoring.md](refactoring.md) for post-green cleanup.

## What to test

### Utilities — anything in `utils/`, `lib/`

- **Target: 100% branch coverage.** This is a target, not a build gate. If a branch cannot be exercised without contorting the code, report it to the user with a one-line justification ("catch block guards against a platform error that can't be simulated in node"). The user decides whether to accept the gap or demand a refactor.
- **TDD as you go** for utilities with non-trivial logic (parsers, formatters, domain calculations). Write the test, make it pass, move on.
- **Backfill trivial utilities** (one-line wrappers, re-exports, classname joiners) after the feature is green. TDD ceremony for `cn(...args)` is noise.

### Hooks — case-by-case

Test a hook if ANY of these are true:

1. **Complexity** — conditional logic, state transitions, or effects with real dependency arrays.
2. **Responsibility** — owns domain logic (auth state, pricing, validation, data shaping).
3. **Side effects** — fetches, writes to storage, subscribes to events, manages a state machine.

Skip a hook if it is purely a thin wrapper (e.g., `useTheme = () => useContext(ThemeContext)`, a `useQuery` wrapper that only forwards config).

**Always report your classifications back to the user at the end of the task**, e.g.:

```
Hook test coverage:
  Tested: useAuth (owns auth state transitions), useCart (conditional logic + side effects)
  Skipped: useTheme (thin context wrapper), useIsMobile (proxy to useMediaQuery)
```

The user can overrule any classification.

## Conventions

- **File naming** — utility and hook files use camelCase matching the primary exported symbol. `formatUSD.ts` exports `formatUSD`; `useCounter.ts` exports `useCounter`. Not `format-usd.ts`, not `formatUsd.ts`, not `FormatUSD.ts`. One primary export per file. Test files mirror the source name: `formatUSD.test.ts`, `useCounter.test.ts`.
- **Test descriptions** — every `it(...)` / `test(...)` description starts with **should** or **should not**, followed by the behavior. Good: `it("should format integers with two decimals by default", ...)`. Bad: `it("formats integers", ...)`, `it("works", ...)`. The rule forces the description to state an expected behavior, not a vague summary.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" — treating RED as "write all tests" and GREEN as "write all code."

This produces crap tests:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than meaningful behavior
- Tests become insensitive to real changes — they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

Before writing any code:

- [ ] Confirm with the user what the unit's public interface should look like (function signature / hook return shape)
- [ ] List the behaviors to test (not implementation steps)
- [ ] For hooks, apply the decision rule above and flag your classification
- [ ] Design the interface for testability — prefer small surfaces, dependency injection over hidden collaborators
- [ ] Get user approval on the plan

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the unit:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet — proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior (return value, state changes, boundary side effects)

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- Extract duplication
- Deepen modules (move complexity behind simple interfaces)
- Apply SOLID principles where natural
- Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Checklist Per Cycle

```
[ ] Test description starts with "should" or "should not"
[ ] Test describes behavior, not implementation
[ ] Test asserts on return value / observable outcome / boundary side effect
[ ] File name matches the primary exported symbol, in camelCase
[ ] Test would survive an internal refactor
[ ] Mocks (if any) live at module boundaries, not on internal helpers
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Reporting at task end

When the task completes, report two things to the user:

1. **Utility coverage** — any utility file below 100%, with a one-line justification for each uncovered branch.
2. **Hook classifications** — which hooks you tested vs. skipped, with a one-line reason for each.

The user reviews and can demand more tests or refactors before approval.
