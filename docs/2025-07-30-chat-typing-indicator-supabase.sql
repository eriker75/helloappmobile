-- Supabase SQL: Tabla y canal para eventos de "typing" en chat

-- 1. Crear tabla typing_events
create table if not exists public.typing_events (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null,
  user_id uuid not null,
  is_typing boolean not null default true,
  updated_at timestamp with time zone default timezone('utc', now()),
  constraint fk_chat foreign key (chat_id) references chats(id) on delete cascade,
  constraint fk_user foreign key (user_id) references users(id) on delete cascade
);

-- 2. Crear índice para búsquedas rápidas por chat
create index if not exists idx_typing_chat on public.typing_events (chat_id);

-- 3. Habilitar Realtime en la tabla typing_events
-- (En el panel de Supabase: Database > Replication > Añadir tabla typing_events a la lista de tablas con Realtime)

-- 4. Opcional: Limpiar eventos viejos automáticamente (ejemplo: 1 minuto)
create or replace function public.cleanup_old_typing_events()
returns void as $$
begin
  delete from public.typing_events where updated_at < (now() - interval '1 minute');
end;
$$ language plpgsql;

create or replace trigger trigger_cleanup_old_typing_events
after insert or update on public.typing_events
execute procedure public.cleanup_old_typing_events();
