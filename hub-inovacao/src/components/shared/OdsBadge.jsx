import { ODS_LIST } from '../../data';

export function OdsBadge({ id, small }) {
  const o = ODS_LIST.find(x => x.id === id);
  if (!o) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: o.color + '18', border: `1px solid ${o.color}44`,
      borderRadius: small ? 4 : 6, padding: small ? '2px 6px' : '4px 9px',
      fontSize: small ? 10 : 11, fontWeight: 600, color: o.color, whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: small ? 10 : 12, height: small ? 10 : 12, borderRadius: 2,
        background: o.color, display: 'inline-block', flexShrink: 0,
        fontSize: 8, color: '#fff', textAlign: 'center',
        lineHeight: small ? '10px' : '12px', fontWeight: 800,
      }}>{id}</span>
      {!small && <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>}
    </span>
  );
}
