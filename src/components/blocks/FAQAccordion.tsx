"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddIcon, MinusIcon } from "@/components/icons";

interface FAQItem {
  question: string;
  answer: string;
  id?: string;
  slug?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  // CMS inline editing props
  cmsEntry?: string;
  cmsFieldPrefix?: string;
}

export function FAQAccordion({ items, className, cmsEntry, cmsFieldPrefix }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Helper to create CMS data attributes
  const cmsAttrs = (field: string, itemSlug?: string, label?: string) => {
    // If item has its own slug, use that as the entry
    if (itemSlug) {
      return {
        "data-cms-entry": itemSlug,
        "data-cms-field": field,
        ...(label && { "data-cms-label": label }),
      };
    }
    // Otherwise use the parent entry with array field path
    if (!cmsEntry || !cmsFieldPrefix) return {};
    return {
      "data-cms-entry": cmsEntry,
      "data-cms-field": `${cmsFieldPrefix}.${field}`,
      ...(label && { "data-cms-label": label }),
    };
  };

  return (
    <div
      className={cn("w-full", className)}
      data-cms-entry={cmsEntry}
      data-cms-field={cmsFieldPrefix ? `${cmsFieldPrefix}.items` : undefined}
      data-cms-type="array"
      data-cms-label="FAQ Items"
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="border-t border-b border-off-white-100 -mb-px"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-s px-0 text-left"
          >
            <span
              className="font-sabon text-h3 text-off-white-100 pr-m max-w-[712px]"
              {...cmsAttrs("question", item.slug, "Question")}
            >
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
              <p
                className="font-sabon text-body-s text-off-white-100 leading-relaxed max-w-[712px]"
                {...cmsAttrs("answer", item.slug, "Answer")}
              >
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
