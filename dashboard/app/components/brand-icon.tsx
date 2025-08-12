import {
  BlueskyIcon,
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  ThreadsIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
  TriangleExclamationIcon,
} from "icons";

import { cn } from "~/lib/utils";

const brandIconMap = {
  bluesky: BlueskyIcon,
  facebook: FacebookIcon,
  google: GoogleIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  threads: ThreadsIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  twitter: XIcon, // Alias for X
  youtube: YouTubeIcon,
} as const;

interface BrandIconProps {
  brand: keyof typeof brandIconMap | string;
  className?: string;
}
export function BrandIcon({ brand, className }: BrandIconProps) {
  const IconComponent =
    brandIconMap[brand.toLowerCase() as keyof typeof brandIconMap];

  if (!IconComponent) {
    // Fallback for unknown brands
    return <TriangleExclamationIcon className={className} />;
  }

  return <IconComponent className={cn(className)} />;
}
