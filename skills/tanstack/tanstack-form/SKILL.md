---
name: tanstack-form
description: Build forms using TanStack Form with the project's useAppForm composition, composable field components, Zod validation schemas, FormFieldWrapper error tracking, and form.AppField vs form.Field patterns. Use when creating new forms, adding form fields, writing form validation, or working with TanStack Form in this project.
user-invocable: false
---

# TanStack Form — Project Composition Guide

## Architecture Layers

This project wraps TanStack Form into a 4-layer composition:

1. **Context** — `createFormHookContexts()` → `fieldContext`, `formContext`, `useFieldContext`
2. **Field Components** — composable components that consume `useFieldContext()` to read field state/errors
3. **Hook Factory** — `createFormHook()` → `useAppForm`, `withForm`, `withFieldGroup`
4. **Form Instances** — `useAppForm({ validators, defaultValues, onSubmit })`

## Quick Start — Creating a Form

**Key patterns:**

- Zod schema per form in `schemas.ts`, passed to `validators.onSubmit` (not a resolver); custom messages via the `error` callback, checking `iss.input` to tell "required" from "invalid"
- `form.AppField` provides pre-registered field components (`field.InputField`, `field.FormFieldWrapper`, etc.)
- `form.Field` provides raw field state for custom rendering, array fields, or conditional logic
- `form.Subscribe` observes form state reactively (submit button `canSubmit` / `isSubmitting`, global errors)
- For API error mapping, use `formApi.setErrorMap()` in mutation `onError`
- For focusing first invalid field on submit, use `focusFirstError()` in `onSubmitInvalid`

```tsx
const form = useAppForm({
    defaultValues: { name: '' },
    validators: { onSubmit: yourSchema },
    onSubmit({ value }) {
        /* handle submit */
    },
    onSubmitInvalid({ formApi }) {
        focusFirstError('#your-form', formApi.state.errorMap.onSubmit);
    },
});

<form id="your-form" noValidate={true} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
    <FieldSet>
        <FieldGroup>
            <form.AppField
                name="name"
                children={(field) => {
                    return (
                        <field.FormFieldWrapper label="Name">
                            <field.InputField placeholder="Enter name" />
                        </field.FormFieldWrapper>
                    );
                }}
            />
            {/* submit button: <Field> + form.Subscribe */}
        </FieldGroup>
    </FieldSet>
</form>
```

Full runnable form with imports, schema and submit button: [Minimal Working Form](REFERENCE.md#minimal-working-form); schema patterns: [Zod Schema Patterns](REFERENCE.md#zod-schema-patterns).

## form.AppField vs form.Field

| | `form.AppField` | `form.Field` |
|---|---|---|
| **Provides** | `field.InputField`, `field.FormFieldWrapper`, `field.PasswordInputField` | Raw `field.state`, `field.handleChange` only |
| **Use when** | Using a registered field component | Custom rendering, array fields, conditional logic |
| **Error tracking** | Via `field.FormFieldWrapper` + `useFieldContext` | Manual via `field.state.meta.errors` |

**Rule:** Use `form.AppField` for standard fields. Use `form.Field` for arrays (`mode="array"`), custom UI, or reading field values without a registered component.

**Choosing form controls:**

- Text input -> `field.InputField`
- Password -> `field.PasswordInputField` (has built-in show/hide toggle)
- Other controls (Textarea, Switch, Checkbox, RadioGroup, etc.) -> use `form.Field` with raw rendering

## FormFieldWrapper — Error Tracking

`FormFieldWrapper` is a **registered field component** — use it as `field.FormFieldWrapper` inside `form.AppField`, never as a standalone import. It reads the field's first error via `useFieldContext()` + `getFieldErrorMessage()` and renders `Field` (with `data-invalid`) > `FieldLabel` + children + `FieldError`. Props: `label` (no label if omitted), `labelClassName`, `className`, `children`. Internals: [FormFieldWrapper](REFERENCE.md#formfieldwrapper--error-tracking-wrapper).

## Layout Helpers

Structure forms with the project's UI Field components from `@/components/ui/Field`: `FieldSet` (section `<fieldset>`), `FieldGroup` (fields with consistent gap), `FieldLegend` (section title), `FieldSeparator` (between groups), `FieldDescription` (helper text below a field).

## Workflow Checklist

- [ ] Define Zod schema with custom error messages
- [ ] Call `useAppForm()` with `defaultValues`, `validators: { onSubmit: schema }`, and `onSubmit`
- [ ] Optionally add `onSubmitInvalid` with `focusFirstError()` for accessibility
- [ ] Wrap `<form>` element with `noValidate`, `e.preventDefault()` + `form.handleSubmit()`
- [ ] Use `FieldSet` + `FieldGroup` for layout structure
- [ ] Use `form.AppField` + `field.FormFieldWrapper` + `field.<Component>` for each field
- [ ] Use `form.Field` only for custom/array/conditional fields
- [ ] Use `form.Subscribe` for submit button state (`canSubmit`, `isSubmitting`)

## Advanced

Read [REFERENCE.md](REFERENCE.md) for the project's file paths, and before building anything beyond a flat form: all registered field components and their props, `withForm` / `withFieldGroup` composition, `form.Subscribe` patterns, array fields (editable tables), nested forms, creating a custom field component, and API error handling with `formApi.setErrorMap()`.
