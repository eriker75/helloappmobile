# 2025-07-28 – Mejora de carga en vista de chats

## Objetivo

Mejorar la experiencia de carga en la vista de chats mostrando un indicador circular (spinner) centrado sobre fondo blanco, manteniendo el header fijo y estable en la parte superior.

## Plan de acción

1. Analizar el estado de carga actual en `app/dashboard/chats/index.tsx`.
2. Reemplazar el texto de carga por un overlay blanco con el componente `Spinner` circular.
3. Asegurar que el header permanezca siempre visible y fijo, sin verse afectado por el overlay de carga.
4. Usar el componente `Spinner` de `components/ui/spinner`.
5. Documentar los cambios en este archivo y en `devlog.md` al finalizar.

## Archivos a modificar

- `app/dashboard/chats/index.tsx`
- `docs/devlog.md` (al finalizar)

## Observaciones

- El header actualmente no es fijo, pero se renderiza antes del contenido. Se mantendrá visible y estable durante la carga.
- El overlay de carga solo debe cubrir el área de la lista de chats, no el header.
- No se requiere modificar el layout general (`_layout.tsx`).

## Estado

plan
