import Image from 'next/image';

interface GalleryProps {
  entry: string;
  sectionLabel?: string;
  images: Array<{ src: string; alt: string }>;
  variant?: 'grid-2' | 'grid-3' | 'grid-4' | 'masonry';
}

export function Gallery({
  entry,
  sectionLabel,
  images,
  variant = 'grid-3',
}: GalleryProps) {
  const gridClasses = {
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    masonry: 'grid-cols-2 md:grid-cols-3',
  };

  return (
    <section
      className="bg-ink-900 py-[60px]"
      data-cms-entry={entry}
      data-cms-field="images"
      data-cms-type="array"
    >
      {sectionLabel && (
        <div className="px-[60px] mb-8">
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
            data-cms-entry={entry}
            data-cms-field="sectionLabel"
          >
            {sectionLabel}
          </span>
        </div>
      )}

      <div className={`grid ${gridClasses[variant]} gap-1`}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-square overflow-hidden ${
              variant === 'masonry' && index === 0 ? 'md:row-span-2 md:aspect-auto md:h-full' : ''
            }`}
          >
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
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
