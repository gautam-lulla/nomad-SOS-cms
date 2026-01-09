import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export function HamburgerIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-[50px] h-[10px]", className)}
      viewBox="0 0 50 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <line y1="1" x2="50" y2="1" stroke="currentColor" strokeWidth="2" />
      <line y1="9" x2="50" y2="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CloseIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-5 h-5", className)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
      <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ArrowRightIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-[22px] h-[8px]", className)}
      viewBox="0 0 22 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <path
        d="M21.3536 4.35355C21.5488 4.15829 21.5488 3.84171 21.3536 3.64645L18.1716 0.464466C17.9763 0.269204 17.6597 0.269204 17.4645 0.464466C17.2692 0.659728 17.2692 0.976311 17.4645 1.17157L20.2929 4L17.4645 6.82843C17.2692 7.02369 17.2692 7.34027 17.4645 7.53553C17.6597 7.7308 17.9763 7.7308 18.1716 7.53553L21.3536 4.35355ZM0 4.5H21V3.5H0V4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowLeftIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-[22px] h-[8px]", className)}
      viewBox="0 0 22 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <path
        d="M0.646446 3.64644C0.451184 3.84171 0.451184 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.73079 4.34027 7.73079 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82842L1.70711 4L4.53553 1.17157C4.7308 0.976308 4.7308 0.659726 4.53553 0.464463C4.34027 0.269201 4.02369 0.269201 3.82843 0.464463L0.646446 3.64644ZM22 3.5L1 3.5V4.5L22 4.5V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AddIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-[26px] h-[26px]", className)}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <line x1="13" y1="0" x2="13" y2="26" stroke="currentColor" strokeWidth="2" />
      <line x1="0" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MinusIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg
      className={cn("w-[26px] h-[26px]", className)}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <line x1="0" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

