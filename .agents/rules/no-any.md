---
name: "no-any"
description: "Rule enforcing strict type safety and forbidding the use of the `any` type in the project."
---

# Strict Type Safety Rule

1. **NO ANY**: Never use the `any` type anywhere in the codebase. Use `unknown`, generics, or define proper strict interfaces.
2. **Data Contracts**: All data exchanged between the frontend and backend must be strictly validated using **Zod**. Every route that accepts JSON payloads must use the `validateRequest` middleware with a defined Zod schema.
3. **Frontend Typing**: All frontend components, contexts, and hooks must use strict TypeScript interfaces.
4. **Error Handling**: Use `catch (err: unknown)` instead of `any`. Safely narrow the error type (e.g. `err instanceof Error`).
