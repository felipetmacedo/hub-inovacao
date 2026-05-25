import { useConversations } from '../../hooks/useConversations';
import { useAuth } from '../../contexts/AuthContext';

export function Connections({ onChat }) {
  const { profile }           = useAuth();
  const { conversations, loading } = useConversations();

  const getOtherParty = (conv) => {
    if (!conv || !profile) return { name: '...', avatar: '?' };
    if (profile.id === conv.org_user_id) return conv.researcher;
    return conv.org_user;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000)   return 'Hoje';
    if (diff < 172800000)  return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff', width: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '22px 32px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0d1f3c' }}>Conexões &amp; Parcerias</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#6b7fa3' }}>
          {loading ? 'Carregando...' : 'Histórico de contatos entre organizações e pesquisadores'}
        </p>
      </div>

      <div style={{ padding: '20px 32px 0' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[
            [String(conversations.length), 'Total de conexões', '#0060e0'],
          ].map(([n, l, c]) => (
            <div key={l} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 10, padding: '14px 18px', flex: 1, boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{n}</div>
              <div style={{ fontSize: 11, color: '#6b7fa3', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7fa3', fontSize: 13 }}>⏳ Carregando...</div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7fa3' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔗</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0d1f3c' }}>Nenhuma conexão ainda</div>
            <div style={{ fontSize: 12, marginTop: 5 }}>As conexões aparecem quando organizações entram em contato com pesquisadores</div>
          </div>
        ) : conversations.map(conv => {
          const other = getOtherParty(conv);
          return (
            <div key={conv.id} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,96,224,0.1)', border: '2px solid rgba(0,96,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0060e0', flexShrink: 0 }}>{other?.avatar || '?'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>{other?.name || '...'}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 4, padding: '2px 8px' }}>Em andamento</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7fa3' }}>{formatDate(conv.created_at)}</span>
                </div>
                {conv.project && (
                  <div style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#0060e0', fontSize: 11 }}>📎</span>
                    <span style={{ fontWeight: 500 }}>{conv.project.title}</span>
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#6b7fa3' }}>{other?.institution || ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                {onChat && (
                  <button onClick={() => onChat(conv.id)}
                    style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg,#3b8eff,#0040cc)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    💬 Abrir Chat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
