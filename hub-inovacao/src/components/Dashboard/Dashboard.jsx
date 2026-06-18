import { useState } from 'react';
import { AREAS, INSTITUTIONS } from '../../data';
import { useMobile } from '../../hooks/useMobile';
import { useProjects } from '../../hooks/useProjects';
import { ResearchCard } from './ResearchCard';

export function Dashboard({ onDetail }) {
  const mobile = useMobile();
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({ area: '', institution: '', type: '', ods: '' });

  const { projects, loading } = useProjects({ search, ...filters });

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: f[k] === v ? '' : v }));

  const statsInstituicoes = new Set(projects.map(p => p.institution)).size;
  const statsConexoes     = projects.reduce((s, p) => s + (p.connections_count || 0), 0);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: '#f4f8ff', width: '100%' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: mobile ? '14px 16px' : '28px 32px 22px' }}>
        <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', marginBottom: mobile ? 12 : 22, flexDirection: mobile ? 'column' : 'row', gap: mobile ? 8 : 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: mobile ? 18 : 24, fontWeight: 800, color: '#0d1f3c', letterSpacing: '-0.5px' }}>Explorar Pesquisas</h1>
            <p style={{ margin: '4px 0 0', fontSize: mobile ? 12 : 14, color: '#6b7fa3' }}>Conhecimento acadêmico de Recife, aberto para conexões</p>
          </div>
          <div style={{ display: 'flex', gap: mobile ? 16 : 24 }}>
            {[[String(projects.length), 'Pesquisas'], [String(statsInstituicoes), 'Instituições'], [String(statsConexoes), 'Conexões']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: mobile ? 16 : 22, fontWeight: 800, color: '#0060e0' }}>{n}</div>
                <div style={{ fontSize: 10, color: '#6b7fa3' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#6b7fa3' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tema, palavra-chave..."
            style={{ width: '100%', boxSizing: 'border-box', background: '#f7faff', border: '1px solid rgba(0,60,180,0.15)', borderRadius: 10, padding: '10px 14px 10px 36px', color: '#0d1f3c', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 2 }}>
          {AREAS.slice(0, mobile ? 5 : 6).map(a => (
            <button key={a} onClick={() => setFilter('area', a)}
              style={{ padding: '4px 10px', borderRadius: 20, border: `1px solid ${filters.area === a ? '#0060e0' : 'rgba(0,60,180,0.15)'}`, background: filters.area === a ? 'rgba(0,96,224,0.1)' : '#ffffff', color: filters.area === a ? '#0060e0' : '#6b7fa3', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', fontWeight: filters.area === a ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {a}
            </button>
          ))}
          {!mobile && INSTITUTIONS.slice(0, 3).map(i => (
            <button key={i} onClick={() => setFilter('institution', i)}
              style={{ padding: '4px 10px', borderRadius: 20, border: `1px solid ${filters.institution === i ? '#059669' : 'rgba(0,60,180,0.15)'}`, background: filters.institution === i ? 'rgba(5,150,105,0.08)' : '#ffffff', color: filters.institution === i ? '#059669' : '#6b7fa3', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: filters.institution === i ? 600 : 400 }}>
              {i}
            </button>
          ))}
          {(filters.area || filters.institution || search) &&
            <button onClick={() => { setFilters({ area: '', institution: '', type: '', ods: '' }); setSearch(''); }}
              style={{ padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
              ✕ Limpar
            </button>
          }
        </div>
      </div>

      <div style={{ padding: mobile ? '14px 16px' : '24px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7fa3' }}>
            <div style={{ fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>⏳</div>
            <div style={{ fontSize: 13 }}>Carregando pesquisas...</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: '#6b7fa3', marginBottom: 12 }}>
              {projects.length} pesquisa{projects.length !== 1 ? 's' : ''} encontrada{projects.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill,minmax(340px,1fr))', gap: 12 }}>
              {projects.map(p => <ResearchCard key={p.id} project={p} onClick={onDetail} />)}
            </div>
            {projects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7fa3' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔬</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0d1f3c' }}>Nenhuma pesquisa encontrada</div>
                <div style={{ fontSize: 12, marginTop: 5 }}>Tente outros termos ou remova filtros</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
