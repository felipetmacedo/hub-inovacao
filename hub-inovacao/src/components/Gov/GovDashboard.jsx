import { ODS_LIST } from '../../data';
import { useProjects } from '../../hooks/useProjects';
import { useApprovals } from '../../hooks/useApprovals';

export function GovDashboard({ onApprovals, onDetail }) {
  const { projects, loading } = useProjects();
  const { items: pending }    = useApprovals();

  const areaCount = {};
  projects.forEach(p => { areaCount[p.area] = (areaCount[p.area] || 0) + 1; });
  const topAreas = Object.entries(areaCount).sort((a, b) => b[1] - a[1]);
  const maxArea  = Math.max(...topAreas.map(([, v]) => v), 1);

  const odsCount = {};
  projects.forEach(p => (p.ods || []).forEach(id => { odsCount[id] = (odsCount[id] || 0) + 1; }));
  const topOds = Object.entries(odsCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const uniqueResearchers = new Set(projects.map(p => p.researcher_id)).size;

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff', width: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '22px 32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0d1f3c', letterSpacing: '-0.4px' }}>Painel do Gestor</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#6b7fa3' }}>Visão geral do ecossistema de inovação de Recife</p>
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Pesquisas Publicadas', value: loading ? '…' : String(projects.length),      delta: 'publicadas',     color: '#0060e0', icon: '🔬' },
            { label: 'Pesquisadores Ativos', value: loading ? '…' : String(uniqueResearchers),    delta: 'pesquisadores',  color: '#7c3aed', icon: '👩‍🔬' },
            { label: 'Áreas Cobertas',       value: loading ? '…' : String(topAreas.length),      delta: 'áreas',          color: '#059669', icon: '🔗' },
            { label: 'Aprovações Pendentes', value: String(pending.length),                        delta: 'Requer ação',    color: '#d97706', icon: '⏳', onClick: onApprovals },
          ].map(k => (
            <div key={k.label}
              style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '18px', boxShadow: '0 1px 4px rgba(0,60,180,0.05)', cursor: k.onClick ? 'pointer' : 'default' }}
              onClick={k.onClick}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{k.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: k.color, background: k.color + '18', borderRadius: 10, padding: '2px 8px' }}>{k.delta}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>Pesquisas por Área</h3>
            {loading ? (
              <div style={{ color: '#6b7fa3', fontSize: 13, textAlign: 'center', padding: 20 }}>⏳ Carregando...</div>
            ) : topAreas.length === 0 ? (
              <div style={{ color: '#6b7fa3', fontSize: 13, textAlign: 'center', padding: 20 }}>Sem dados ainda</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topAreas.map(([area, count]) => (
                  <div key={area} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#4a5a7a', width: 130, flexShrink: 0 }}>{area}</span>
                    <div style={{ flex: 1, height: 8, background: 'rgba(0,60,180,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / maxArea) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#3b8eff,#0040cc)', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0060e0', width: 16, textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>Cobertura dos ODS</h3>
            {topOds.length === 0 ? (
              <div style={{ color: '#6b7fa3', fontSize: 13, textAlign: 'center', padding: 20 }}>Sem dados ainda</div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {topOds.map(([id, count]) => {
                    const o = ODS_LIST.find(x => x.id === parseInt(id));
                    return o ? (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: o.color + '12', border: `1px solid ${o.color}44`, borderRadius: 6, padding: '5px 10px' }}>
                        <span style={{ width: 16, height: 16, borderRadius: 2, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{id}</span>
                        <span style={{ fontSize: 11, color: o.color, fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: o.color, background: o.color + '22', borderRadius: 10, padding: '0 5px' }}>{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div style={{ background: 'rgba(0,96,224,0.05)', border: '1px solid rgba(0,96,224,0.12)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#4a5a7a' }}>
                  📊 {Object.keys(odsCount).length} dos 17 ODS estão cobertos pelas pesquisas atuais
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>Pesquisas em Destaque</h3>
            <span style={{ fontSize: 12, color: '#0060e0', cursor: 'pointer', fontWeight: 600 }}>Ver todas →</span>
          </div>
          {loading ? (
            <div style={{ color: '#6b7fa3', fontSize: 13, textAlign: 'center', padding: 20 }}>⏳ Carregando...</div>
          ) : projects.length === 0 ? (
            <div style={{ color: '#6b7fa3', fontSize: 13, textAlign: 'center', padding: 20 }}>Nenhuma pesquisa publicada ainda</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {projects.slice(0, 3).map(p => (
                <div key={p.id} onClick={() => onDetail(p)}
                  style={{ background: '#f7faff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 8, padding: '14px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#0060e0'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,60,180,0.1)'}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#0060e0', background: 'rgba(0,96,224,0.1)', borderRadius: 3, padding: '2px 6px', textTransform: 'uppercase' }}>{p.area}</span>
                    <span style={{ fontSize: 9, color: '#6b7fa3', background: 'rgba(0,0,0,0.04)', borderRadius: 3, padding: '2px 6px' }}>{p.institution}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#0d1f3c', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#6b7fa3' }}>👁 {p.views || 0}</span>
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>🔗 {p.connections_count || 0}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                      {(p.ods || []).slice(0, 2).map(id => {
                        const o = ODS_LIST.find(x => x.id === id);
                        return o ? <span key={id} style={{ width: 14, height: 14, borderRadius: 2, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff' }}>{id}</span> : null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
