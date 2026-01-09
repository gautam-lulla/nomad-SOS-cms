import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function HamburgerIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-[50px] h-[10px]", className)}
      viewBox="0 0 50 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line y1="1" x2="50" y2="1" stroke="currentColor" strokeWidth="2" />
      <line y1="9" x2="50" y2="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-5 h-5", className)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
      <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-[13px] h-[7px]", className)}
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.5L7 0.5V2.5H0V4.5H7V6.5L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-[22px] h-[8px]", className)}
      viewBox="0 0 22 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.646446 3.64644C0.451184 3.84171 0.451184 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82842L1.70711 4L4.53553 1.17157C4.7308 0.976308 4.7308 0.659726 4.53553 0.464463C4.34027 0.269201 4.02369 0.269201 3.82843 0.464463L0.646446 3.64644ZM22 3.5L1 3.5V4.5L22 4.5V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AddIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-[26px] h-[26px]", className)}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="13" y1="0" x2="13" y2="26" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-[26px] h-[26px]", className)}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("w-6 h-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}
