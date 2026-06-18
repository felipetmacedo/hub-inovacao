# Hub de Inovação e Pesquisa — Recife

Plataforma que conecta pesquisadores universitários, organizações privadas e gestores públicos de Recife. Pesquisas são cadastradas, simplificadas por IA, aprovadas institucionalmente e então visíveis para conexão.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite 8 (SPA) |
| Backend/Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Edge Function (IA) | Deno + Groq (Llama 3.3 70B) |
| Deploy Frontend | Vercel |
| Deploy Backend | Supabase Cloud (sa-east-1 — São Paulo) |

---

## Frontend

```
src/
├── components/
│   ├── Auth/         # Tela de login e cadastro (2 passos)
│   ├── Chat/         # Chat em tempo real entre org e pesquisador
│   ├── Dashboard/    # Exploração e busca de pesquisas publicadas
│   ├── Gov/          # Painel do gestor + tela de aprovações
│   ├── Layout/       # Sidebar (desktop) e MobileNav (mobile)
│   ├── Research/     # Formulário multi-etapas + minhas pesquisas
│   └── shared/       # Avatar, StatusBadge, OdsBadge
├── contexts/
│   └── AuthContext.jsx   # Sessão, profile, signIn, signUp, signOut
├── hooks/
│   ├── useApprovals.js        # Carrega pesquisas em review p/ gov/org
│   ├── useConversations.js    # Lista e inicia conversas
│   ├── useMessages.js         # Mensagens com Realtime subscription
│   ├── useMyProjects.js       # Pesquisas do pesquisador logado
│   ├── useProjectMutations.js # create/update/hide/approve/reject
│   └── useProjects.js         # Dashboard público com filtros
├── lib/
│   └── supabase.js    # Cliente Supabase inicializado com env vars
└── data.js            # ODS_LIST, áreas, tipos, instituições
```

### Perfis de usuário

| Role | Acesso |
|------|--------|
| `researcher` | Cadastra e gerencia pesquisas, recebe contatos via chat |
| `org` | Explora pesquisas publicadas, inicia chat com pesquisador |
| `gov` | Aprova/reprova pesquisas, acessa painel de métricas |

### Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # nunca expor ao browser
```

### Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

---

## Backend — Supabase

### Tabelas

#### `profiles`
Estende `auth.users`. Criada automaticamente via trigger `handle_new_user` (security definer) no momento do signup.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid PK | Referencia `auth.users.id` |
| `name` | text | Nome completo |
| `role` | text | `researcher` \| `gov` \| `org` |
| `institution` | text | Instituição de vínculo |
| `avatar` | text | Iniciais (ex: "FT") |

#### `research_projects`
Pesquisas cadastradas pelos pesquisadores.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | bigserial PK | — |
| `title` | text | Título da pesquisa |
| `status` | text | `draft` \| `review` \| `published` \| `hidden` |
| `researcher_id` | uuid FK | Referencia `profiles.id` |
| `abstract` | text | Resumo técnico |
| `simplified` | text | Versão gerada por IA |
| `area` | text | Área do conhecimento |
| `type` | text | Tipo de pesquisa |
| `keywords` | text[] | Palavras-chave |
| `ods` | integer[] | ODS associados (1–17) |
| `institution` | text | Instituição responsável |
| `year` | integer | Ano da pesquisa |
| `views` | integer | Visualizações |
| `connections_count` | integer | Conexões iniciadas |

**Fluxo de status:**
```
[cadastro] → review → published  (aprovado pelo gestor)
                    → draft       (reprovado, retorna para edição)
[pesquisador] → hidden            (ocultado manualmente)
```

#### `conversations`
Canal de comunicação entre org e pesquisador. Único por par `(project_id, org_user_id)`.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `project_id` | bigint FK | Pesquisa que originou o contato |
| `org_user_id` | uuid FK | Usuário org/gov que iniciou |
| `researcher_id` | uuid FK | Pesquisador do projeto |

#### `messages`
Mensagens dentro de uma conversa. Realtime habilitado.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `conversation_id` | bigint FK | Conversa pai |
| `sender_id` | uuid FK | Quem enviou |
| `text` | text | Conteúdo da mensagem |

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado. Políticas principais:

| Tabela | Operação | Condição |
|--------|----------|----------|
| `profiles` | SELECT | Usuário autenticado |
| `profiles` | INSERT | `auth.uid() = id` |
| `research_projects` | SELECT | `status = 'published'` OU `researcher_id = auth.uid()` |
| `research_projects` | SELECT | `status = 'review'` E role in `('gov','org')` |
| `research_projects` | INSERT | `researcher_id = auth.uid()` |
| `research_projects` | UPDATE | `researcher_id = auth.uid()` (pesquisador edita próprio) |
| `research_projects` | UPDATE | role in `('gov','org')` (aprovação institucional) |
| `conversations` | SELECT/INSERT | participante da conversa |
| `messages` | SELECT/INSERT | participante da conversa pai |

### Aplicar schema no Supabase

Cole o conteúdo de `supabase/schema.sql` no **SQL Editor** do painel Supabase e execute.

---

## Edge Function — IA (Simplificação)

```
supabase/functions/simplify/index.ts
```

Deno serverless que recebe o resumo técnico e retorna versão acessível via Groq (Llama 3.3 70B).

**Input:**
```json
{ "abstract": "...", "title": "...", "institution": "..." }
```

**Output:**
```json
{ "simplified": "Texto em linguagem acessível..." }
```

**Deploy:**
```bash
supabase functions deploy simplify --project-ref <project-id>
supabase secrets set GROQ_API_KEY=gsk_...
```

Modelo: `llama-3.3-70b-versatile` (Groq) · Max tokens: 500 · Temperature: 0.7

---

## Deploy — Vercel (Frontend)

1. Conectar repositório GitHub no painel Vercel
2. Framework preset: **Vite** (auto-detectado)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Configurar env vars no painel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Deploy automático a cada push em `main`.

---

## Licença

Projeto acadêmico — Prefeitura do Recife · UFPE · UNICAP · CESAR School
