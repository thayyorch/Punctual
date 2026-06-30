export default function OnboardingDots({ step, total = 6 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '0 0 24px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i === step ? 'var(--amber)' : 'var(--ring-track)'
        }} />
      ))}
    </div>
  )
}
