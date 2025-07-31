# Migración de Supabase a Node.js + Socket.IO (NestJS)

**Fecha:** 2025-07-31  
**Estado:** plan  
**Responsable:** Roo

## Objetivo

Migrar la lógica de tiempo real y persistencia de datos de Supabase a un backend propio en Node.js usando NestJS y Socket.IO, asegurando la modularidad y la integración completa con la arquitectura actual.

## Plan de acción

1. Analizar la estructura y endpoints del backend (`back/src/chat` y `back/src/users`).
2. Implementar el módulo `chats` en `app/src/features/chats` siguiendo el patrón modular:
   - Crear/actualizar: `repositories`, `services`, `hooks`, `stores`, `dtos`.
   - Integrar llamadas REST a los endpoints de NestJS para CRUD de chats y mensajes.
   - Implementar lógica de tiempo real usando Socket.IO para eventos de mensajes, lectura, typing, etc.
3. Revisar y adaptar el módulo `users` para asegurar integración con el backend (si es necesario).
4. Eliminar cualquier dependencia o lógica residual de Supabase.
5. Probar la integración end-to-end (creación de chats, envío/recepción de mensajes, indicadores en tiempo real).
6. Documentar el proceso y actualizar el `devlog.md`.

## Archivos a crear/modificar

- `app/src/features/chats/repositories/`
- `app/src/features/chats/services/`
- `app/src/features/chats/hooks/`
- `app/src/features/chats/stores/`
- `app/src/features/chats/dtos/`
- (Posiblemente) `app/src/features/users/` (si requiere ajustes)
- `app/docs/2025-07-31-migracion-supabase-socketio-node.md` (este archivo)
- `app/docs/devlog.md` (al finalizar)

## Observaciones

- Seguir el patrón modular y la separación de responsabilidades ya presente en `users`.
- Priorizar la integración de eventos en tiempo real críticos: nuevos mensajes, estado de lectura, typing.
- Mantener la compatibilidad con la UI y los stores existentes.
- Documentar cualquier decisión arquitectónica relevante.
