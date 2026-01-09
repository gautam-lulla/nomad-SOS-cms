import { Navigation } from "@/components/layout";
import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  { src: "/images/gallery/image-1.jpg", alt: "Gallery 1" },
  { src: "/images/gallery/image-2.jpg", alt: "Gallery 2" },
  { src: "/images/gallery/image-3.jpg", alt: "Gallery 3" },
  { src: "/images/instagram/insta-1.jpg", alt: "Gallery 4" },
  { src: "/images/instagram/insta-2.jpg", alt: "Gallery 5" },
  { src: "/images/instagram/insta-3.jpg", alt: "Gallery 6" },
];

export default function NotFound() {
  return (
    <main className="bg-black-900 h-screen overflow-hidden relative">
      {/* Navigation */}
      <Navigation />

      {/* Gallery Strip - positioned below nav */}
      <section className="absolute top-[100px] md:top-[105px] lg:top-[110px] left-0 right-0">
        <div className="grid grid-cols-3 md:grid-cols-6 h-[310px] md:h-[296px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative"
            >
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

      {/* 404 Content - positioned at bottom */}
      <section className="absolute bottom-0 left-0 right-0 p-[30px] lg:p-[60px]">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-sabon text-[28px] lg:text-h2 text-off-white-100 leading-[1.3] tracking-tight-h2">
            404
          </h1>
          <div className="flex flex-col gap-3s">
            <p className="font-sabon text-[28px] lg:text-h2 text-off-white-100 leading-[1.3] tracking-tight-h2">
              Lost? Must Be the Cocktails
            </p>
            <Link
              href="/"
              className="font-gotham font-bold text-cta uppercase tracking-wide-cta inline-flex items-center justify-center w-fit px-s pt-3xs pb-2xs bg-transparent text-off-white-100 border border-off-white-100 hover:bg-pink-500 hover:text-black-900 hover:border-pink-500 transition-all duration-300"
            >
              Take Me Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
