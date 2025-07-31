# 2025-07-28 – Navegación al perfil desde avatar en detalle de chat

## Resumen

Se implementó la funcionalidad para que, en la vista de detalle de chat (`app/dashboard/chats/[chatId]/index.tsx`), al hacer clic en el avatar del usuario (en chats 1 a 1), se navegue directamente al perfil de ese usuario (`/dashboard/profile/[id]`). Para grupos, el avatar no es interactivo.

## Archivos modificados

- `app/dashboard/chats/[chatId]/index.tsx`

## Detalles técnicos

- El avatar en el header ahora está envuelto en un `<Pressable>` solo si el chat es 1 a 1 y existe `other_user_profile.user_id`.
- El handler de navegación incluye una verificación en tiempo de ejecución para evitar errores de acceso a propiedades indefinidas.
- Se mantiene la arquitectura modular y la separación de responsabilidades.

## Observaciones

- Se respeta la experiencia de usuario fluida y la consistencia visual.
- No se afecta la lógica de mensajes ni la carga de datos.
