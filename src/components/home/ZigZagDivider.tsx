export default function ZigZagDivider({ text, rotate }: { text?: string; rotate?: boolean }) {
  const items = text
    ? text.split('').map((ch, i) => ({ ch, i }))
    : Array.from({ length: 4 }).map((_, i) => ({ ch: '', i }));

  return (
    <div className={`zigzag-container${rotate ? ' rotate' : ''}`}>
      {items.map(({ ch, i }) => (
        <div key={i} className="zigzag-item" style={{ '--i': i } as React.CSSProperties}>
          {ch ? (
            <span><b>{ch}</b></span>
          ) : (
            <span style={{ visibility: 'hidden' }} />
          )}
        </div>
      ))}
    </div>
  );
}
