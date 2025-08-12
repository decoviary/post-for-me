import { XIcon } from "icons";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Button } from "~/ui/button";

const content = {
  headline: "Hi! We're Caleb & Matt",
  subheadline: "Co-founders of Post for Me",
  copy: [
    "We stared building social media integrations expecting a quick win, only to find each platform had huge differences in auth flows, rate limits, and media rules. The tools that could help were either **overpriced** or **too limited**.",
    "So, we built the pipelines ourselves, and want to make sure that no dev team has to repeat that grind. **Post for Me is the API we wish we'd had from day one**, a single endpoint that lets you schedule and publish across **TikTok**, **X**, **Facebook**, **Instagram**, **YouTube**, **LinkedIn**, **and more**, without the trade-offs.",
    "Hit us up and let us know what you're building and how we can help you ship!",
  ],
  image: {
    src: "/caleb.jpeg",
    alt: "Caleb Panza, Co-Founder & CEO Day Moon Development - builders of Post for Me",
  },
  social_links: [
    {
      platform: "X",
      href: "https://x.com/calebpanza",
      label: "Follow Caleb",
      icon: XIcon,
    },
    {
      platform: "LinkedIn",
      href: "https://x.com/mistermattroth",
      label: "Follow Matt",
      icon: XIcon,
    },
  ],
};

export function Testimonial() {
  const renderCopyWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <section className="p-10 bg-card border shadow-sm rounded-3xl flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="*:data-[slot=avatar]:size-16 *:data-[slot=avatar]:ring-card flex -space-x-2 *:data-[slot=avatar]:ring-4">
          <Avatar>
            <AvatarImage src="/caleb.jpeg" alt="@calebpanza" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="matt.png" alt="@mistermattroth" />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-bold">{content.headline}</h2>
          <h3 className="text-lg text-muted-foreground">
            {content.subheadline}
          </h3>
        </div>
      </div>

      <div>
        {content.copy.map((paragraph: string, index: number) => (
          <p key={index} className="mb-6">
            {renderCopyWithBold(paragraph)}
          </p>
        ))}

        <div className="flex gap-2 -ml-3">
          {content.social_links.map((link, index) => (
            <Button key={index} variant="ghost" asChild>
              <Link
                to={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} on ${link.platform}`}
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
