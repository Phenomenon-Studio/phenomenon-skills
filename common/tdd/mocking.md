# Mocking Guidance

Unit-first testing needs mocks. This file defines where to put them and what not to mock.

## The boundary rule

**Mock at module boundaries, not at internal calls.**

A module boundary is where code you own stops and code you do not own (or cannot easily control) starts:

- **Network** — `fetch`, HTTP clients, GraphQL clients. Mock with MSW or a stub client.
- **Storage** — `localStorage`, `sessionStorage`, IndexedDB, cookies. Use an in-memory adapter.
- **Time** — `Date.now`, `setTimeout`, `setInterval`. Use Vitest fake timers.
- **Randomness** — `Math.random`, `crypto.randomUUID`. Inject or stub.
- **Platform APIs you do not control** — `navigator.*`, `window.matchMedia`, file system, child processes.

Everything inside your own code — other utilities, other hooks, other services — is **not** a boundary. It is an internal collaborator, and mocking it makes your tests lie about the system's real behavior.

## When to mock an internal collaborator

Almost never. The legitimate exceptions:

1. **Destructive or irreversible effects** that would escape the test process (e.g., a helper that sends real Slack messages, even though the helper itself is in-repo). Mock the helper.
2. **Expensive setup** that bloats every test (e.g., a hook that requires a full auth context). Prefer a test-only provider that supplies a real auth state. Only fall back to mocking if the provider approach is prohibitive.

If you find yourself mocking an internal collaborator for any other reason, that is a signal to either:

- **(a)** refactor the unit under test to accept the collaborator as a parameter (dependency injection), or
- **(b)** test through a higher-level unit that does not require isolating the inner piece.

## Spying

Spies (`vi.fn`, `vi.spyOn`) are legitimate when **the call IS the behavior**:

```typescript
// GOOD — the behavior of useFormSubmit is "call onSubmit with the form values"
it("should call onSubmit with the submitted values", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => {
        return useFormSubmit({ onSubmit });
    });
    await act(() => {
        result.current.submit({ name: 'Alice' })
    });
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Alice' });
});
```

Here `onSubmit` is the unit's contract with the caller — invoking it is the entire point of the hook. The spy asserts on the contract, not on internal mechanics.

Spies are **not** legitimate when the call is incidental — a means to some observable end. If a hook both calls `cartApi.addItem` and updates a returned `items` array, assert on the `items` array, not on the mock.

## Red flags

Stop and reconsider if you find yourself:

- **Mocking React itself** (`vi.mock('react', ...)`) — you are fighting the framework. The unit under test is probably testing implementation, not behavior.
- **Mocking more than one internal module per test** — the unit under test is too coupled; refactor before continuing.
- **Writing `expect(mock).toHaveBeenCalledTimes(N)` where N > 1** — you are testing the implementation's control flow, not its behavior.
- **Asserting on the order of calls across two mocks** — again, control flow, not behavior.
- **Mocking a function so the test passes, with no test anywhere exercising the real function** — you have built a test that proves nothing.

## The two-question sanity check

Before adding any mock, ask:

1. **Does this mock replace a module boundary?** If yes, proceed. If no, go to question 2.
2. **Would removing this mock require re-architecting the test?** If yes, the unit under test probably needs DI or decomposition — fix the code, not the test. If no, delete the mock and use the real collaborator.