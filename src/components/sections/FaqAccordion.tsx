'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

interface FaqAccordionProps {
  entry: string;
  sectionLabel?: string;
  heading?: string;
  items: FaqItem[];
  filterCategory?: string;
}

export function FaqAccordion({
  entry,
  sectionLabel,
  heading,
  items,
  filterCategory,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filter items by category if specified
  const filteredItems = filterCategory
    ? items.filter((item) => item.category === filterCategory)
    : items;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-ink-900 py-[60px] px-[60px]">
      {/* Header */}
      <div className="mb-10">
        {sectionLabel && (
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white block mb-4"
            data-cms-entry={entry}
            data-cms-field="sectionLabel"
          >
            {sectionLabel}
          </span>
        )}
        {heading && (
          <h2
            className="font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] text-off-white"
            data-cms-entry={entry}
            data-cms-field="heading"
          >
            {heading}
          </h2>
        )}
      </div>

      {/* Accordion Items */}
      <div className="max-w-[800px]">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="border-t border-off-white/20 last:border-b"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full py-6 flex items-center justify-between text-left group"
              aria-expanded={openIndex === index}
            >
              <span
                className="font-sabon text-[24px] leading-[1.3] tracking-[-0.48px] text-off-white group-hover:text-pink-400 transition-colors"
                data-cms-entry={entry}
                data-cms-field={`faq[${index}].question`}
              >
                {item.question}
              </span>
              <span
                className={`text-off-white transition-transform duration-300 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-[500px] pb-6' : 'max-h-0'
              }`}
            >
              <p
                className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white/80"
                data-cms-entry={entry}
                data-cms-field={`faq[${index}].answer`}
              >
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
