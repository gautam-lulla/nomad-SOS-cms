import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface InstagramFeedProps {
  title?: string;
  handle: string;
  handleUrl?: string;
  images: {
    src: string;
    alt?: string;
  }[];
  className?: string;
}

export function InstagramFeed({
  title = "Inspiration is everywhere",
  handle,
  handleUrl = "https://instagram.com/nomadwynwood",
  images,
  className,
}: InstagramFeedProps) {
  return (
    <section className={cn("bg-black-900 pt-3l", className)}>
      {/* Title */}
      <div className="flex flex-col items-center gap-2xxs mb-3l px-6">
        <h2 className="font-sabon text-h2 text-off-white-100 text-center">
          {title}
        </h2>
        <Link
          href={handleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sabon text-h3 text-off-white-100 hover:text-pink-500 transition-colors"
        >
          {handle}
        </Link>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="relative h-[200px] md:h-[300px] lg:h-[444px]">
            <Image
              src={image.src}
              alt={image.alt || `Instagram post ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
