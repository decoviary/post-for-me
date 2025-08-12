import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
  YouTubeIcon,
  PinterestIcon,
  LinkedInIcon,
  BlueskyIcon,
  ThreadsIcon,
} from "icons";

import { cn } from "~/lib/utils";

interface ProviderIconProps {
  provider: string;
  className?: string;
}

const icons: Record<string, React.FC<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  pinterest: PinterestIcon,
  linkedin: LinkedInIcon,
  bluesky: BlueskyIcon,
  threads: ThreadsIcon,
  tiktok_business: TikTokIcon,
};

export function ProviderIcon({ provider, className }: ProviderIconProps) {
  const Icon = icons?.[provider];

  if (!Icon) {
    return null;
  }

  return <Icon className={cn("size-16", className)} />;
}
