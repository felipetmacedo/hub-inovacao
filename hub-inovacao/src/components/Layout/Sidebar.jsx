import { Avatar } from '../shared/Avatar';

export function Sidebar({ nav, setNav, user, onLogout }) {
  const researcherItems = [
    { id: 'dashboard',  icon: '◎', label: 'Explorar' },
    { id: 'myresearch', icon: '⊞', label: 'Minhas Pesquisas' },
    { id: 'chat',       icon: '✉', label: 'Mensagens', badge: 1 },
    { id: 'new',        icon: '+', label: 'Nova Pesquisa', accent: true },
  ];
  const govItems = [
    { id: 'dashboard',    icon: '◎', label: 'Explorar' },
    { id: 'govdashboard', icon: '◈', label: 'Painel do Gestor' },
    { id: 'approvals',    icon: '✓', label: 'Aprovações', badge: 3 },
    { id: 'connections',  icon: '🔗', label: 'Conexões' },
    { id: 'chat',         icon: '✉', label: 'Mensagens', badge: 1 },
  ];
  const items = (user.role === 'gov' || user.role === 'org') ? govItems : researcherItems;

  return (
    <aside style={s.root}>
      <div style={s.logo}>
        <img src="/logo_recife.jpg" alt="Recife" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0d1f3c', letterSpacing: '-0.3px' }}>Hub Inovação</div>
          <div style={{ fontSize: 10, color: '#6b7fa3' }}>Recife · PE</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 0' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setNav(item.id)}
            style={{ ...s.navItem, ...(nav === item.id ? s.navActive : {}), ...(item.accent ? s.navAccent : {}) }}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {item.badge && <span style={s.badge}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div style={s.userCard}>
        <Avatar initials={user.avatar} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0d1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
          <div style={{ fontSize: 10, color: '#6b7fa3' }}>{user.institution}</div>
        </div>
        <button onClick={onLogout} title="Sair" style={{ background: 'none', border: 'none', color: '#6b7fa3', cursor: 'pointer', fontSize: 14, padding: '4px' }}>⏻</button>
      </div>
    </aside>
  );
}

const s = {
  root: { width: 220, flexShrink: 0, background: '#ffffff', borderRight: '1px solid rgba(0,60,180,0.1)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, boxShadow: '2px 0 12px rgba(0,60,180,0.06)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '18px 16px 14px', borderBottom: '1px solid rgba(0,60,180,0.08)' },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', color: '#6b7fa3', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', borderRadius: 0, fontFamily: 'inherit', borderLeft: '3px solid transparent' },
  navActive: { background: 'rgba(0,96,224,0.07)', color: '#0060e0', borderLeft: '3px solid #0060e0', fontWeight: 700 },
  navAccent: { color: '#059669', fontWeight: 700 },
  badge: { background: '#0060e0', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', minWidth: 16, textAlign: 'center' },
  userCard: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderTop: '1px solid rgba(0,60,180,0.08)', background: '#f7faff' },
};
