# WhatsApp-Style Chat List UI for Chat Screen

**Date:** 2025-07-19

## Objective

Redesign the chat list screen (`app/dashboard/chat.tsx`) to match a WhatsApp-style interface, as shown in the provided reference image.

## Action Plan

1. Analyze and reuse existing UI components (`Avatar`, `HStack`, `VStack`, `Text`, `Box`).
2. Implement a header with the "Chats" title and user avatar.
3. Render a list of chat items, each displaying:
   - User avatar
   - Name
   - Last message (with status icon if needed)
   - Timestamp
   - Unread message badge (if any)
4. Use mock data for chat items.
5. Ensure the design is clean, modular, and maintainable.

## Files to Modify

- `app/dashboard/chat.tsx` (main implementation)

## Observations

- All UI primitives are available in `components/ui/`.
- No existing chat list or chat item component; will implement inline for now.
- Will use mock data for demonstration.
- No navigation or chat detail view will be implemented in this task.

## Next Steps

- Implement the UI in `app/dashboard/chat.tsx` as per the plan.
