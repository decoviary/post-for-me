import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { Accordion, AccordionContent, AccordionItem } from "~/ui/accordion";
import { faqs } from "./content";

export function FAQ() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <h2 className="text-center text-muted-foreground text-3xl">
        Frequently Asked Questions
      </h2>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        defaultValue="3"
      >
        {faqs.map((item) => (
          <AccordionItem
            value={item.question}
            key={item.question}
            className="bg-card has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:ring-0 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                {item.question}
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground pb-2">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
