"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="divide-framboise/20 divide-y">
      {items.map((item, index) => (
        <Accordion.Item key={item.question} value={`item-${index}`} className="py-2">
          <Accordion.Header>
            <Accordion.Trigger className="group text-prune hover:text-framboise-dark flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-extrabold transition-colors md:text-lg">
              <span>{item.question}</span>
              <span className="bg-butter text-prune flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-data-[state=open]:rotate-45">
                <Plus className="size-5" aria-hidden="true" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              "text-prune/85 overflow-hidden text-[15px] leading-relaxed md:text-base",
              "data-[state=open]:animate-[accordion-down_220ms_ease-out]",
              "data-[state=closed]:animate-[accordion-up_180ms_ease-in]",
            )}
          >
            <p className="max-w-3xl pr-12 pb-6">{item.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
