-- =============================================================
-- Iara Games — Fase 07: perfis de usuário (Supabase)
-- Execute no Supabase: SQL Editor > New query > Run.
-- A senha NÃO fica aqui: ela é tratada exclusivamente pelo Supabase Auth.
-- =============================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  cep         text,
  logradouro  text,
  numero      text,
  complemento text,
  bairro      text,
  cidade      text,
  estado      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security: cada usuário só enxerga e altera a própria linha.
alter table public.profiles enable row level security;

drop policy if exists "Perfil: ler o próprio" on public.profiles;
create policy "Perfil: ler o próprio"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Perfil: inserir o próprio" on public.profiles;
create policy "Perfil: inserir o próprio"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Perfil: atualizar o próprio" on public.profiles;
create policy "Perfil: atualizar o próprio"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Nenhuma política de DELETE: o perfil é removido junto com o usuário (on delete cascade).

-- Cria o perfil automaticamente quando um usuário se cadastra no Supabase Auth,
-- a partir dos metadados enviados no signUp (nome e endereço; sem coordenadas).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, cep, logradouro, numero, complemento, bairro, cidade, estado)
  values (
    new.id,
    left(new.raw_user_meta_data ->> 'full_name', 120),
    left(regexp_replace(coalesce(new.raw_user_meta_data ->> 'cep', ''), '\D', '', 'g'), 8),
    left(new.raw_user_meta_data ->> 'logradouro', 160),
    left(new.raw_user_meta_data ->> 'numero', 20),
    left(new.raw_user_meta_data ->> 'complemento', 80),
    left(new.raw_user_meta_data ->> 'bairro', 120),
    left(new.raw_user_meta_data ->> 'cidade', 120),
    left(upper(new.raw_user_meta_data ->> 'estado'), 2)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém updated_at atualizado.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
