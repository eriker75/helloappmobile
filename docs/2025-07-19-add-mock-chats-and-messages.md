# Add More Mock Chats and Messages for Scroll Testing

**Date:** 2025-07-19

## Objective

Add a larger set of mock chats to the chat list and more mock messages to the chat detail view to test scroll behavior and UI performance.

## Action Plan

1. Review and reuse the existing mock data structure in both files.
2. Add 15+ mock chats to `app/dashboard/chat.tsx`.
3. Add 30+ mock messages to `app/dashboard/[chatId]/index.tsx`.
4. Ensure the UI scrolls smoothly and all elements render correctly.
5. Document changes and update devlog after completion.

## Files to Modify

- `app/dashboard/chat.tsx`
- `app/dashboard/[chatId]/index.tsx`

## Observations

- All changes are for UI demonstration only; no backend or real data involved.
- Will not affect navigation or other app logic.
