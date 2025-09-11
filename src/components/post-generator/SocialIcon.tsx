import { Linkedin, Instagram, Facebook } from 'lucide-react';

interface SocialIconProps {
  platform: 'X' | 'LinkedIn' | 'Instagram' | 'Facebook';
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
    default:
      return null;
  }
}
