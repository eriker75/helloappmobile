# Task: Trim User Profile Bio to Excerpt

**Date:** 2025-07-28

## Summary

Trim the user profile bio so that only a reasonable excerpt is shown in the profile view, improving readability and UI consistency.

## Motivation

Long bios can overwhelm the profile screen and degrade the user experience. Showing only an excerpt keeps the interface clean and focused.

## Implementation

- Added a `getExcerpt` function in [`app/dashboard/profile/[id]/index.tsx`](app/dashboard/profile/[id]/index.tsx) to display only the first 140 characters of the user's bio, ending at a word boundary and appending "…" if trimmed.
- If the bio is shorter than 140 characters, it is shown in full.
- No existing utility for excerpting was found, so the function was implemented inline.

## Files Modified

- [`app/dashboard/profile/[id]/index.tsx`](app/dashboard/profile/[id]/index.tsx)

## Observations

- The change only affects the display; the full bio remains stored in the backend.
- No "Read more" link was added, as it was not requested.
- No regression or UI issues detected after the change.
