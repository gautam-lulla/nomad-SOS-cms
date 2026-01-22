import Image from 'next/image';
import Link from 'next/link';

interface InstagramFeedProps {
  entry: string;
  title?: string;
  handle?: string;
  profileUrl?: string;
  sectionLabel?: string;
  images: Array<{ src: string; alt: string }>;
}

export function InstagramFeed({
  entry,
  title,
  handle,
  profileUrl,
  sectionLabel,
  images,
}: InstagramFeedProps) {
  return (
    <section className="bg-ink-900 py-[60px]">
      {/* Header */}
      <div className="px-[60px] mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {sectionLabel && (
            <span
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
              data-cms-entry={entry}
              data-cms-field="sectionLabel"
            >
              {sectionLabel}
            </span>
          )}
          {title && (
            <h2
              className="font-sabon text-[24px] leading-[1.3] tracking-[-0.48px] text-off-white"
              data-cms-entry={entry}
              data-cms-field="title"
            >
              {title}
            </h2>
          )}
        </div>
        {handle && profileUrl && (
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 hover:text-off-white transition-colors"
            data-cms-entry={entry}
            data-cms-field="handle"
          >
            {handle}
          </Link>
        )}
      </div>

      {/* Image Grid - 4 columns */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        data-cms-entry={entry}
        data-cms-field="images"
        data-cms-type="array"
      >
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            {profileUrl ? (
              <Link
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-full group"
              >
                <div
                  data-cms-entry={entry}
                  data-cms-field={`image${index + 1}`}
                  data-cms-type="image"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/40 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-off-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div
                className="relative w-full h-full"
                data-cms-entry={entry}
                data-cms-field={`image${index + 1}`}
                data-cms-type="image"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
