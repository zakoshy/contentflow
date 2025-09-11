import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

interface SocialIconProps {
  platform: 'X' | 'LinkedIn' | 'Instagram' | 'Facebook';
  className?: string;
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  const props = { className: className || 'h-6 w-6 text-primary' };
  switch (platform) {
    case 'X':
      return <Twitter {...props} />;
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
