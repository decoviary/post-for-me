import { SocialIconsRow } from "~/components/social-icons-row";

import { Separator } from "~/ui/separator";

import { Hero } from "./_hero";
import { Problem } from "./_problem";
import { ValueProp } from "./_value-prop";
import { Tools } from "./_tools";
import { Pricing } from "./_pricing";
import { FAQ } from "./_faq";
import { Testimonial } from "./_testimonial";

export function Component() {
  return (
    <div className="flex flex-col gap-16">
      <Hero />

      <Separator />

      <ValueProp />

      <Separator />

      <Problem />

      <SocialIconsRow
        className="mx-auto md:my-12 gap-4 md:gap-12 opacity-35"
        iconClassName="size-5 md:size-12 text-muted-foreground"
      />

      <Tools />

      <SocialIconsRow
        className="mx-auto md:my-12 gap-4 md:gap-12 opacity-35"
        iconClassName="size-5 md:size-12 text-muted-foreground"
      />

      <Pricing />

      <Separator />

      <Testimonial />

      <FAQ />
    </div>
  );
}
