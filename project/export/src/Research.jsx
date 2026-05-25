// Research.jsx — Nova Pesquisa (multi-step + IA) + Painel do Pesquisador (tema claro)

/* ── New Research Wizard ── */
function NewResearch({ onDone }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ title:'', area:'', type:'', institution:'UFPE', year:'2025', keywords:'', abstract:'', simplified:'', ods:[] });
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiText, setAiText] = React.useState('');
  const [aiDone, setAiDone] = React.useState(false);
  const [suggestedOds, setSuggestedOds] = React.useState([]);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const STEPS = ['Dados Básicos','Resumo Técnico','Simplificação IA','ODS & Revisão','Enviar'];

  const simulateAI = () => {
    setAiLoading(true); setAiText(''); setAiDone(false);
    const simplified = `Esta pesquisa busca ${form.title.toLowerCase() || 'estudar um tema relevante'} de forma prática e acessível. O trabalho foi desenvolvido em ${form.institution} e tem como foco principal trazer soluções reais para a comunidade de Recife, usando metodologias modernas e dados locais. Os resultados podem ser aplicados diretamente por gestores públicos e empresas parceiras na cidade.`;
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setAiText(simplified.slice(0, i));
      if (i >= simplified.length) {
        clearInterval(interval);
        setAiLoading(false); setAiDone(true); set('simplified', simplified);
        const map = { 'Saúde':[3,11], 'Tecnologia':[9,11], 'Educação':[4,10], 'Meio Ambiente':[13,15,11], 'Urbanismo':[11,1], 'Economia':[8,1], 'Segurança Pública':[16,11], 'Agro & Alimentação':[2,1] };
        setSuggestedOds(map[form.area] || [9, 11]);
      }
    }, 25);
  };

  const toggleOds = (id) => setForm(f => ({ ...f, ods: f.ods.includes(id) ? f.ods.filter(x=>x!==id) : [...f.ods, id] }));

  if (submitted) {
    return (
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#f4f8ff',flexDirection:'column',gap:24,padding:40}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(5,150,105,0.12)',border:'2px solid #059669',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>✓</div>
        <div style={{textAlign:'center'}}>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:'#0d1f3c'}}>Pesquisa enviada para aprovação!</h2>
          <p style={{color:'#6b7fa3',fontSize:14,marginTop:8}}>A instituição irá revisar e publicar em breve. Você receberá uma notificação.</p>
        </div>
        <button onClick={onDone} style={{background:'linear-gradient(135deg,#3b8eff,#0040cc)',border:'none',borderRadius:8,padding:'12px 28px',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Ver Minhas Pesquisas</button>
      </div>
    );
  }

  return (
    <div style={{flex:1,width:'100%',overflow:'auto',background:'#f4f8ff'}}>
      {/* Header */}
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'20px 32px'}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:800,color:'#0d1f3c'}}>Cadastrar Nova Pesquisa</h2>
        {/* Stepper */}
        <div style={{display:'flex',alignItems:'center',gap:0,marginTop:18}}>
          {STEPS.map((s,i) => (
            <React.Fragment key={s}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{width:28,height:28,borderRadius:'50%',background: step>i+1 ? '#059669' : step===i+1 ? '#0060e0' : '#eef4ff',border:`2px solid ${step>i+1?'#059669':step===i+1?'#0060e0':'rgba(0,60,180,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color: step>=i+1?'#fff':'#6b7fa3',transition:'all 0.3s'}}>
                  {step>i+1 ? '✓' : i+1}
                </div>
                <span style={{fontSize:10,color: step===i+1?'#0060e0':'#6b7fa3',whiteSpace:'nowrap',fontWeight: step===i+1?700:400}}>{s}</span>
              </div>
              {i<STEPS.length-1 && <div style={{flex:1,height:2,background: step>i+1?'#059669':'rgba(0,60,180,0.12)',margin:'0 4px',marginBottom:18,transition:'background 0.3s'}}/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{padding:'28px 32px'}}>
        {/* Step 1 */}
        {step===1 && (
          <div style={wizardStyles.card}>
            <h3 style={wizardStyles.stepTitle}>Dados Básicos do Projeto</h3>
            <div style={wizardStyles.field}>
              <label style={wizardStyles.label}>Título da pesquisa *</label>
              <input style={wizardStyles.input} placeholder="Ex: Detecção de dengue com machine learning..." value={form.title} onChange={e=>set('title',e.target.value)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={wizardStyles.field}>
                <label style={wizardStyles.label}>Área</label>
                <select style={wizardStyles.input} value={form.area} onChange={e=>set('area',e.target.value)}>
                  <option value="">Selecione...</option>
                  {window.HubData.AREAS.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={wizardStyles.field}>
                <label style={wizardStyles.label}>Tipo</label>
                <select style={wizardStyles.input} value={form.type} onChange={e=>set('type',e.target.value)}>
                  <option value="">Selecione...</option>
                  {window.HubData.TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={wizardStyles.field}>
                <label style={wizardStyles.label}>Instituição</label>
                <select style={wizardStyles.input} value={form.institution} onChange={e=>set('institution',e.target.value)}>
                  {window.HubData.INSTITUTIONS.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div style={wizardStyles.field}>
                <label style={wizardStyles.label}>Ano</label>
                <input style={wizardStyles.input} value={form.year} onChange={e=>set('year',e.target.value)}/>
              </div>
            </div>
            <div style={wizardStyles.field}>
              <label style={wizardStyles.label}>Palavras-chave (separadas por vírgula)</label>
              <input style={wizardStyles.input} placeholder="saúde pública, machine learning, recife..." value={form.keywords} onChange={e=>set('keywords',e.target.value)}/>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step===2 && (
          <div style={wizardStyles.card}>
            <h3 style={wizardStyles.stepTitle}>Resumo Técnico</h3>
            <div style={{background:'rgba(0,96,224,0.05)',border:'1px solid rgba(0,96,224,0.15)',borderRadius:8,padding:'12px 16px',marginBottom:4,fontSize:13,color:'#4a5a7a'}}>
              💡 Escreva o resumo como você faria num artigo. A IA vai criar uma versão mais acessível no próximo passo.
            </div>
            <div style={wizardStyles.field}>
              <label style={wizardStyles.label}>Resumo / Abstract *</label>
              <textarea style={{...wizardStyles.input,minHeight:180,resize:'vertical'}} placeholder="Descreva os objetivos, metodologia e resultados esperados..." value={form.abstract} onChange={e=>set('abstract',e.target.value)}/>
            </div>
          </div>
        )}

        {/* Step 3 — AI */}
        {step===3 && (
          <div style={wizardStyles.card}>
            <h3 style={wizardStyles.stepTitle}>✨ Simplificação por IA</h3>
            <p style={{fontSize:14,color:'#6b7fa3',marginTop:0,marginBottom:20}}>Geramos automaticamente uma versão em linguagem acessível. Você pode editar antes de publicar.</p>
            {!aiLoading && !aiDone && (
              <button onClick={simulateAI} style={{...wizardStyles.btn,display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
                <span>✨</span> Gerar versão simplificada com IA
              </button>
            )}
            {(aiLoading || aiDone) && (
              <div style={{background:'rgba(0,96,224,0.05)',border:'1px solid rgba(0,96,224,0.18)',borderRadius:10,padding:'20px',marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <span style={{fontSize:16}}>✨</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#0060e0',textTransform:'uppercase',letterSpacing:'0.06em'}}>Versão Simplificada {aiLoading && '•••'}</span>
                </div>
                <p style={{margin:0,fontSize:14,color:'#2d3f6b',lineHeight:1.7}}>{aiText}<span style={{display: aiLoading ? 'inline' : 'none',borderRight:'2px solid #0060e0',marginLeft:2,animation:'blink 0.8s infinite'}}>|</span></p>
              </div>
            )}
            {aiDone && (
              <div style={wizardStyles.field}>
                <label style={wizardStyles.label}>Editar versão simplificada</label>
                <textarea style={{...wizardStyles.input,minHeight:130,resize:'vertical'}} value={form.simplified} onChange={e=>set('simplified',e.target.value)}/>
              </div>
            )}
          </div>
        )}

        {/* Step 4 — ODS */}
        {step===4 && (
          <div style={wizardStyles.card}>
            <h3 style={wizardStyles.stepTitle}>ODS e Revisão Final</h3>
            {suggestedOds.length > 0 && (
              <div style={{background:'rgba(0,96,224,0.05)',border:'1px solid rgba(0,96,224,0.15)',borderRadius:8,padding:'12px 16px',marginBottom:4,fontSize:13,color:'#4a5a7a'}}>
                💡 A IA sugere os ODS {suggestedOds.join(' e ')} com base no conteúdo da sua pesquisa.
                <button onClick={() => setForm(f=>({...f,ods:suggestedOds}))} style={{marginLeft:8,background:'rgba(0,96,224,0.1)',border:'1px solid rgba(0,96,224,0.25)',borderRadius:4,padding:'2px 10px',color:'#0060e0',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Aplicar sugestão</button>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
              {window.HubData.ODS_LIST.map(o => (
                <button key={o.id} onClick={() => toggleOds(o.id)}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:6,border:`1px solid ${form.ods.includes(o.id)?o.color+'55':'rgba(0,60,180,0.12)'}`,background: form.ods.includes(o.id)?o.color+'12':'#ffffff',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s',textAlign:'left'}}>
                  <span style={{width:22,height:22,borderRadius:3,background:o.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0}}>{o.id}</span>
                  <span style={{fontSize:11,color: form.ods.includes(o.id)?'#0d1f3c':'#6b7fa3',lineHeight:1.3}}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step===5 && (
          <div style={wizardStyles.card}>
            <h3 style={wizardStyles.stepTitle}>Pré-visualização</h3>
            <div style={{background:'#f7faff',border:'1px solid rgba(0,60,180,0.12)',borderRadius:10,padding:'20px',marginBottom:20}}>
              <h4 style={{margin:'0 0 8px',fontSize:16,fontWeight:700,color:'#0d1f3c'}}>{form.title||'(sem título)'}</h4>
              <div style={{display:'flex',gap:6,marginBottom:12}}>
                {form.area && <span style={{fontSize:10,fontWeight:700,color:'#0060e0',background:'rgba(0,96,224,0.1)',borderRadius:4,padding:'2px 8px'}}>{form.area}</span>}
                {form.type && <span style={{fontSize:10,color:'#6b7fa3',background:'rgba(0,0,0,0.05)',borderRadius:4,padding:'2px 8px'}}>{form.type}</span>}
                {form.institution && <span style={{fontSize:10,color:'#6b7fa3',background:'rgba(0,0,0,0.05)',borderRadius:4,padding:'2px 8px'}}>{form.institution}</span>}
              </div>
              <p style={{margin:'0 0 12px',fontSize:13,color:'#4a5a7a',lineHeight:1.6}}>{form.simplified||form.abstract||'(sem resumo)'}</p>
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {form.ods.map(id => { const o=window.HubData.ODS_LIST.find(x=>x.id===id); return o ? <span key={id} style={{fontSize:10,color:o.color,background:o.color+'18',border:`1px solid ${o.color}44`,borderRadius:4,padding:'2px 8px',fontWeight:600}}>ODS {id}</span> : null; })}
              </div>
            </div>
            <div style={{background:'rgba(5,150,105,0.07)',border:'1px solid rgba(5,150,105,0.2)',borderRadius:8,padding:'12px 16px',fontSize:13,color:'#4a5a7a'}}>
              ✓ Ao enviar, a pesquisa será encaminhada para aprovação pela sua instituição antes de ser publicada.
            </div>
          </div>
        )}

        <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
          <button onClick={() => step>1 ? setStep(s=>s-1) : null} style={{...wizardStyles.btnSecondary,visibility: step===1?'hidden':'visible'}}>← Anterior</button>
          {step<5
            ? <button onClick={() => step===3 && !aiDone ? null : setStep(s=>s+1)} style={{...wizardStyles.btn,opacity: step===3 && !aiDone ? 0.4 : 1}}>Próximo →</button>
            : <button onClick={() => setSubmitted(true)} style={wizardStyles.btn}>🚀 Enviar para Aprovação</button>
          }
        </div>
      </div>
    </div>
  );
}

const wizardStyles = {
  card:{ background:'#ffffff', border:'1px solid rgba(0,60,180,0.1)', borderRadius:14, padding:'28px', marginBottom:20, display:'flex', flexDirection:'column', gap:18, boxShadow:'0 2px 12px rgba(0,60,180,0.06)' },
  stepTitle:{ margin:0, fontSize:18, fontWeight:800, color:'#0d1f3c' },
  field:{ display:'flex', flexDirection:'column', gap:6 },
  label:{ fontSize:11, fontWeight:700, color:'#6b7fa3', textTransform:'uppercase', letterSpacing:'0.06em' },
  input:{ background:'#f7faff', border:'1px solid rgba(0,60,180,0.15)', borderRadius:8, padding:'11px 14px', color:'#0d1f3c', fontSize:14, outline:'none', fontFamily:'inherit' },
  btn:{ background:'linear-gradient(135deg,#3b8eff,#0040cc)', border:'none', borderRadius:8, padding:'12px 24px', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' },
  btnSecondary:{ background:'#ffffff', border:'1px solid rgba(0,60,180,0.18)', borderRadius:8, padding:'12px 24px', color:'#6b7fa3', fontSize:14, cursor:'pointer', fontFamily:'inherit' },
};

/* ── My Research Panel ── */
function MyResearch({ onNew, onDetail }) {
  const [projects, setProjects] = React.useState([...window.HubData.MY_PROJECTS]);
  const hide = (id) => setProjects(ps => ps.map(p => p.id===id ? {...p,status:'hidden'} : p));

  return (
    <div style={{flex:1,width:'100%',overflow:'auto',background:'#f4f8ff'}}>
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'22px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:'#0d1f3c'}}>Minhas Pesquisas</h2>
          <p style={{margin:'4px 0 0',fontSize:13,color:'#6b7fa3'}}>{projects.filter(p=>p.status!=='hidden').length} projetos ativos</p>
        </div>
        <button onClick={onNew} style={{background:'linear-gradient(135deg,#3b8eff,#0040cc)',border:'none',borderRadius:8,padding:'10px 20px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>+ Nova Pesquisa</button>
      </div>

      <div style={{padding:'24px 32px',display:'flex',flexDirection:'column',gap:10}}>
        {projects.filter(p=>p.status!=='hidden').map(p => (
          <div key={p.id} style={{background:'#ffffff',border:'1px solid rgba(0,60,180,0.1)',borderRadius:12,padding:'18px 20px',display:'flex',alignItems:'center',gap:16,boxShadow:'0 1px 4px rgba(0,60,180,0.05)'}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <window.StatusBadge status={p.status}/>
                <span style={{fontSize:11,color:'#6b7fa3'}}>{p.area} · {p.type} · {p.year}</span>
              </div>
              <h3 style={{margin:0,fontSize:15,fontWeight:700,color:'#0d1f3c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title}</h3>
              {p.status==='published' && (
                <div style={{display:'flex',gap:16,marginTop:6}}>
                  <span style={{fontSize:12,color:'#6b7fa3'}}>👁 {p.views} views</span>
                  <span style={{fontSize:12,color:'#059669',fontWeight:600}}>🔗 {p.connections} conexões</span>
                </div>
              )}
            </div>
            <div style={{display:'flex',gap:8,flexShrink:0}}>
              {p.status==='published' && <button onClick={() => onDetail(p)} style={{padding:'7px 14px',borderRadius:6,border:'1px solid rgba(0,96,224,0.25)',background:'rgba(0,96,224,0.06)',color:'#0060e0',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Ver</button>}
              <button style={{padding:'7px 14px',borderRadius:6,border:'1px solid rgba(0,60,180,0.15)',background:'#ffffff',color:'#6b7fa3',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Editar</button>
              <button onClick={() => hide(p.id)} style={{padding:'7px 14px',borderRadius:6,border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.04)',color:'#dc2626',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Ocultar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { NewResearch, MyResearch });
