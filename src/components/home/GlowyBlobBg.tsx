/* Glowy blob background effect for hero sections */
export default function GlowyBlobBg() {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="glowy-blob" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} />
        ))}
      </div>
    </>
  );
}
