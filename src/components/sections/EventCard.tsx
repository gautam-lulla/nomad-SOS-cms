import Image from 'next/image';
import { Button } from '../ui/Button';

interface Event {
  title: string;
  date: string;
  time?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  ticketUrl?: string;
}

interface EventCardProps {
  entry: string;
  event: Event;
  index: number;
  variant?: 'card' | 'horizontal';
}

export function EventCard({
  entry,
  event,
  index,
  variant = 'card',
}: EventCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  };

  const { day, month, weekday } = formatDate(event.date);

  if (variant === 'horizontal') {
    return (
      <article className="flex flex-col md:flex-row gap-6 py-6 border-t border-off-white/20 first:border-t-0">
        {/* Date */}
        <div className="flex-shrink-0 w-[80px]">
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 block"
            data-cms-entry={entry}
            data-cms-field={`events[${index}].date`}
          >
            {month}
          </span>
          <span className="font-sabon text-[48px] leading-[1] text-off-white block">
            {day}
          </span>
          <span className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60">
            {weekday}
          </span>
        </div>

        {/* Image */}
        {event.image && (
          <div className="relative w-full md:w-[200px] h-[150px] flex-shrink-0">
            <div
              data-cms-entry={entry}
              data-cms-field={`events[${index}].image`}
              data-cms-type="image"
            >
              <Image
                src={event.image}
                alt={event.imageAlt || event.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {event.category && (
            <span
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 block mb-2"
              data-cms-entry={entry}
              data-cms-field={`events[${index}].category`}
            >
              {event.category}
            </span>
          )}
          <h3
            className="font-sabon text-[24px] leading-[1.3] tracking-[-0.48px] text-off-white"
            data-cms-entry={entry}
            data-cms-field={`events[${index}].title`}
          >
            {event.title}
          </h3>
          {event.time && (
            <p
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60 mt-1"
              data-cms-entry={entry}
              data-cms-field={`events[${index}].time`}
            >
              {event.time}
            </p>
          )}
          {event.description && (
            <p
              className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white/80 mt-3"
              data-cms-entry={entry}
              data-cms-field={`events[${index}].description`}
            >
              {event.description}
            </p>
          )}
          {event.ticketUrl && (
            <div className="mt-4">
              <Button
                href={event.ticketUrl}
                variant="outline"
                isExternal
                data-cms-entry={entry}
                data-cms-field={`events[${index}].ticketUrl`}
              >
                Get Tickets
              </Button>
            </div>
          )}
        </div>
      </article>
    );
  }

  // Card variant (default)
  return (
    <article className="group">
      {/* Image */}
      {event.image && (
        <div className="relative aspect-[4/3] overflow-hidden mb-4">
          <div
            data-cms-entry={entry}
            data-cms-field={`events[${index}].image`}
            data-cms-type="image"
          >
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex gap-4">
        {/* Date */}
        <div className="flex-shrink-0 text-center">
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 block"
            data-cms-entry={entry}
            data-cms-field={`events[${index}].date`}
          >
            {month}
          </span>
          <span className="font-sabon text-[36px] leading-[1] text-off-white block">
            {day}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1">
          {event.category && (
            <span
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 block mb-1"
              data-cms-entry={entry}
              data-cms-field={`events[${index}].category`}
            >
              {event.category}
            </span>
          )}
          <h3
            className="font-sabon text-[20px] leading-[1.3] tracking-[-0.4px] text-off-white group-hover:text-pink-400 transition-colors"
            data-cms-entry={entry}
            data-cms-field={`events[${index}].title`}
          >
            {event.title}
          </h3>
          {event.time && (
            <p
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60 mt-1"
              data-cms-entry={entry}
              data-cms-field={`events[${index}].time`}
            >
              {event.time}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
