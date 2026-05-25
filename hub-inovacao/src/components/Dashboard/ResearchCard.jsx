import { useState } from 'react';
import { OdsBadge } from '../shared/OdsBadge';
import { Avatar } from '../shared/Avatar';

export function ResearchCard({ project, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onClick(project)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hov ? 'rgba(0,96,224,0.25)' : 'rgba(0,60,180,0.1)'}`,
        borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 8px 28px rgba(0,60,180,0.12)' : '0 1px 4px rgba(0,60,180,0.05)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0060e0', background: 'rgba(0,96,224,0.1)', borderRadius: 4, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{project.area}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7fa3', background: 'rgba(0,0,0,0.04)', borderRadius: 4, padding: '2px 8px' }}>{project.type}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7fa3', background: 'rgba(0,0,0,0.04)', borderRadius: 4, padding: '2px 8px' }}>{project.institution}</span>
          </div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0d1f3c', lineHeight: 1.4 }}>{project.title}</h3>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#6b7fa3', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.simplified}</p>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {project.ods.map(id => <OdsBadge key={id} id={id} small />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid rgba(0,60,180,0.07)' }}>
        <Avatar initials={project.researcher.avatar} size={24} />
        <span style={{ fontSize: 12, color: '#6b7fa3', flex: 1 }}>{project.researcher.name}</span>
        <span style={{ fontSize: 11, color: '#6b7fa3' }}>👁 {project.views}</span>
        <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>🔗 {project.connections}</span>
      </div>
    </div>
  );
}
