"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddIcon, MinusIcon } from "@/components/icons";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border-t border-b border-off-white-100 -mb-px"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-s px-0 text-left"
          >
            <span className="font-sabon text-h3 text-off-white-100 pr-m max-w-[712px]">
              {item.question}
            </span>
            <span className="text-off-white-100 flex-shrink-0">
              {openIndex === index ? (
                <MinusIcon />
              ) : (
                <AddIcon />
              )}
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-2s">
              <p className="font-sabon text-body-s text-off-white-100 leading-relaxed max-w-[712px]">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
