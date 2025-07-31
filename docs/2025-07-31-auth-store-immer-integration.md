# 2025-07-31: Integrate Immer into Auth User Profile Store

## Objective

Refactor the Zustand store for user authentication profile (`auth-user-profile.store.ts`) to use the `immer` middleware for safer and more ergonomic immutable state updates.

## Files Modified

- `app/src/features/users/stores/auth-user-profile.store.ts`

## Summary of Changes

- Installed the `immer` package.
- Integrated Zustand's `immer` middleware into the auth user profile store.
- Refactored all state-updating actions to use mutative logic enabled by immer.
- Updated the store's type signature to support both `persist` and `immer` middlewares.

## Rationale

Using immer with Zustand allows for more readable and less error-prone state updates, especially as the store logic grows in complexity. This change ensures future maintainability and consistency with best practices for immutable state management.

## Observations

- No breaking changes to the store's public API.
- All selectors and usage patterns remain the same.
- TypeScript types were updated to support the new middleware stack.
