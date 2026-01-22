'use client';

import { useState, useMemo } from 'react';
import { EventCard } from './EventCard';
import { Pagination } from '@/components/ui/Pagination';

interface Event {
  title: string;
  date: string;
  time?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  ticketUrl?: string;
  isFeatured?: boolean;
}

interface EventsListProps {
  entry: string;
  sectionLabel?: string;
  heading?: string;
  events: Event[];
  variant?: 'grid' | 'list';
  showFeaturedOnly?: boolean;
  limit?: number;
  showPagination?: boolean;
}

export function EventsList({
  entry,
  sectionLabel,
  heading,
  events,
  variant = 'grid',
  showFeaturedOnly = false,
  limit = 6,
  showPagination = true,
}: EventsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort events
  const sortedEvents = useMemo(() => {
    const filteredEvents = showFeaturedOnly
      ? events.filter((e) => e.isFeatured)
      : events;

    return [...filteredEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events, showFeaturedOnly]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedEvents.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedEvents = showPagination
    ? sortedEvents.slice(startIndex, startIndex + limit)
    : sortedEvents.slice(0, limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section smoothly
    const section = document.getElementById('events-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="events-section" className="bg-ink-900 py-[60px] px-[60px]">
      {/* Header */}
      {(sectionLabel || heading) && (
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
      )}

      {/* Events */}
      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.map((event, index) => (
            <EventCard
              key={`${event.title}-${index}`}
              entry={entry}
              event={event}
              index={startIndex + index}
              variant="card"
            />
          ))}
        </div>
      ) : (
        <div className="max-w-[800px]">
          {paginatedEvents.map((event, index) => (
            <EventCard
              key={`${event.title}-${index}`}
              entry={entry}
              event={event}
              index={startIndex + index}
              variant="horizontal"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
    </section>
  );
}
