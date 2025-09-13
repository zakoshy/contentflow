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
      viewBox="0 0 2859 3333"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      className={className}
    >
      <path
        d="M2081 0c55 473-162 901-522 1080-350 174-736 148-1044-69-23-16-43-34-63-53v890c0 1021 1141 1461 1769 423 35-59 66-121 92-186 113 103 241 183 382 235v-654c-142-49-270-129-382-235a1334 1334 0 01-92 186c-590 953-1628 535-1628-423v-890c299 173 661 200 986 72 316-124 585-412 683-784 12-46 23-93 33-140h654z"
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
    case 'TikTok':
      return <TikTokLogo {...props} />;
    default:
      return null;
  }
}
