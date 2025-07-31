# 2025-07-28 – Restaurar navegación al perfil desde el radar

## Descripción

Se restauró la funcionalidad para que, al tocar la imagen de un usuario en el radar, se muestre el cuadro de diálogo y el botón "Ver perfil" navegue correctamente al perfil dinámico por ID.

## Plan de acción

- Revisar el archivo `app/dashboard/radar.tsx` para identificar la lógica de selección y el cuadro de diálogo.
- Corregir el botón "Ver perfil" para que utilice el router y navegue a `/dashboard/profile/[id]`.
- Verificar que el zIndex y la selección visual funcionen correctamente.
- Documentar el cambio en el devlog.

## Archivos modificados

- `app/dashboard/radar.tsx`

## Observaciones

- El resto de la lógica de selección y visualización ya estaba implementada.
- El botón "Ver perfil" solo hacía un `console.log`; ahora navega correctamente usando `router.push`.
- No se detectaron efectos colaterales en la UI.
