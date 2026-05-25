import { useState } from 'react';
import { MY_PROJECTS } from '../../data';
import { StatusBadge } from '../shared/StatusBadge';

export function MyResearch({ onNew, onDetail }) {
  const [projects, setProjects] = useState([...MY_PROJECTS]);
  const hide = (id) => setProjects(ps => ps.map(p => p.id === id ? { ...p, status: 'hidden' } : p));

  return (
    <div style={{ flex: 1, width: '100%', overflow: 'auto', background: '#f4f8ff' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0d1f3c' }}>Minhas Pesquisas</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7fa3' }}>{projects.filter(p => p.status !== 'hidden').length} projetos ativos</p>
        </div>
        <button onClick={onNew} style={{ background: 'linear-gradient(135deg,#3b8eff,#0040cc)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Nova Pesquisa</button>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projects.filter(p => p.status !== 'hidden').map(p => (
          <div key={p.id} style={{ background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,60,180,0.05)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <StatusBadge status={p.status} />
                <span style={{ fontSize: 11, color: '#6b7fa3' }}>{p.area} · {p.type} · {p.year}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0d1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h3>
              {p.status === 'published' && (
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: '#6b7fa3' }}>👁 {p.views} views</span>
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>🔗 {p.connections} conexões</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {p.status === 'published' && <button onClick={() => onDetail(p)} style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(0,96,224,0.25)', background: 'rgba(0,96,224,0.06)', color: '#0060e0', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Ver</button>}
              <button style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(0,60,180,0.15)', background: '#ffffff', color: '#6b7fa3', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Editar</button>
              <button onClick={() => hide(p.id)} style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.04)', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Ocultar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
