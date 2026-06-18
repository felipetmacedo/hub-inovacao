import { useState } from 'react';
import { useMobile } from '../../hooks/useMobile';
import { useConversations } from '../../hooks/useConversations';
import { OdsBadge } from '../shared/OdsBadge';
import { Avatar } from '../shared/Avatar';

export function ResearchDetail({ project, onBack, onContact }) {
  const mobile = useMobile();
  const { startConversation } = useConversations();
  const [tab, setTab]           = useState('simplified');
  const [contacting, setContacting] = useState(false);
  const [contactError, setContactError] = useState('');

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: mobile ? '12px 16px' : '14px 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(0,60,180,0.2)', borderRadius: 6, padding: '5px 10px', color: '#6b7fa3', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', flexShrink: 0 }}>← Voltar</button>
        <span style={{ fontSize: 11, color: '#0d1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</span>
      </div>

      <div style={{ padding: mobile ? '16px' : '28px 32px', maxWidth: mobile ? '100%' : 880, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0060e0', background: 'rgba(0,96,224,0.1)', borderRadius: 4, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{project.area}</span>
            <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '2px 8px' }}>{project.type}</span>
            <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '2px 8px' }}>{project.institution} · {project.year}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: mobile ? 18 : 24, fontWeight: 800, color: '#0d1f3c', lineHeight: 1.3, letterSpacing: '-0.3px' }}>{project.title}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 260px', gap: mobile ? 14 : 24 }}>
          <div>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,60,180,0.1)', marginBottom: 14 }}>
              {[['simplified', '✨ Simplificado'], ['abstract', '📄 Técnico']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '8px 14px', border: 'none', borderBottom: tab === t ? '2px solid #0060e0' : '2px solid transparent', background: 'transparent', color: tab === t ? '#0060e0' : '#6b7fa3', fontSize: 12, fontWeight: tab === t ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1 }}>
                  {l}
                </button>
              ))}
            </div>
            {tab === 'simplified' && (
              <div style={{ background: 'rgba(0,96,224,0.04)', border: '1px solid rgba(0,96,224,0.15)', borderRadius: 10, padding: '14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>✨</span>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#0060e0', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gerado por IA · Linguagem Acessível</div>
                  <p style={{ margin: 0, fontSize: mobile ? 13 : 14, color: '#2d3f6b', lineHeight: 1.7 }}>{project.simplified}</p>
                </div>
              </div>
            )}
            {tab === 'abstract' && (
              <p style={{ fontSize: mobile ? 13 : 14, color: '#4a5a7a', lineHeight: 1.8, margin: 0 }}>{project.abstract}</p>
            )}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Palavras-chave</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {project.keywords.map(k => (
                  <span key={k} style={{ fontSize: 11, color: '#4a5a7a', background: 'rgba(0,60,180,0.05)', border: '1px solid rgba(0,60,180,0.12)', borderRadius: 4, padding: '3px 8px' }}>#{k}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>ODS Relacionados</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {project.ods.map(id => <OdsBadge key={id} id={id} />)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '16px', boxShadow: '0 2px 12px rgba(0,60,180,0.06)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Pesquisador(a)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Avatar initials={project.researcher.avatar} size={40} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1f3c' }}>{project.researcher.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7fa3' }}>{project.researcher.institution}</div>
                </div>
              </div>
              <button
                onClick={async () => {
                  setContacting(true);
                  setContactError('');
                  try {
                    const conv = await startConversation(project);
                    onContact(conv.id);
                  } catch (err) {
                    console.error('Erro ao iniciar contato:', err);
                    setContactError('Não foi possível iniciar conversa. Tente novamente.');
                  } finally {
                    setContacting(false);
                  }
                }}
                disabled={contacting}
                style={{ width: '100%', background: 'linear-gradient(135deg,#3b8eff,#0040cc)', border: 'none', borderRadius: 8, padding: '11px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: contacting ? 'default' : 'pointer', fontFamily: 'inherit', opacity: contacting ? 0.7 : 1 }}>
                {contacting ? 'Iniciando...' : '💬 Iniciar Contato'}
              </button>
              {contactError && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#dc2626', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, padding: '7px 10px' }}>
                  ⚠ {contactError}
                </div>
              )}
            </div>
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '14px', display: 'flex', gap: 14, boxShadow: '0 1px 6px rgba(0,60,180,0.04)' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0060e0' }}>{project.views}</div>
                <div style={{ fontSize: 10, color: '#6b7fa3' }}>Visualizações</div>
              </div>
              <div style={{ width: 1, background: 'rgba(0,60,180,0.08)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{project.connections_count || 0}</div>
                <div style={{ fontSize: 10, color: '#6b7fa3' }}>Conexões</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
