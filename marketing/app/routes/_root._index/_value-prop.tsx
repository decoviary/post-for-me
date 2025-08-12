import { GaugeIcon, Layers3Icon, ZapIcon } from "icons";
import { Link } from "react-router";
import { APP_URL } from "~/lib/constants";

import { Button } from "~/ui/button";

const cards = [
  {
    title: "Launch in hours, not weeks.",
    deck: "Drop-in REST calls replace dozens of separate APIs. Our example code get you live the same day.",
    icon: ZapIcon,
  },
  {
    title: "Pay only for successful posts.",
    deck: "Metered pricing scales with usage. No account caps or surprise seat fees.",
    icon: GaugeIcon,
  },
  {
    title: "Keep full platform power.",
    deck: "Configure captions, hashtags, and media per platform in the same call.",
    icon: Layers3Icon,
  },
];

export function ValueProp() {
  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col gap-4">
            <card.icon className="size-10 text-primary" />
            <h3 className="text-3xl font-bold">{card.title}</h3>
            <p className="text-muted-foreground">{card.deck}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto flex flex-row gap-2">
        <Button asChild>
          <Link to={APP_URL}>Get Started for Free</Link>
        </Button>
      </div>
    </div>
  );
}
