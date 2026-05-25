// Dashboard.jsx — AppShell, Sidebar, Dashboard público, Detalhe (tema claro · Recife)

/* ── Helpers ── */
function OdsBadge({ id, small }) {
  const o = window.HubData.ODS_LIST.find(x => x.id === id);
  if (!o) return null;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, background: o.color+'18',
      border:`1px solid ${o.color}44`, borderRadius: small ? 4 : 6,
      padding: small ? '2px 6px' : '4px 9px', fontSize: small ? 10 : 11, fontWeight:600, color: o.color, whiteSpace:'nowrap' }}>
      <span style={{ width: small ? 10 : 12, height: small ? 10 : 12, borderRadius:2, background: o.color, display:'inline-block', flexShrink:0, fontSize:8, color:'#fff', textAlign:'center', lineHeight: small ? '10px' : '12px', fontWeight:800 }}>{id}</span>
      {!small && <span style={{maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{o.label}</span>}
    </span>
  );
}

function Avatar({ initials, size=36, color='#0060e0' }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, border:`2px solid ${color}33`,
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.36, fontWeight:700, color, flexShrink:0 }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { published:['Publicado','#059669'], review:['Em análise','#d97706'], draft:['Rascunho','#6b7fa3'], hidden:['Oculto','#dc2626'] };
  const [label, color] = map[status] || ['?','#888'];
  return <span style={{ fontSize:11, fontWeight:700, color, background:color+'18', border:`1px solid ${color}33`, borderRadius:4, padding:'2px 8px' }}>{label}</span>;
}

