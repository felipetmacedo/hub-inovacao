// GovPanel.jsx — Painel do Gestor, Aprovações Institucionais, Conexões

/* ── Gov Dashboard ── */
function GovDashboard({ onApprovals, onDetail }) {
  const projects = window.HubData.PROJECTS;
  const areaCount = {};
  projects.forEach(p => { areaCount[p.area] = (areaCount[p.area]||0) + 1; });
  const topAreas = Object.entries(areaCount).sort((a,b)=>b[1]-a[1]);
  const maxArea = Math.max(...topAreas.map(([,v])=>v));

  const odsCount = {};
  projects.forEach(p => p.ods.forEach(id => { odsCount[id] = (odsCount[id]||0)+1; }));
  const topOds = Object.entries(odsCount).sort((a,b)=>b[1]-a[1]).slice(0,6);

  return (
    <div style={{flex:1,overflow:'auto',background:'#f4f8ff',width:'100%'}}>
      {/* Header */}
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'22px 32px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,color:'#0d1f3c',letterSpacing:'-0.4px'}}>Painel do Gestor</h1>
            <p style={{margin:'5px 0 0',fontSize:13,color:'#6b7fa3'}}>Visão geral do ecossistema de inovação de Recife</p>
          </div>
          <div style={{display:'flex',gap:6}}>
            {['Semana','Mês','Ano'].map((t,i) => (
              <button key={t} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${i===1?'#0060e0':'rgba(0,60,180,0.15)'}`,background:i===1?'rgba(0,96,224,0.1)':'#fff',color:i===1?'#0060e0':'#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:i===1?600:400}}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:'24px 32px',display:'flex',flexDirection:'column',gap:20}}>
        {/* KPI Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {[
            {label:'Pesquisas Publicadas', value:'6',    delta:'+2 este mês', color:'#0060e0', icon:'🔬'},
            {label:'Pesquisadores Ativos', value:'6',    delta:'+1 este mês', color:'#7c3aed', icon:'👩‍🔬'},
            {label:'Conexões Realizadas',  value:'27',   delta:'+5 este mês', color:'#059669', icon:'🔗'},
            {label:'Aprovações Pendentes', value:'3',    delta:'Requer ação', color:'#d97706', icon:'⏳'},
          ].map(k => (
            <div key={k.label} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'18px',boxShadow:'0 1px 4px rgba(0,60,180,0.05)',cursor:k.label.includes('Aprovação')?'pointer':'default'}}
              onClick={k.label.includes('Aprovação')?onApprovals:undefined}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:20}}>{k.icon}</span>
                <span style={{fontSize:10,fontWeight:600,color:k.color,background:k.color+'18',borderRadius:10,padding:'2px 8px'}}>{k.delta}</span>
              </div>
              <div style={{fontSize:26,fontWeight:800,color:k.color,lineHeight:1}}>{k.value}</div>
              <div style={{fontSize:12,color:'#6b7fa3',marginTop:4}}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          {/* Pesquisas por Área */}
          <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
            <h3 style={{margin:'0 0 16px',fontSize:14,fontWeight:700,color:'#0d1f3c'}}>Pesquisas por Área</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {topAreas.map(([area,count]) => (
                <div key={area} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:12,color:'#4a5a7a',width:130,flexShrink:0}}>{area}</span>
                  <div style={{flex:1,height:8,background:'rgba(0,60,180,0.07)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{width:`${(count/maxArea)*100}%`,height:'100%',background:'linear-gradient(90deg,#3b8eff,#0040cc)',borderRadius:4,transition:'width 0.5s'}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:'#0060e0',width:16,textAlign:'right'}}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ODS Coverage */}
          <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
            <h3 style={{margin:'0 0 16px',fontSize:14,fontWeight:700,color:'#0d1f3c'}}>Cobertura dos ODS</h3>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
              {topOds.map(([id,count]) => {
                const o = window.HubData.ODS_LIST.find(x=>x.id===parseInt(id));
                return o ? (
                  <div key={id} style={{display:'flex',alignItems:'center',gap:5,background:o.color+'12',border:`1px solid ${o.color}44`,borderRadius:6,padding:'5px 10px'}}>
                    <span style={{width:16,height:16,borderRadius:2,background:o.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800,color:'#fff',flexShrink:0}}>{id}</span>
                    <span style={{fontSize:11,color:o.color,fontWeight:600,maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.label}</span>
                    <span style={{fontSize:10,fontWeight:700,color:o.color,background:o.color+'22',borderRadius:10,padding:'0 5px'}}>{count}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div style={{background:'rgba(0,96,224,0.05)',border:'1px solid rgba(0,96,224,0.12)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#4a5a7a'}}>
              📊 {Object.keys(odsCount).length} dos 17 ODS estão cobertos pelas pesquisas atuais
            </div>
          </div>
        </div>

        {/* Pesquisas em destaque */}
        <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:'#0d1f3c'}}>Pesquisas em Destaque</h3>
            <span style={{fontSize:12,color:'#0060e0',cursor:'pointer',fontWeight:600}}>Ver todas →</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {projects.slice(0,3).map(p => (
              <div key={p.id} onClick={() => onDetail(p)}
                style={{background:'#f7faff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:8,padding:'14px',cursor:'pointer',transition:'all 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#0060e0'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(0,60,180,0.1)'}>
                <div style={{display:'flex',gap:5,marginBottom:7}}>
                  <span style={{fontSize:9,fontWeight:700,color:'#0060e0',background:'rgba(0,96,224,0.1)',borderRadius:3,padding:'2px 6px',textTransform:'uppercase'}}>{p.area}</span>
                  <span style={{fontSize:9,color:'#6b7fa3',background:'rgba(0,0,0,0.04)',borderRadius:3,padding:'2px 6px'}}>{p.institution}</span>
                </div>
                <p style={{margin:0,fontSize:12,fontWeight:600,color:'#0d1f3c',lineHeight:1.4,marginBottom:8,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.title}</p>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:11,color:'#6b7fa3'}}>👁 {p.views}</span>
                  <span style={{fontSize:11,color:'#059669',fontWeight:600}}>🔗 {p.connections}</span>
                  <div style={{marginLeft:'auto',display:'flex',gap:3}}>
                    {p.ods.slice(0,2).map(id => { const o=window.HubData.ODS_LIST.find(x=>x.id===id); return o?<span key={id} style={{width:14,height:14,borderRadius:2,background:o.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,fontWeight:800,color:'#fff'}}>{id}</span>:null; })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'20px',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
          <h3 style={{margin:'0 0 14px',fontSize:14,fontWeight:700,color:'#0d1f3c'}}>Atividade Recente</h3>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {[
              {icon:'🔗', text:'Defesa Civil do Recife iniciou contato com CESAR School sobre mapeamento de alagamentos', time:'Hoje, 14:00', color:'#059669'},
              {icon:'✅', text:'Pesquisa sobre gamificação no ensino aprovada pela UFPE e publicada na plataforma', time:'Ontem, 11:20', color:'#0060e0'},
              {icon:'📋', text:'Nova pesquisa "Predição de Evasão Escolar" enviada para aprovação pela Dra. Ana Lima', time:'25/04, 09:45', color:'#d97706'},
              {icon:'🔗', text:'Secretaria de Saúde iniciou contato com Dra. Ana Lima sobre detecção de dengue', time:'24/04, 09:14', color:'#059669'},
            ].map((a,i) => (
              <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:i<3?'1px solid rgba(0,60,180,0.07)':'none',alignItems:'flex-start'}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:a.color+'15',border:`1px solid ${a.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>{a.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:'#2d3f6b',lineHeight:1.5}}>{a.text}</div>
                  <div style={{fontSize:10,color:'#6b7fa3',marginTop:2}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Approvals ── */
function Approvals() {
  const pending = [
    { id:99, title:'Predição de Evasão Escolar com NLP em Dados Socioeconômicos', researcher:'Dra. Ana Lima', institution:'UFPE', area:'Educação', type:'Tese', submitted:'25/04/2025', ods:[4,1,10] },
    { id:101, title:'Impacto das Chuvas Extremas na Infraestrutura Viária de Recife', researcher:'Dr. Marcos Alves', institution:'UNICAP', area:'Urbanismo', type:'Aplicada', submitted:'23/04/2025', ods:[11,13] },
    { id:102, title:'Plataforma de Telemedicina para Comunidades do Recife', researcher:'Profa. Juliana Farias', institution:'CESAR School', area:'Saúde', type:'Aplicada', submitted:'20/04/2025', ods:[3,10] },
  ];
  const [items, setItems] = React.useState(pending.map(p=>({...p,status:'pending',feedback:''})));
  const [expanded, setExpanded] = React.useState(null);

  const decide = (id, status) => setItems(is => is.map(i => i.id===id ? {...i,status} : i));
  const active = items.filter(i=>i.status==='pending');
  const done = items.filter(i=>i.status!=='pending');

  return (
    <div style={{flex:1,overflow:'auto',background:'#f4f8ff',width:'100%'}}>
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'22px 32px'}}>
        <h1 style={{margin:0,fontSize:22,fontWeight:800,color:'#0d1f3c'}}>Aprovações Institucionais</h1>
        <p style={{margin:'5px 0 0',fontSize:13,color:'#6b7fa3'}}>{active.length} pesquisa{active.length!==1?'s':''} aguardando revisão</p>
      </div>

      <div style={{padding:'24px 32px',display:'flex',flexDirection:'column',gap:12}}>
        {/* Pending */}
        {active.length > 0 && (
          <>
            <div style={{fontSize:11,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Aguardando Revisão</div>
            {active.map(item => (
              <div key={item.id} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
                <div style={{padding:'18px 20px',display:'flex',alignItems:'flex-start',gap:16}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',gap:6,marginBottom:7}}>
                      <span style={{fontSize:10,fontWeight:700,color:'#0060e0',background:'rgba(0,96,224,0.1)',borderRadius:3,padding:'2px 7px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{item.area}</span>
                      <span style={{fontSize:10,color:'#6b7fa3',background:'rgba(0,0,0,0.04)',borderRadius:3,padding:'2px 7px'}}>{item.type}</span>
                      <span style={{fontSize:10,color:'#6b7fa3',background:'rgba(0,0,0,0.04)',borderRadius:3,padding:'2px 7px'}}>{item.institution}</span>
                    </div>
                    <h3 style={{margin:'0 0 6px',fontSize:14,fontWeight:700,color:'#0d1f3c',lineHeight:1.4}}>{item.title}</h3>
                    <div style={{fontSize:12,color:'#6b7fa3'}}>
                      {item.researcher} · Submetido em {item.submitted}
                    </div>
                    <div style={{display:'flex',gap:5,marginTop:8}}>
                      {item.ods.map(id => { const o=window.HubData.ODS_LIST.find(x=>x.id===id); return o?<span key={id} style={{display:'inline-flex',alignItems:'center',gap:3,background:o.color+'15',border:`1px solid ${o.color}44`,borderRadius:4,padding:'2px 7px',fontSize:10,fontWeight:600,color:o.color}}><span style={{width:10,height:10,borderRadius:1,background:o.color,fontSize:7,color:'#fff',fontWeight:800,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{id}</span>{o.label}</span>:null; })}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0,flexDirection:'column',alignItems:'flex-end'}}>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={() => decide(item.id,'rejected')}
                        style={{padding:'8px 16px',borderRadius:7,border:'1px solid rgba(220,38,38,0.3)',background:'rgba(220,38,38,0.06)',color:'#dc2626',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                        ✕ Reprovar
                      </button>
                      <button onClick={() => decide(item.id,'approved')}
                        style={{padding:'8px 16px',borderRadius:7,border:'none',background:'linear-gradient(135deg,#3b8eff,#0040cc)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                        ✓ Aprovar
                      </button>
                    </div>
                    <button onClick={() => setExpanded(expanded===item.id ? null : item.id)}
                      style={{background:'transparent',border:'none',color:'#0060e0',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
                      {expanded===item.id ? '▲ Ocultar feedback' : '▼ Adicionar feedback'}
                    </button>
                  </div>
                </div>
                {expanded===item.id && (
                  <div style={{padding:'0 20px 16px',borderTop:'1px solid rgba(0,60,180,0.07)'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,marginTop:14}}>Feedback para o pesquisador</div>
                    <textarea
                      value={item.feedback}
                      onChange={e => setItems(is => is.map(i => i.id===item.id ? {...i,feedback:e.target.value} : i))}
                      placeholder="Descreva os ajustes necessários ou observações para o pesquisador..."
                      style={{width:'100%',background:'#f7faff',border:'1px solid rgba(0,60,180,0.15)',borderRadius:8,padding:'10px 12px',color:'#0d1f3c',fontSize:13,outline:'none',fontFamily:'inherit',resize:'vertical',minHeight:80,boxSizing:'border-box'}}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Concluded */}
        {done.length > 0 && (
          <>
            <div style={{fontSize:11,fontWeight:700,color:'#6b7fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:8,marginBottom:2}}>Concluídas</div>
            {done.map(item => (
              <div key={item.id} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.08)',borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',gap:14,opacity:0.8}}>
                <div style={{flex:1}}>
                  <h3 style={{margin:0,fontSize:13,fontWeight:600,color:'#0d1f3c'}}>{item.title}</h3>
                  <div style={{fontSize:11,color:'#6b7fa3',marginTop:3}}>{item.researcher} · {item.institution}</div>
                </div>
                {item.status==='approved'
                  ? <span style={{fontSize:11,fontWeight:700,color:'#059669',background:'rgba(5,150,105,0.1)',border:'1px solid rgba(5,150,105,0.25)',borderRadius:5,padding:'3px 10px'}}>✓ Aprovada</span>
                  : <span style={{fontSize:11,fontWeight:700,color:'#dc2626',background:'rgba(220,38,38,0.07)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:5,padding:'3px 10px'}}>✕ Reprovada</span>
                }
              </div>
            ))}
          </>
        )}

        {active.length === 0 && done.length === items.length && (
          <div style={{textAlign:'center',padding:'48px',color:'#6b7fa3'}}>
            <div style={{fontSize:36,marginBottom:10}}>✅</div>
            <div style={{fontSize:16,fontWeight:600,color:'#0d1f3c'}}>Tudo em dia!</div>
            <div style={{fontSize:13,marginTop:5}}>Nenhuma pesquisa pendente de aprovação.</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Connections (Org view) ── */
function Connections() {
  const conns = [
    { id:1, org:'Secretaria Municipal de Saúde', orgAvatar:'SS', project: window.HubData.PROJECTS[0], status:'active', lastMessage:'Podemos agendar esta semana?', date:'Hoje' },
    { id:2, org:'Defesa Civil do Recife',         orgAvatar:'DC', project: window.HubData.PROJECTS[5], status:'active', lastMessage:'Integração com nosso sistema.', date:'Ontem' },
    { id:3, org:'Secretaria de Educação',          orgAvatar:'SE', project: window.HubData.PROJECTS[3], status:'pending', lastMessage:'Interesse na pesquisa de gamificação.', date:'23/04' },
    { id:4, org:'Porto Digital',                   orgAvatar:'PD', project: window.HubData.PROJECTS[1], status:'closed', lastMessage:'Encerramos o projeto piloto.', date:'15/04' },
  ];
  const statusMap = { active:['Em andamento','#059669'], pending:['Aguardando resp.','#d97706'], closed:['Encerrado','#6b7fa3'] };

  return (
    <div style={{flex:1,overflow:'auto',background:'#f4f8ff',width:'100%'}}>
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'22px 32px'}}>
        <h1 style={{margin:0,fontSize:22,fontWeight:800,color:'#0d1f3c'}}>Conexões &amp; Parcerias</h1>
        <p style={{margin:'5px 0 0',fontSize:13,color:'#6b7fa3'}}>Histórico de contatos entre organizações e pesquisadores</p>
      </div>

      {/* Summary */}
      <div style={{padding:'20px 32px 0'}}>
        <div style={{display:'flex',gap:12,marginBottom:20}}>
          {[['4','Total de conexões','#0060e0'],['2','Em andamento','#059669'],['1','Aguardando','#d97706'],['1','Encerradas','#6b7fa3']].map(([n,l,c])=>(
            <div key={l} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:10,padding:'14px 18px',flex:1,boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
              <div style={{fontSize:22,fontWeight:800,color:c}}>{n}</div>
              <div style={{fontSize:11,color:'#6b7fa3',marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:'flex',gap:4,marginBottom:14}}>
          {['Todas','Em andamento','Aguardando','Encerradas'].map((t,i)=>(
            <button key={t} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${i===0?'#0060e0':'rgba(0,60,180,0.15)'}`,background:i===0?'rgba(0,96,224,0.1)':'#fff',color:i===0?'#0060e0':'#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:i===0?600:400}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'0 32px 24px',display:'flex',flexDirection:'column',gap:10}}>
        {conns.map(conn => {
          const [statusLabel, statusColor] = statusMap[conn.status];
          return (
            <div key={conn.id} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'18px 20px',display:'flex',gap:14,alignItems:'flex-start',boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
              <div style={{width:42,height:42,borderRadius:'50%',background:'rgba(0,96,224,0.1)',border:'2px solid rgba(0,96,224,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#0060e0',flexShrink:0}}>{conn.orgAvatar}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <span style={{fontSize:14,fontWeight:700,color:'#0d1f3c'}}>{conn.org}</span>
                  <span style={{fontSize:10,fontWeight:700,color:statusColor,background:statusColor+'15',border:`1px solid ${statusColor}33`,borderRadius:4,padding:'2px 8px'}}>{statusLabel}</span>
                  <span style={{marginLeft:'auto',fontSize:11,color:'#6b7fa3'}}>{conn.date}</span>
                </div>
                <div style={{fontSize:12,color:'#4a5a7a',marginBottom:5,display:'flex',alignItems:'center',gap:5}}>
                  <span style={{color:'#0060e0',fontSize:11}}>📎</span>
                  <span style={{fontWeight:500}}>{conn.project.title}</span>
                </div>
                <div style={{fontSize:12,color:'#6b7fa3',fontStyle:'italic'}}>"{conn.lastMessage}"</div>
              </div>
              <div style={{display:'flex',gap:7,flexShrink:0}}>
                {conn.status !== 'closed' && (
                  <button style={{padding:'7px 14px',borderRadius:7,border:'none',background:'linear-gradient(135deg,#3b8eff,#0040cc)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                    💬 Abrir Chat
                  </button>
                )}
                <button style={{padding:'7px 14px',borderRadius:7,border:'1px solid rgba(0,60,180,0.15)',background:'#fff',color:'#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                  Ver Pesquisa
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { GovDashboard, Approvals, Connections });
