"use client";

import { Button } from "@/components/ui";
import { Logo } from "@/components/layout";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="bg-black-900 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-l">
        <Logo variant="light" size="large" />
      </div>

      <h1 className="font-sabon text-h2-mobile md:text-h2 text-off-white-100 text-center mb-xs">
        Something went wrong
      </h1>

      <p className="font-sabon text-body-s text-off-white-100/70 text-center mb-m max-w-md">
        We apologize for the inconvenience. Please try again or return to the homepage.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button variant="filled" onClick={() => window.location.href = "/"}>
          Go Home
        </Button>
      </div>
    </main>
  );
}
