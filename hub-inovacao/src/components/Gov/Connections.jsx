import { PROJECTS } from '../../data';

const CONNS = [
  { id: 1, org: 'Secretaria Municipal de Saúde', orgAvatar: 'SS', projectId: 0, status: 'active',  lastMessage: 'Podemos agendar esta semana?',        date: 'Hoje' },
  { id: 2, org: 'Defesa Civil do Recife',         orgAvatar: 'DC', projectId: 5, status: 'active',  lastMessage: 'Integração com nosso sistema.',       date: 'Ontem' },
  { id: 3, org: 'Secretaria de Educação',          orgAvatar: 'SE', projectId: 3, status: 'pending', lastMessage: 'Interesse na pesquisa de gamificação.', date: '23/04' },
  { id: 4, org: 'Porto Digital',                   orgAvatar: 'PD', projectId: 1, status: 'closed',  lastMessage: 'Encerramos o projeto piloto.',         date: '15/04' },
];

const STATUS_MAP = {
  active:  ['Em andamento',   '#059669'],
  pending: ['Aguardando resp.','#d97706'],
  closed:  ['Encerrado',      '#6b7fa3'],
};

export function Connections() {
  const conns = CONNS.map(c => ({ ...c, project: PROJECTS[c.projectId] }));

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff', width: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '22px 32px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0d1f3c' }}>Conexões &amp; Parcerias</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#6b7fa3' }}>Histórico de contatos entre organizações e pesquisadores</p>
      </div>

      <div style={{ padding: '20px 32px 0' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[['4','Total de conexões','#0060e0'],['2','Em andamento','#059669'],['1','Aguardando','#d97706'],['1','Encerradas','#6b7fa3']].map(([n, l, c]) => (
            <div key={l} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 10, padding: '14px 18px', flex: 1, boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{n}</div>
              <div style={{ fontSize: 11, color: '#6b7fa3', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {['Todas', 'Em andamento', 'Aguardando', 'Encerradas'].map((t, i) => (
            <button key={t} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${i === 0 ? '#0060e0' : 'rgba(0,60,180,0.15)'}`, background: i === 0 ? 'rgba(0,96,224,0.1)' : '#fff', color: i === 0 ? '#0060e0' : '#6b7fa3', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: i === 0 ? 600 : 400 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {conns.map(conn => {
          const [statusLabel, statusColor] = STATUS_MAP[conn.status];
          return (
            <div key={conn.id} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,96,224,0.1)', border: '2px solid rgba(0,96,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0060e0', flexShrink: 0 }}>{conn.orgAvatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>{conn.org}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, background: statusColor + '15', border: `1px solid ${statusColor}33`, borderRadius: 4, padding: '2px 8px' }}>{statusLabel}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7fa3' }}>{conn.date}</span>
                </div>
                <div style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#0060e0', fontSize: 11 }}>📎</span>
                  <span style={{ fontWeight: 500 }}>{conn.project.title}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7fa3', fontStyle: 'italic' }}>&ldquo;{conn.lastMessage}&rdquo;</div>
              </div>
              <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                {conn.status !== 'closed' && (
                  <button style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg,#3b8eff,#0040cc)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    💬 Abrir Chat
                  </button>
                )}
                <button style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid rgba(0,60,180,0.15)', background: '#fff', color: '#6b7fa3', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
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
