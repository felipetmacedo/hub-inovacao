export function MobileNav({ nav, setNav, user }) {
  const items = user.role === 'gov'
    ? [
        { id: 'govdashboard', icon: '◈', label: 'Painel' },
        { id: 'dashboard',    icon: '◎', label: 'Explorar' },
        { id: 'approvals',    icon: '✓', label: 'Aprovações' },
        { id: 'connections',  icon: '🔗', label: 'Conexões' },
        { id: 'chat',         icon: '✉', label: 'Chat' },
      ]
    : user.role === 'org'
    ? [
        { id: 'govdashboard', icon: '◈', label: 'Painel' },
        { id: 'dashboard',    icon: '◎', label: 'Explorar' },
        { id: 'approvals',    icon: '✓', label: 'Aprovações' },
        { id: 'connections',  icon: '🔗', label: 'Conexões' },
        { id: 'chat',         icon: '✉', label: 'Chat' },
      ]
    : user.role === 'investidor'
    ? [
        { id: 'dashboard',   icon: '◎', label: 'Explorar' },
        { id: 'connections', icon: '🔗', label: 'Conexões' },
        { id: 'chat',        icon: '✉', label: 'Chat' },
      ]
    : [
        { id: 'dashboard',   icon: '◎', label: 'Explorar' },
        { id: 'myresearch',  icon: '⊞', label: 'Pesquisas' },
        { id: 'connections', icon: '🔗', label: 'Conexões' },
        { id: 'chat',        icon: '✉', label: 'Chat' },
        { id: 'new',         icon: '+', label: 'Novo', accent: true },
      ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#ffffff', borderTop: '1px solid rgba(0,60,180,0.12)', display: 'flex', height: 58, boxShadow: '0 -2px 16px rgba(0,60,180,0.08)' }}>
      {items.map(item => (
        <button key={item.id} onClick={() => setNav(item.id)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0', position: 'relative', color: nav === item.id ? '#0060e0' : item.accent ? '#059669' : '#6b7fa3' }}>
          <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontWeight: nav === item.id ? 700 : 500, letterSpacing: '0.02em' }}>{item.label}</span>
          {item.badge && <span style={{ position: 'absolute', top: 6, right: 'calc(50% - 14px)', background: '#0060e0', color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: 10, padding: '1px 4px', minWidth: 13, textAlign: 'center' }}>{item.badge}</span>}
          {nav === item.id && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 2, background: '#0060e0', borderRadius: 1 }} />}
        </button>
      ))}
    </div>
  );
}
