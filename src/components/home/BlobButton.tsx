type BlobButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export default function BlobButton({ label, href, onClick }: BlobButtonProps) {
  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      {...(href ? { href } : { onClick } as Record<string, unknown>)}
      className="blob-btn-svg block focus:outline-none"
      style={{ textDecoration: 'none' }}
    >
      <svg viewBox="45 60 400 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <path fill="#4F46E5" d="M 90 210 C 90 180 90 150 90 150 C 150 150 180 150 180 150 C 180 150 300 150 300 150 C 300 150 330 150 390 150 C 390 150 390 180 390 210 C 390 240 390 270 390 270 C 330 270 300 270 300 270 C 300 270 180 270 180 270 C 180 270 150 270 90 270 C 90 270 90 240 90 210" mask="url(#blob-mask)" />
        <mask id="blob-mask">
          <rect width="100%" height="100%" fill="#fff" x="0" y="0" />
          <text x="240" y="230" fill="#000" textAnchor="middle" fontSize="36" fontFamily="inherit" fontWeight="800">
            {label}
          </text>
        </mask>
      </svg>
    </Tag>
  );
}
