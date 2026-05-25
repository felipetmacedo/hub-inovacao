// Auth.jsx — Login e Cadastro (tema claro · Recife)
function AuthScreen({ onLogin }) {
  const [mode, setMode] = React.useState('login');
  const [role, setRole] = React.useState('researcher');
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ email: '', password: '', name: '', institution: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Preencha todos os campos.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const names = { researcher:'Dra. Ana Lima', gov:'João Cardoso', org:'Secretaria de Saúde' };
      const institutions = { researcher:'UFPE', gov:'Prefeitura do Recife', org:'Secretaria Municipal' };
      const avatars = { researcher:'AL', gov:'JC', org:'SS' };
      onLogin({ name: names[role], role, institution: institutions[role], avatar: avatars[role] });
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ name: form.name || 'Usuário', role, institution: form.institution || 'UFPE', avatar: (form.name || 'U').slice(0,2).toUpperCase() }); }, 1000);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={authStyles.root}>
      {/* Background gradient Recife */}
      <div style={authStyles.bg}>
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.06}} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0060e0" strokeWidth="0.8"/></pattern></defs>
          <rect width="800" height="600" fill="url(#grid)"/>
        </svg>
        <div style={{position:'absolute',top:'-20%',right:'-10%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle, rgba(0,96,224,0.12) 0%, transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'-15%',left:'-8%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle, rgba(59,142,255,0.1) 0%, transparent 70%)'}}/>
      </div>

      {/* Panel */}
      <div style={authStyles.panel}>
        {/* Logo Recife */}
        <div style={authStyles.logo}>
          <img src="logo_recife.jpg" alt="Prefeitura do Recife" style={{width:48,height:48,borderRadius:10,objectFit:'cover'}}/>
          <div>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:'-0.3px',color:'#0d1f3c'}}>Hub de Inovação</div>
            <div style={{fontSize:11,color:'#6b7fa3',marginTop:1}}>Prefeitura do Recife · Pesquisa &amp; Desenvolvimento</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={authStyles.tabs}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
              style={{...authStyles.tab, ...(mode===m ? authStyles.tabActive : {})}}>
              {m === 'login' ? 'Entrar' : 'Cadastrar-se'}
            </button>
          ))}
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} style={authStyles.form}>
            <div style={authStyles.field}>
              <label style={authStyles.label}>Perfil de acesso</label>
              <div style={{display:'flex',gap:6}}>
                {[['researcher','🔬','Pesquisador'],['gov','🏛️','Gestor Público'],['org','🏢','Organização']].map(([r,icon,label])=>(
                  <button key={r} type="button" onClick={()=>setRole(r)}
                    style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 6px',background:role===r?'#eef4ff':'#f7faff',border:`1px solid ${role===r?'#0060e0':'rgba(0,60,180,0.12)'}`,borderRadius:7,cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s'}}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <span style={{fontSize:10,fontWeight:600,color:role===r?'#0060e0':'#6b7fa3'}}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={authStyles.field}>
              <label style={authStyles.label}>E-mail</label>
              <input style={authStyles.input} type="email" placeholder="seu@email.com" value={form.email} onChange={e => set('email', e.target.value)}/>
            </div>
            <div style={authStyles.field}>
              <label style={authStyles.label}>Senha</label>
              <input style={authStyles.input} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)}/>
            </div>
            {error && <div style={authStyles.error}>{error}</div>}
            <button type="submit" style={{...authStyles.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </button>
            <div style={authStyles.hint}>Demo: qualquer e-mail + senha</div>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={authStyles.form}>
            {step === 1 && <>
              <div style={authStyles.fieldRow}>
                {['researcher','org','gov'].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={{...authStyles.roleBtn, ...(role===r ? authStyles.roleBtnActive : {}), flex: r==='gov'?'0 0 calc(33% - 5px)':1}}>
                    <span style={{fontSize:22}}>{r==='researcher' ? '🔬' : r==='org' ? '🏢' : '🏛️'}</span>
                    <span style={{fontWeight:700,fontSize:12,color:'#0d1f3c'}}>{r==='researcher' ? 'Pesquisador' : r==='org' ? 'Organização' : 'Gestor Público'}</span>
                    <span style={{fontSize:10,color:'#6b7fa3'}}>{r==='researcher' ? 'Univ. / Instituto' : r==='org' ? 'Empresa' : 'Gov. / Prefeitura'}</span>
                  </button>
                ))}
              </div>
              <div style={authStyles.field}>
                <label style={authStyles.label}>Nome completo</label>
                <input style={authStyles.input} placeholder="Dr. Nome Sobrenome" value={form.name} onChange={e => set('name', e.target.value)}/>
              </div>
              <div style={authStyles.field}>
                <label style={authStyles.label}>E-mail institucional</label>
                <input style={authStyles.input} type="email" placeholder="nome@ufpe.br" value={form.email} onChange={e => set('email', e.target.value)}/>
              </div>
            </>}
            {step === 2 && <>
              <div style={authStyles.field}>
                <label style={authStyles.label}>{role==='researcher' ? 'Instituição de ensino' : 'Nome da organização'}</label>
                <input style={authStyles.input} placeholder={role==='researcher' ? 'UFPE, UNICAP...' : 'Secretaria, Empresa...'} value={form.institution} onChange={e => set('institution', e.target.value)}/>
              </div>
              <div style={authStyles.field}>
                <label style={authStyles.label}>Senha</label>
                <input style={authStyles.input} type="password" placeholder="Mínimo 8 caracteres"/>
              </div>
              <div style={authStyles.field}>
                <label style={authStyles.label}>Confirmar senha</label>
                <input style={authStyles.input} type="password" placeholder="Repita a senha"/>
              </div>
            </>}
            {error && <div style={authStyles.error}>{error}</div>}
            <button type="submit" style={{...authStyles.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Criando conta...' : step === 1 ? 'Continuar →' : 'Criar conta'}
            </button>
            {step === 2 && <button type="button" onClick={() => setStep(1)} style={authStyles.back}>← Voltar</button>}
          </form>
        )}
      </div>
      <div style={authStyles.footer}>Prefeitura do Recife · UFPE · UNICAP · CESAR School</div>
    </div>
  );
}

