import { useState } from 'react';
import { ODS_LIST } from '../../data';
import { useApprovals } from '../../hooks/useApprovals';

export function Approvals() {
  const { items, loading, approve, reject } = useApprovals();
  const [done, setDone] = useState([]);
  const [error, setError]       = useState('');

  const decide = async (item, status) => {
    setError('');
    try {
      if (status === 'approved') await approve(item.id);
      else                       await reject(item.id);
      setDone(prev => [...prev, { ...item, status }]);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff', width: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '22px 32px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0d1f3c' }}>Aprovações Institucionais</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: '#6b7fa3' }}>
          {loading ? 'Carregando...' : `${items.length} pesquisa${items.length !== 1 ? 's' : ''} aguardando revisão`}
        </p>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 13, fontWeight: 500 }}>
            ⚠ {error}
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7fa3', fontSize: 13 }}>⏳ Carregando...</div>
        ) : (
          <>
            {items.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Aguardando Revisão</div>
                {items.map(item => (
                  <div key={item.id} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
                    <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 7 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#0060e0', background: 'rgba(0,96,224,0.1)', borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.area}</span>
                          <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.04)', borderRadius: 3, padding: '2px 7px' }}>{item.type}</span>
                          <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.04)', borderRadius: 3, padding: '2px 7px' }}>{item.institution}</span>
                        </div>
                        <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#0d1f3c', lineHeight: 1.4 }}>{item.title}</h3>
                        <div style={{ fontSize: 12, color: '#6b7fa3' }}>{item.researcher?.name} · Submetido em {formatDate(item.created_at)}</div>
                        {item.ods?.length > 0 && (
                          <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                            {item.ods.map(id => {
                              const o = ODS_LIST.find(x => x.id === id);
                              return o ? (
                                <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: o.color + '15', border: `1px solid ${o.color}44`, borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 600, color: o.color }}>
                                  <span style={{ width: 10, height: 10, borderRadius: 1, background: o.color, fontSize: 7, color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{id}</span>
                                  {o.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => decide(item, 'rejected')}
                          style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✕ Reprovar
                        </button>
                        <button onClick={() => decide(item, 'approved')}
                          style={{ padding: '8px 16px', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg,#3b8eff,#0040cc)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✓ Aprovar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {done.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8, marginBottom: 2 }}>Concluídas</div>
                {done.map(item => (
                  <div key={item.id} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.08)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, opacity: 0.8 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0d1f3c' }}>{item.title}</h3>
                      <div style={{ fontSize: 11, color: '#6b7fa3', marginTop: 3 }}>{item.researcher?.name} · {item.institution}</div>
                    </div>
                    {item.status === 'approved'
                      ? <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 5, padding: '3px 10px' }}>✓ Aprovada</span>
                      : <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 5, padding: '3px 10px' }}>✕ Reprovada</span>
                    }
                  </div>
                ))}
              </>
            )}

            {items.length === 0 && done.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7fa3' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#0d1f3c' }}>Tudo em dia!</div>
                <div style={{ fontSize: 13, marginTop: 5 }}>Nenhuma pesquisa pendente de aprovação.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
