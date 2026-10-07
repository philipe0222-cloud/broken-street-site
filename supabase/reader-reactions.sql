create table if not exists public.reader_reactions (
  id bigint generated always as identity primary key,
  chapter_number smallint not null check (chapter_number > 0),
  reaction_id text not null check (reaction_id ~ '^[a-z0-9_-]{1,40}$'),
  created_at timestamptz not null default now()
);

create index if not exists reader_reactions_chapter_option_idx
  on public.reader_reactions (chapter_number, reaction_id);

alter table public.reader_reactions enable row level security;

revoke all on table public.reader_reactions from anon, authenticated;
grant insert on table public.reader_reactions to anon, authenticated;
grant select on table public.reader_reactions to authenticated;

drop policy if exists "Anyone can submit a reader reaction" on public.reader_reactions;
create policy "Anyone can submit a reader reaction"
  on public.reader_reactions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Signed-in creator can read reader reactions" on public.reader_reactions;
create policy "Signed-in creator can read reader reactions"
  on public.reader_reactions
  for select
  to authenticated
  using (true);

create or replace function public.get_reader_reaction_counts()
returns table (chapter_number smallint, reaction_id text, total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select reactions.chapter_number, reactions.reaction_id, count(*)::bigint
  from public.reader_reactions as reactions
  group by reactions.chapter_number, reactions.reaction_id
  order by reactions.chapter_number, reactions.reaction_id;
$$;

revoke all on function public.get_reader_reaction_counts() from public, anon;
grant execute on function public.get_reader_reaction_counts() to authenticated;
