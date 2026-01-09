import { Navigation } from "@/components/layout";
import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  { src: "/images/instagram/insta-1.jpg", alt: "Gallery 1" },
  { src: "/images/instagram/insta-2.jpg", alt: "Gallery 2" },
  { src: "/images/instagram/insta-3.jpg", alt: "Gallery 3" },
  { src: "/images/instagram/insta-4.jpg", alt: "Gallery 4" },
  { src: "/images/gallery/image-1.jpg", alt: "Gallery 5" },
  { src: "/images/gallery/image-2.jpg", alt: "Gallery 6" },
];

export default function NotFound() {
  return (
    <main className="bg-black-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Gallery Strip */}
      <section className="pt-[110px]">
        <div className="flex h-[280px]">
          {galleryImages.map((image, index) => (
            <div key={index} className="flex-1 relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 404 Content */}
      <section className="flex flex-col items-start justify-center px-3m py-[200px]">
        <span className="font-sabon text-[120px] leading-none text-off-white-100 mb-xs">
          404
        </span>
        <h1 className="font-sabon text-[56px] leading-tight text-off-white-100 mb-m">
          Lost? Must Be the Cocktails
        </h1>
        <Link
          href="/"
          className="font-gotham font-bold text-cta uppercase tracking-wide-cta inline-flex items-center justify-center gap-xxs transition-all duration-300 ease-in-out px-s pt-3xs pb-2xs bg-transparent text-off-white-100 border border-off-white-100 hover:bg-pink-500 hover:text-black-900 hover:border-pink-500"
        >
          Take Me Home
        </Link>
      </section>
    </main>
  );
}
