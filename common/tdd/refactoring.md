# Refactor Candidates

After a green TDD cycle, look for:

- **Duplication** → Extract function/class.
- **Long methods** → Break into helpers.
    - **Unexported helpers** stay private, tested via the parent unit's tests.
    - **Exported helpers** are now utilities in their own right — they need their own test file and fall under the 100% coverage target. Exporting is the signal.
    - Prefer unexported extraction by default. Export only when the helper is genuinely reusable.
- **Shallow modules** → Combine or deepen.
    - Shallow modules are easier to _mock_ but harder to _read_ and _reason about_. Unit-testability is not the same as good design.
    - Favor fewer, deeper modules with small public interfaces. Test the interface, not the depth.
- **Feature envy** → Move logic to where the data lives.
- **Primitive obsession** → Introduce value objects.
- **Existing code** the new code reveals as problematic.

**Never refactor while RED.** Get all tests green first, then refactor, then re-run tests after each step.