/* ── Sidebar ── */
function Sidebar({ nav, setNav, user, onLogout }) {
  const researcherItems = [
    { id:'dashboard',  icon:'◎', label:'Explorar' },
    { id:'myresearch', icon:'⊞', label:'Minhas Pesquisas' },
    { id:'chat',       icon:'✉', label:'Mensagens', badge: 1 },
    { id:'new',        icon:'+', label:'Nova Pesquisa', accent:true },
  ];
  const govItems = [
    { id:'dashboard',    icon:'◎', label:'Explorar' },
    { id:'govdashboard', icon:'◈', label:'Painel do Gestor' },
    { id:'approvals',    icon:'✓', label:'Aprovações', badge: 3 },
    { id:'connections',  icon:'🔗', label:'Conexões' },
    { id:'chat',         icon:'✉', label:'Mensagens', badge: 1 },
  ];
  const items = (user.role === 'gov' || user.role === 'org') ? govItems : researcherItems;
  return (
    <aside style={sidebarStyles.root}>
      {/* Logo Recife */}
      <div style={sidebarStyles.logo}>
        <img src={(window.__resources||{}).logo_recife||'logo_recife.jpg'} alt="Recife" style={{width:36,height:36,borderRadius:8,objectFit:'cover',flexShrink:0}}/>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:'#0d1f3c',letterSpacing:'-0.3px'}}>Hub Inovação</div>
          <div style={{fontSize:10,color:'#6b7fa3'}}>Recife · PE</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'8px 0'}}>
        {items.map(item => (
          <button key={item.id} onClick={() => setNav(item.id)}
            style={{...sidebarStyles.navItem, ...(nav===item.id ? sidebarStyles.navActive : {}), ...(item.accent ? sidebarStyles.navAccent : {})}}>
            <span style={{fontSize:16,width:20,textAlign:'center',flexShrink:0}}>{item.icon}</span>
            <span style={{flex:1,textAlign:'left'}}>{item.label}</span>
            {item.badge && <span style={sidebarStyles.badge}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={sidebarStyles.userCard}>
        <Avatar initials={user.avatar} size={32}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,color:'#0d1f3c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
          <div style={{fontSize:10,color:'#6b7fa3'}}>{user.institution}</div>
        </div>
        <button onClick={onLogout} title="Sair" style={{background:'none',border:'none',color:'#6b7fa3',cursor:'pointer',fontSize:14,padding:'4px'}}>⏻</button>
      </div>
    </aside>
  );
}

const sidebarStyles = {
  root:{ width:220,flexShrink:0,background:'#ffffff',borderRight:'1px solid rgba(0,60,180,0.1)',display:'flex',flexDirection:'column',height:'100vh',position:'sticky',top:0,boxShadow:'2px 0 12px rgba(0,60,180,0.06)' },
  logo:{ display:'flex',alignItems:'center',gap:10,padding:'18px 16px 14px',borderBottom:'1px solid rgba(0,60,180,0.08)' },
  navItem:{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 16px',border:'none',background:'transparent',color:'#6b7fa3',fontSize:13,fontWeight:500,cursor:'pointer',transition:'all 0.15s',borderRadius:0,fontFamily:'inherit',borderLeft:'3px solid transparent' },
  navActive:{ background:'rgba(0,96,224,0.07)',color:'#0060e0',borderLeft:'3px solid #0060e0',fontWeight:700 },
  navAccent:{ color:'#059669',fontWeight:700 },
  badge:{ background:'#0060e0',color:'#fff',fontSize:10,fontWeight:700,borderRadius:10,padding:'1px 6px',minWidth:16,textAlign:'center' },
  userCard:{ display:'flex',alignItems:'center',gap:8,padding:'14px 16px',borderTop:'1px solid rgba(0,60,180,0.08)',background:'#f7faff' },
};

/* ── Research Card ── */
function ResearchCard({ project, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onClick(project)}
      style={{background:'#ffffff',border:`1px solid ${hov ? 'rgba(0,96,224,0.25)' : 'rgba(0,60,180,0.1)'}`,borderRadius:12,
        padding:'20px',cursor:'pointer',transition:'all 0.2s',transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 8px 28px rgba(0,60,180,0.12)' : '0 1px 4px rgba(0,60,180,0.05)',display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:10,justifyContent:'space-between'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
            <span style={{fontSize:10,fontWeight:700,color:'#0060e0',background:'rgba(0,96,224,0.1)',borderRadius:4,padding:'2px 8px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{project.area}</span>
            <span style={{fontSize:10,fontWeight:600,color:'#6b7fa3',background:'rgba(0,0,0,0.04)',borderRadius:4,padding:'2px 8px'}}>{project.type}</span>
            <span style={{fontSize:10,fontWeight:600,color:'#6b7fa3',background:'rgba(0,0,0,0.04)',borderRadius:4,padding:'2px 8px'}}>{project.institution}</span>
          </div>
          <h3 style={{margin:0,fontSize:14,fontWeight:700,color:'#0d1f3c',lineHeight:1.4,textWrap:'pretty'}}>{project.title}</h3>
        </div>
      </div>
      <p style={{margin:0,fontSize:13,color:'#6b7fa3',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{project.simplified}</p>
      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
        {project.ods.map(id => <OdsBadge key={id} id={id} small/>)}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:8,borderTop:'1px solid rgba(0,60,180,0.07)'}}>
        <Avatar initials={project.researcher.avatar} size={24}/>
        <span style={{fontSize:12,color:'#6b7fa3',flex:1}}>{project.researcher.name}</span>
        <span style={{fontSize:11,color:'#6b7fa3'}}>👁 {project.views}</span>
        <span style={{fontSize:11,color:'#059669',fontWeight:600}}>🔗 {project.connections}</span>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({ onDetail }) {
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({ area:'', institution:'', type:'', ods:'' });

  const filtered = window.HubData.PROJECTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.keywords.some(k=>k.includes(q)) || p.simplified.toLowerCase().includes(q);
    const matchArea = !filters.area || p.area === filters.area;
    const matchInst = !filters.institution || p.institution === filters.institution;
    const matchType = !filters.type || p.type === filters.type;
    const matchOds = !filters.ods || p.ods.includes(parseInt(filters.ods));
    return matchSearch && matchArea && matchInst && matchType && matchOds;
  });

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: f[k]===v ? '' : v }));

  return (
    <div style={{flex:1,overflow:'auto',background:'#f4f8ff'}}>
      {/* Hero */}
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'28px 32px 22px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:22}}>
          <div>
            <h1 style={{margin:0,fontSize:24,fontWeight:800,color:'#0d1f3c',letterSpacing:'-0.5px'}}>Explorar Pesquisas</h1>
            <p style={{margin:'5px 0 0',fontSize:14,color:'#6b7fa3'}}>Conhecimento acadêmico de Recife, aberto para conexões</p>
          </div>
          <div style={{display:'flex',gap:24}}>
            {[['6','Pesquisas'],['3','Instituições'],['27','Conexões']].map(([n,l]) => (
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#0060e0'}}>{n}</div>
                <div style={{fontSize:11,color:'#6b7fa3'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Search */}
        <div style={{position:'relative',marginBottom:14}}>
          <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:15,color:'#6b7fa3'}}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por tema, palavra-chave, pesquisador..."
            style={{width:'100%',boxSizing:'border-box',background:'#f7faff',border:'1px solid rgba(0,60,180,0.15)',borderRadius:10,padding:'12px 16px 12px 42px',color:'#0d1f3c',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
        </div>
        {/* Filter chips */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {window.HubData.AREAS.slice(0,6).map(a => (
            <button key={a} onClick={() => setFilter('area',a)}
              style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${filters.area===a ? '#0060e0' : 'rgba(0,60,180,0.15)'}`,background: filters.area===a ? 'rgba(0,96,224,0.1)' : '#ffffff',color: filters.area===a ? '#0060e0' : '#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s',fontWeight: filters.area===a ? 600 : 400}}>
              {a}
            </button>
          ))}
          {window.HubData.INSTITUTIONS.slice(0,3).map(i => (
            <button key={i} onClick={() => setFilter('institution',i)}
              style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${filters.institution===i ? '#059669' : 'rgba(0,60,180,0.15)'}`,background: filters.institution===i ? 'rgba(5,150,105,0.08)' : '#ffffff',color: filters.institution===i ? '#059669' : '#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s',fontWeight: filters.institution===i ? 600 : 400}}>
              {i}
            </button>
          ))}
          {(filters.area || filters.institution || search) &&
            <button onClick={() => { setFilters({area:'',institution:'',type:'',ods:''}); setSearch(''); }}
              style={{padding:'5px 12px',borderRadius:20,border:'1px solid rgba(220,38,38,0.25)',background:'rgba(220,38,38,0.06)',color:'#dc2626',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
              ✕ Limpar
            </button>
          }
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:'24px 32px'}}>
        <div style={{fontSize:13,color:'#6b7fa3',marginBottom:16}}>{filtered.length} pesquisa{filtered.length!==1?'s':''} encontrada{filtered.length!==1?'s':''}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16}}>
          {filtered.map(p => <ResearchCard key={p.id} project={p} onClick={onDetail}/>)}
        </div>
        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'60px 0',color:'#6b7fa3'}}>
            <div style={{fontSize:40,marginBottom:12}}>🔬</div>
            <div style={{fontSize:16,fontWeight:600,color:'#0d1f3c'}}>Nenhuma pesquisa encontrada</div>
            <div style={{fontSize:13,marginTop:6}}>Tente outros termos ou remova filtros</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Research Detail ── */
function ResearchDetail({ project, onBack, onContact }) {
  const [tab, setTab] = React.useState('simplified');
  return (
    <div style={{flex:1,overflow:'auto',background:'#f4f8ff'}}>
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'14px 32px',display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onBack} style={{background:'none',border:'1px solid rgba(0,60,180,0.2)',borderRadius:6,padding:'6px 12px',color:'#6b7fa3',cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>← Voltar</button>
        <span style={{fontSize:11,color:'#6b7fa3'}}>Explorar</span>
        <span style={{fontSize:11,color:'#6b7fa3'}}>/</span>
        <span style={{fontSize:11,color:'#0d1f3c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:320}}>{project.title}</span>
      </div>

      <div style={{maxWidth:880,margin:'0 auto',padding:'32px'}}>
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
            <span style={{fontSize:11,fontWeight:700,color:'#0060e0',background:'rgba(0,96,224,0.1)',borderRadius:4,padding:'3px 10px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{project.area}</span>
            <span style={{fontSize:11,color:'#6b7fa3',background:'rgba(0,0,0,0.05)',borderRadius:4,padding:'3px 10px'}}>{project.type}</span>
            <span style={{fontSize:11,color:'#6b7fa3',background:'rgba(0,0,0,0.05)',borderRadius:4,padding:'3px 10px'}}>{project.institution} · {project.year}</span>
          </div>
          <h1 style={{margin:0,fontSize:24,fontWeight:800,color:'#0d1f3c',lineHeight:1.3,letterSpacing:'-0.3px',textWrap:'pretty'}}>{project.title}</h1>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:24}}>
          <div>
            <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(0,60,180,0.1)',marginBottom:20}}>
              {[['simplified','✨ Versão Simplificada'],['abstract','📄 Resumo Técnico']].map(([t,l]) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{padding:'10px 18px',border:'none',borderBottom: tab===t ? '2px solid #0060e0' : '2px solid transparent',background:'transparent',color: tab===t ? '#0060e0' : '#6b7fa3',fontSize:13,fontWeight: tab===t ? 700 : 400,cursor:'pointer',fontFamily:'inherit',marginBottom:-1}}>
                  {l}
                </button>
              ))}
            </div>
            {tab==='simplified' && (
              <div style={{background:'rgba(0,96,224,0.04)',border:'1px solid rgba(0,96,224,0.15)',borderRadius:10,padding:'18px',marginBottom:16,display:'flex',gap:10,alignItems:'flex-start'}}>
                <span style={{fontSize:20}}>✨</span>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#0060e0',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Gerado por IA · Linguagem Acessível</div>
                  <p style={{margin:0,fontSize:14,color:'#2d3f6b',lineHeight:1.75}}>{project.simplified}</p>
                </div>
              </div>
            )}
            {tab==='abstract' && (
              <p style={{fontSize:14,color:'#4a5a7a',lineHeight:1.8,margin:0}}>{project.abstract}</p>
            )}
            <div style={{marginTop:24}}>
              <div style={{fontSize:12,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Palavras-chave</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {project.keywords.map(k => (
                  <span key={k} style={{fontSize:12,color:'#4a5a7a',background:'rgba(0,60,180,0.05)',border:'1px solid rgba(0,60,180,0.12)',borderRadius:4,padding:'4px 10px'}}>#{k}</span>
                ))}
              </div>
            </div>
            <div style={{marginTop:24}}>
              <div style={{fontSize:12,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>ODS Relacionados</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {project.ods.map(id => <OdsBadge key={id} id={id}/>)}
              </div>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'20px',boxShadow:'0 2px 12px rgba(0,60,180,0.06)'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14}}>Pesquisador(a)</div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <Avatar initials={project.researcher.avatar} size={44}/>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#0d1f3c'}}>{project.researcher.name}</div>
                  <div style={{fontSize:12,color:'#6b7fa3'}}>{project.researcher.institution}</div>
                  <div style={{fontSize:11,color:'#6b7fa3'}}>{project.researcher.area}</div>
                </div>
              </div>
              <button onClick={() => onContact(project)}
                style={{width:'100%',background:'linear-gradient(135deg,#3b8eff,#0040cc)',border:'none',borderRadius:8,padding:'11px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                💬 Iniciar Contato
              </button>
            </div>
            <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'16px',display:'flex',gap:16,boxShadow:'0 2px 8px rgba(0,60,180,0.04)'}}>
              <div style={{flex:1,textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#0060e0'}}>{project.views}</div>
                <div style={{fontSize:11,color:'#6b7fa3'}}>Visualizações</div>
              </div>
              <div style={{width:1,background:'rgba(0,60,180,0.08)'}}/>
              <div style={{flex:1,textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#059669'}}>{project.connections}</div>
                <div style={{fontSize:11,color:'#6b7fa3'}}>Conexões</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Dashboard, ResearchDetail, OdsBadge, Avatar, StatusBadge });
