export function BtnPrimary({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      border: 'none', borderRadius: 16, fontFamily: 'inherit', fontWeight: 600,
      cursor: 'pointer', background: 'var(--amber)', color: '#1A1305',
      fontSize: '1.05rem', padding: '17px 28px', width: '100%',
      opacity: disabled ? 0.35 : 1, pointerEvents: disabled ? 'none' : 'auto',
      ...style
    }}>
      {children}
    </button>
  )
}

export function BtnGhost({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 'none', color: 'var(--text-dim)',
      fontSize: '0.88rem', padding: 8, textDecoration: 'underline',
      textUnderlineOffset: 3, fontFamily: 'inherit', cursor: 'pointer',
      width: '100%', ...style
    }}>
      {children}
    </button>
  )
}
