export function StatusBadge({ status }) {
  const map = {
    published: ['Publicado', '#059669'],
    review: ['Em análise', '#d97706'],
    draft: ['Rascunho', '#6b7fa3'],
    hidden: ['Oculto', '#dc2626'],
  };
  const [label, color] = map[status] || ['?', '#888'];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + '18', border: `1px solid ${color}33`,
      borderRadius: 4, padding: '2px 8px',
    }}>{label}</span>
  );
}
