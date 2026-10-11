-- FND-04: one profile per auth user, created by trigger with an editable unique username.
create extension if not exists citext;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username citext not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text,
  bio text,
  avatar_path text,
  banner_path text,
  theme jsonb not null default '{}',
  sections jsonb not null default '[]',
  preferred_currency text not null default 'EUR' check (preferred_currency in ('EUR', 'USD')),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner or public can read" on public.profiles
  for select using (id = auth.uid() or is_public);

create policy "profiles: owner can update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- No insert/delete policies: rows are created by the trigger and removed by cascade.

create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = ''
as $$
begin
  loop
    begin
      insert into public.profiles (id, username)
      values (new.id, 'user_' || substr(md5(gen_random_uuid()::text), 1, 8));
      return new;
    exception when unique_violation then
      -- username collision: try another one
    end;
  end loop;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
