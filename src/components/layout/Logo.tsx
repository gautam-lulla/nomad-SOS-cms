import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "small" | "medium" | "large" | "footer";
  className?: string;
}

export function Logo({ variant = "light", size = "medium", className }: LogoProps) {
  const sizeMap = {
    small: 80,
    medium: 110,
    large: 272,
    footer: 180,
  };

  const dimension = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        "relative block overflow-hidden",
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      {/* Logo group */}
      <div className="absolute inset-[15%_15.38%_17.46%_15.38%]">
        <Image
          src={variant === "light" ? "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad/logo-mark-group.svg" : "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad/logo-mark-footer.svg"}
          alt="NoMad Wynwood"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Logo vector/text */}
      <div className="absolute inset-[66.97%_44.97%_15%_44.97%]">
        <Image
          src={variant === "light" ? "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad/logo-vector.svg" : "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/nomad/logo-vector-dark.svg"}
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </Link>
  );
}

