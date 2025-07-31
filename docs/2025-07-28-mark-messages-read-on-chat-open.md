# Marcar mensajes como leídos al entrar a un chat

**Fecha:** 2025-07-28

## Objetivo

Al entrar a un chat específico, enviar un request que marque como `readed = TRUE` todos los mensajes no leídos (no enviados por el usuario actual) de ese chat, manteniendo la estructura modular (repositorios, servicios, hooks).

## Plan

1. Analizar la arquitectura y archivos relevantes del chat.
2. Agregar función en `message.repository.ts` para marcar todos los mensajes como leídos.
3. Agregar hook en `message.service.ts` para exponer la función de marcar como leídos.
4. Integrar el hook en `app/dashboard/chats/[chatId]/index.tsx` al entrar al chat.
5. Documentar la tarea y actualizar el devlog.

## Archivos modificados

- `src/modules/chat/repositories/message.repository.ts`
- `src/modules/chat/services/message.service.ts`
- `app/dashboard/chats/[chatId]/index.tsx`
- `docs/devlog.md` (documentación)

## Notas

- Se utiliza Supabase para actualizar los mensajes.
- El request solo afecta mensajes no enviados por el usuario actual y con `readed` en `false` o `null`.
- El hook se dispara automáticamente al entrar al chat o cambiar de usuario/chat.