const authStyles = {
  root: { flex:1, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#eef4ff 0%,#f7faff 60%,#e8f0fe 100%)', position:'relative', overflow:'hidden', padding:'24px 16px', fontFamily:'inherit' },
  bg: { position:'absolute', inset:0, pointerEvents:'none' },
  panel: { position:'relative', zIndex:1, background:'#ffffff', border:'1px solid rgba(0,60,180,0.1)', borderRadius:18, padding:'32px 36px', width:'100%', maxWidth:420, boxShadow:'0 8px 40px rgba(0,60,180,0.1)' },
  logo: { display:'flex', alignItems:'center', gap:12, marginBottom:28 },
  tabs: { display:'flex', gap:4, background:'#f0f5ff', borderRadius:8, padding:4, marginBottom:24 },
  tab: { flex:1, padding:'8px 0', border:'none', borderRadius:6, background:'transparent', color:'#6b7fa3', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' },
  tabActive: { background:'#ffffff', color:'#0060e0', boxShadow:'0 1px 6px rgba(0,60,180,0.15)' },
  form: { display:'flex', flexDirection:'column', gap:16 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  fieldRow: { display:'flex', gap:8 },
  label: { fontSize:12, fontWeight:700, color:'#6b7fa3', textTransform:'uppercase', letterSpacing:'0.06em' },
  input: { background:'#f7faff', border:'1px solid rgba(0,60,180,0.15)', borderRadius:8, padding:'11px 14px', color:'#0d1f3c', fontSize:14, outline:'none', fontFamily:'inherit' },
  btn: { background:'linear-gradient(135deg,#3b8eff,#0040cc)', border:'none', borderRadius:8, padding:'13px', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'0.02em', fontFamily:'inherit' },
  back: { background:'transparent', border:'none', color:'#6b7fa3', fontSize:13, cursor:'pointer', textAlign:'center', fontFamily:'inherit' },
  roleBtn: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'12px 8px', background:'#f7faff', border:'1px solid rgba(0,60,180,0.1)', borderRadius:8, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' },
  roleBtnActive: { background:'#eef4ff', border:'1px solid rgba(0,96,224,0.4)', boxShadow:'0 0 0 3px rgba(0,96,224,0.08)' },
  error: { fontSize:13, color:'#dc2626', background:'rgba(220,38,38,0.07)', borderRadius:6, padding:'8px 12px' },
  hint: { fontSize:11, color:'#6b7fa3', textAlign:'center' },
  footer: { position:'relative', zIndex:1, marginTop:24, fontSize:11, color:'rgba(107,127,163,0.7)', textAlign:'center', letterSpacing:'0.05em' },
};

Object.assign(window, { AuthScreen });
