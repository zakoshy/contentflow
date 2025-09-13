import { Linkedin, Instagram, Facebook } from 'lucide-react';

interface SocialIconProps {
  platform: 'X' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'TikTok';
  className?: string;
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1227"
      fill="none"
      className={className}
    >
      <path
        d="M714.258 554.484L1160.35 0H1055.12L661.122 493.24L351.698 0H0L468.492 682.936L0 1226.37H105.23L504.931 720.526L828.302 1226.37H1180L714.258 554.484ZM553.805 654.436L516.291 600.522L131.39 52.28H300.56L591.133 403.882L628.647 457.796L1069.84 1178.63H899.988L553.805 654.436Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
      className={className}
    >
        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}


export function SocialIcon({ platform, className }: SocialIconProps) {
  const props = { className: className || 'h-6 w-6 text-primary' };
  switch (platform) {
    case 'X':
      return <XLogo {...props} />;
    case 'LinkedIn':
      return <Linkedin {...props} />;
    case 'Instagram':
      return <Instagram {...props} />;
    case 'Facebook':
      return <Facebook {...props} />;
    case 'TikTok':
      return <TikTokLogo {...props} />;
    default:
      return null;
  }
}
