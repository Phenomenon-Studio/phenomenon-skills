# Good and Bad Unit Tests

Examples below use Vitest + `@testing-library/react`. Jest users can map `vi.fn` / `vi.mock` to `jest.fn` / `jest.mock` directly.

All test descriptions start with **should** or **should not**, and all filenames use camelCase matching the exported symbol. See [SKILL.md](SKILL.md#conventions) for the conventions.

## Utilities

### Good — observable behavior

```typescript
// src/utils/formatUSD.ts
export function formatUSD(value: number, options?: { hideDecimals?: boolean }): string {
    const fractionDigits = options?.hideDecimals ? 0 : 2;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

// src/utils/formatUSD.test.ts
describe("formatUSD", () => {
    it("should format integers with two decimals by default", () => {
        expect(formatUSD(0)).toBe('$0.00');
        expect(formatUSD(1000)).toBe('$1,000.00');
    });

    it("should preserve fractional cents and round to two places", () => {
        expect(formatUSD(12.5)).toBe('$12.50');
        expect(formatUSD(12.567)).toBe('$12.57');
    });

    it("should drop decimals when hideDecimals is true", () => {
        expect(formatUSD(0, { hideDecimals: true })).toBe('$0');
        expect(formatUSD(12.5, { hideDecimals: true })).toBe('$13');
    });

    it("should format negative values with a leading minus", () => {
        expect(formatUSD(-1000)).toBe('-$1,000.00');
    });
});
```

Why it is good:

- Asserts on the returned string — the unit's entire public contract.
- Exercises the boundary cases callers actually care about: zero, fractions, negative, options flag on/off.
- Would survive a rewrite that swaps `Intl.NumberFormat` for manual string formatting.
- Each description starts with "should" and names the expected behavior, not the code path.

### Bad #1 — implementation-coupled utility test

```typescript
// BAD
import { formatUSD } from "./formatUSD";

test("should construct an Intl.NumberFormat with USD currency", () => {
    const spy = vi.spyOn(Intl, 'NumberFormat');
    formatUSD(100);
    expect(spy).toHaveBeenCalledWith('en-US', expect.objectContaining({
        style: 'currency',
        currency: 'USD',
    }));
});
```

Why it is bad:

- Asserts on _how_ the utility formats, not _what_ it returns. The "should" naming is followed, but the assertion itself still describes a mechanism instead of an outcome — naming conventions do not rescue an implementation-coupled test.
- Breaks if you swap `Intl.NumberFormat` for a hand-rolled implementation, even though the output is identical.
- Gives a false sense of coverage: the constructor is called, but if `.format(value)` is never invoked the bug still ships.

### Bad #2 — 100% coverage without edge cases

```typescript
// BAD: hits every line, proves nothing
test("should format currency", () => {
    expect(formatUSD(100)).toBe('$100.00');
    expect(formatUSD(100, { hideDecimals: true })).toBe('$100');
});
```

Coverage report: 100%. Real behavior: untested. This passes while `formatUSD(-1)` is broken, `formatUSD(0.001)` rounds wrong, and `formatUSD(1000)` misses the thousands separator. Coverage counts executed branches, not exercised _cases_. Also: "should format currency" is a vague description — conventions catch naming shape, but you still have to name the actual behavior. Prefer `"should format an integer with a thousands separator"` over `"should format currency"`. Always test the edges: `0`, negative, fractional, very large / very small, boundary values of each option flag.

## Hooks

### Good — observable behavior

```typescript
// src/hooks/useCounter.ts
export function useCounter(initial = 0) {
    const [count, setCount] = useState(initial);
    const increment = () => {
        setCount(c => c + 1);
    };
    const reset = () => {
        setCount(initial);
    }
    return { count, increment, reset };
}

// src/hooks/useCounter.test.ts
import { act, renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

describe("useCounter", () => {
    it("should start at the initial value", () => {
        const { result } = renderHook(() => {
            return useCounter(5);
        });
        expect(result.current.count).toBe(5);
    });

    it("should increment by one", () => {
        const { result } = renderHook(() => {
            return useCounter(0);
        });
        act(() => {
            result.current.increment();
        });
        expect(result.current.count).toBe(1);
    });

    it("should reset to the initial value", () => {
        const { result } = renderHook(() => {
            return useCounter(10);
        });
        act(() => {
            result.current.increment();
        });
        act(() => {
            result.current.reset();
        });
        expect(result.current.count).toBe(10);
    });
});
```

Why it is good:

- Asserts on `result.current` — the hook's public return shape.
- Never mentions `useState`, render counts, or effect timing.
- A rewrite to `useReducer` or an external state manager would not touch this test.
- Filename matches the export (`useCounter.ts` exports `useCounter`), test file mirrors it (`useCounter.test.ts`), descriptions are behavioral.

### Bad #3 — over-mocking

Assume a `useCart` hook that reads the current user via `useAuth` and calls `cartApi.addItem` on add.

```typescript
// BAD
vi.mock('./useAuth', () => ({ useAuth: () => ({ userId: 'u1' }) }));
vi.mock('./cartApi', () => ({ cartApi: { addItem: vi.fn().mockResolvedValue(undefined) } }));
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, useState: vi.fn(actual.useState) };
});

test("should call cartApi.addItem with userId", async () => {
    const { result } = renderHook(() => {
        return useCart();
    });
    await act(() => {
        result.current.add({ sku: 'abc' });
    });
    expect(cartApi.addItem).toHaveBeenCalledWith('u1', { sku: 'abc' });
});
```

Why it is bad:

- Mocking `useAuth` is mocking an internal collaborator. If `useAuth`'s contract changes, this test still passes while `useCart` breaks in production.
- Mocking React itself (`useState`) is fighting the framework to make a test pass.
- The assertion is a tautology against the `cartApi.addItem` mock: it proves the hook called the mock, not that the cart actually changed.
- The description says "should call cartApi.addItem" — notice it describes an internal call, not an outcome. A behavioral description would read "should add an item to the cart".

The fix: mock only at the network boundary (MSW or a stub `fetch`), keep the real `useAuth`, and assert on observable cart state:

```typescript
// GOOD
it("should add an item to the cart", async () => {
    const { result } = renderHook(() => {
        return useCart();
    }, { wrapper: TestProviders });
    await act(() => {
        result.current.add({ sku: 'abc' });
    });
    expect(result.current.items).toEqual([{ sku: 'abc' }]);
});
```

See [mocking.md](mocking.md) for where the boundary lives.

### Bad #4 — testing React internals

```typescript
// BAD
test("should re-render when incremented", () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
        renderCount++;
        return useCounter(0);
    });
    act(() => {
        result.current.increment();
    });
    expect(renderCount).toBe(2);
});

// Also BAD
test("should call useState with the initial value", () => {
    const useStateSpy = vi.spyOn(React, 'useState');
    renderHook(() => {
        return useCounter(7);
    });
    expect(useStateSpy).toHaveBeenCalledWith(7);
});
```

Why they are bad:

- Render counts, which hooks ran, and the order of React's internal calls are all implementation. None of them are what the hook _does_ for the caller.
- Both break if React changes its scheduling, or if you swap `useState` for `useReducer` — even though the counter still works.
- The good test above already verifies the increment takes effect. If render efficiency matters, that is a performance concern — measure it, do not unit-test it.
- Again, the `should`-prefixed description is not a pass: "should re-render" and "should call useState" both name React mechanics, not behavior.

## Summary

The good test in every pair asserts on:

1. **Return values** — what the utility produced or the hook exposes.
2. **Observable state** — what `result.current` looks like after an `act`.
3. **Boundary side effects** — HTTP calls, storage writes — asserted at the boundary, not in the middle.

The bad test in every pair asserts on:

1. **Internal calls** — which functions / hooks / React primitives ran.
2. **Call counts and order** — how many times a mock was called and in what sequence.
3. **Mocked return values** — tautologies where the assertion just echoes the mock setup.

Also avoid, in order of frequency:

- **Snapshot abuse** on hook return values (`toMatchSnapshot()` with no meaningful assertion — passes until a reviewer blindly updates the file).
- **Testing through a component when `renderHook` would do** (asserting on rendered DOM to check hook state indirectly).
- **Arbitrary `setTimeout` in async tests** — use fake timers or `waitFor` with a real condition.
