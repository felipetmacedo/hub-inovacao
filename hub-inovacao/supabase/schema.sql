-- ============================================================
-- Hub de Inovação e Pesquisa de Recife — Supabase Schema
-- Rodar no SQL Editor do seu projeto Supabase
-- ============================================================

-- ── Perfis de usuário (estende auth.users) ──────────────────
create table if not exists public.profiles (
  id        uuid references auth.users on delete cascade primary key,
  name      text        not null,
  role      text        not null check (role in ('researcher', 'gov', 'org', 'investidor')),
  institution text,
  avatar    text        not null,  -- 2 iniciais, ex: "AL"
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfis visíveis para autenticados"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Usuário insere próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuário edita próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: cria perfil automaticamente após signup (opcional se usar insert manual)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role, institution, avatar)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'institution',
    coalesce(new.raw_user_meta_data->>'avatar', '?')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── Projetos de pesquisa ─────────────────────────────────────
create table if not exists public.research_projects (
  id               bigserial primary key,
  title            text        not null,
  institution      text        not null,
  area             text        not null,
  type             text        not null,
  keywords         text[]      default '{}',
  ods              integer[]   default '{}',
  status           text        not null default 'draft'
                     check (status in ('draft', 'review', 'published', 'hidden')),
  researcher_id    uuid        references public.profiles(id) not null,
  abstract         text,
  simplified       text,
  year             integer     not null default extract(year from now())::integer,
  views            integer     default 0,
  connections_count integer    default 0,
  tags             text[]      default '{}',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.research_projects enable row level security;

-- Publicadas visíveis para todos; rascunhos/revisão só para o autor
create policy "Projetos publicados visíveis para todos"
  on public.research_projects for select
  using (status = 'published' or researcher_id = auth.uid());

-- Gov/org também vê projetos em revisão para aprovação
create policy "Gov vê projetos em revisão"
  on public.research_projects for select
  using (
    status = 'review' and
    exists (select 1 from public.profiles where id = auth.uid() and role in ('gov', 'org'))
  );

create policy "Pesquisador cria próprios projetos"
  on public.research_projects for insert
  with check (researcher_id = auth.uid());

create policy "Pesquisador edita próprios projetos"
  on public.research_projects for update
  using (researcher_id = auth.uid());

-- Gov/org pode atualizar status (aprovação)
create policy "Gov aprova projetos"
  on public.research_projects for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('gov', 'org'))
  );

-- Trigger: atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger research_projects_updated_at
  before update on public.research_projects
  for each row execute function public.set_updated_at();


-- ── Conversas ────────────────────────────────────────────────
create table if not exists public.conversations (
  id            bigserial primary key,
  project_id    bigint      references public.research_projects(id) not null,
  org_user_id   uuid        references public.profiles(id) not null,
  researcher_id uuid        references public.profiles(id) not null,
  created_at    timestamptz default now(),
  unique (project_id, org_user_id)  -- evita duplicar conversa para mesmo projeto+org
);

alter table public.conversations enable row level security;

create policy "Participantes veem a conversa"
  on public.conversations for select
  using (org_user_id = auth.uid() or researcher_id = auth.uid());

create policy "Usuário autenticado inicia conversa"
  on public.conversations for insert
  with check (org_user_id = auth.uid() or researcher_id = auth.uid());


-- ── Mensagens ────────────────────────────────────────────────
create table if not exists public.messages (
  id              bigserial primary key,
  conversation_id bigint      references public.conversations(id) on delete cascade not null,
  sender_id       uuid        references public.profiles(id) not null,
  text            text        not null,
  created_at      timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Participantes veem mensagens"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.org_user_id = auth.uid() or c.researcher_id = auth.uid())
    )
  );

create policy "Participantes enviam mensagens"
  on public.messages for insert
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.org_user_id = auth.uid() or c.researcher_id = auth.uid())
    )
  );

-- Habilitar Realtime para messages
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;


-- ── Dados iniciais (seed) ────────────────────────────────────
-- Após criar um usuário pesquisador, você pode inserir projetos de exemplo:
-- insert into public.research_projects (title, institution, area, type, keywords, ods, status, researcher_id, abstract, simplified, year, views, connections_count, tags)
-- values ('Detecção Precoce de Dengue ...', 'UFPE', 'Saúde', 'Aplicada', ...);
