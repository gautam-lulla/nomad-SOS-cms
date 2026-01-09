import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroSplitScreenProps {
  leftImage: string;
  rightImage: string;
  showGradients?: boolean;
  showLogo?: boolean;
  logoSrc?: string;
  className?: string;
}

export function HeroSplitScreen({
  leftImage,
  rightImage,
  showGradients = true,
  showLogo = true,
  logoSrc = "/images/nomad-wynwood-mark-svg.svg",
  className,
}: HeroSplitScreenProps) {
  return (
    <section className={cn("relative h-[500px] md:h-[700px] lg:h-[840px] overflow-hidden", className)}>
      {/* Left Image - Full width on mobile, half on desktop */}
      <div className="absolute left-0 top-0 w-full lg:w-1/2 h-full">
        <Image
          src={leftImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Image - Hidden on mobile, visible on desktop */}
      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
        <Image
          src={rightImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top Gradient */}
      {showGradients && (
        <div className="absolute top-0 left-0 right-0 h-[240px] md:h-[350px] lg:h-[480px] bg-gradient-to-b from-black-900 to-transparent pointer-events-none" />
      )}

      {/* Bottom Gradient */}
      {showGradients && (
        <div className="absolute bottom-0 left-0 right-0 h-[240px] md:h-[350px] lg:h-[480px] bg-gradient-to-t from-black-900 to-transparent pointer-events-none" />
      )}

      {/* Logo */}
      {showLogo && (
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 lg:px-3m pb-4 md:pb-6 lg:pb-3m">
          <div className="relative h-[40px] md:h-[60px] lg:h-[96px] w-full max-w-[1320px] mx-auto">
            <Image
              src={logoSrc}
              alt="The NoMad Bar"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
