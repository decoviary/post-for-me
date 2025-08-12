import {
  TikTokIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  PinterestIcon,
  LinkedInIcon,
  ThreadsIcon,
  BlueskyIcon,
} from "icons";
import { cn } from "~/lib/utils";

const icons = [
  TikTokIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  PinterestIcon,
  LinkedInIcon,
  ThreadsIcon,
  BlueskyIcon,
];

export function SocialIconsRow({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {icons.map((Icon, index) => (
        <Icon
          key={index}
          className={cn("size-4 text-foreground", iconClassName)}
        />
      ))}
    </div>
  );
}
