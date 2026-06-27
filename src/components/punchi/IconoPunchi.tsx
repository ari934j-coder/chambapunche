export function IconoPunchi({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="Punchi">
      <ellipse cx="100" cy="115" rx="62" ry="58" fill="#EF9F27" />
      <ellipse cx="78" cy="68" rx="13" ry="17" fill="#EF9F27" transform="rotate(-14 78 68)" />
      <ellipse cx="78" cy="70" rx="7" ry="9" fill="#D85A30" transform="rotate(-14 78 70)" />
      <ellipse cx="122" cy="68" rx="13" ry="17" fill="#EF9F27" transform="rotate(14 122 68)" />
      <ellipse cx="122" cy="70" rx="7" ry="9" fill="#D85A30" transform="rotate(14 122 70)" />
      <circle cx="85" cy="100" r="10" fill="#3D2B1F" />
      <circle cx="88" cy="97" r="3" fill="#FFFFFF" />
      <circle cx="115" cy="100" r="10" fill="#3D2B1F" />
      <circle cx="118" cy="97" r="3" fill="#FFFFFF" />
      <ellipse cx="100" cy="118" rx="8" ry="6" fill="#993C1D" />
      <path d="M92,124 Q100,131 108,124" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
