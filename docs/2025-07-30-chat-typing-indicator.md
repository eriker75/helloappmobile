# 2025-07-30 – Indicador de "Escribiendo..." en Chat (Typing Indicator)

## Objetivo

Implementar un indicador visual y en tiempo real que muestre cuando un usuario está escribiendo en un chat. El indicador debe aparecer:

- En la parte inferior de la pantalla de chat (animación de puntitos, mobile-friendly).
- En la parte superior del chat ("Escribiendo...").
- En la lista de chats, resaltando el chat donde alguien está escribiendo.

## Plan de acción

1. Implementar backend: crear tabla/canal "typing" en Supabase para eventos de escritura.
2. Añadir lógica en repositorio, servicio y hook para enviar y escuchar eventos de typing.
3. Añadir indicador animado en la UI de chat (abajo y arriba).
4. Mostrar estado de typing en la lista de chats.
5. Limpiar estado de typing correctamente (timeout, onSend).
6. Escribir pruebas unitarias/integración para la lógica de typing.
7. Actualizar devlog y documentación.

## Archivos a crear/modificar

- Supabase: tabla/canal "typing"
- `src/modules/chat/repositories/typing.repository.ts`
- `src/modules/chat/services/typing.service.ts`
- `src/modules/chat/hooks/useTyping.ts`
- `src/modules/chat/stores/chat.store.ts`
- `app/dashboard/chats/[chatId]/index.tsx`
- `app/dashboard/chats/index.tsx`
- `components/ui/TypingIndicator.tsx` (nuevo)
- Pruebas relacionadas y documentación

## Observaciones

- Seguir el patrón modular y la arquitectura existente.
- El evento de typing debe ser efímero (expira tras unos segundos o al enviar mensaje).
- Priorizar UX: animación fluida, feedback inmediato, sin duplicar lógica.
- Documentar cambios en devlog y mantener archivos <300 líneas.
