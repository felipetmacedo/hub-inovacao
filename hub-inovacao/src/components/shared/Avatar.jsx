export function Avatar({ initials, size = 36, color = '#0060e0' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}18`, border: `2px solid ${color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
