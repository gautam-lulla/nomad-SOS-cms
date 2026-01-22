'use client';

import Image from 'next/image';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Format page number with leading zero
  const formatPageNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          w-12 h-12 flex items-center justify-center
          border border-off-white/30
          transition-all duration-200
          ${currentPage === 1
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-pink-400 hover:bg-pink-400/10'
          }
        `}
        aria-label="Previous page"
      >
        <Image
          src="/icons/arrow-left.svg"
          alt=""
          width={20}
          height={20}
          className="text-off-white"
        />
      </button>

      {/* Page Indicators */}
      <div className="flex items-center gap-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              font-gotham text-sm tracking-wider transition-colors duration-200
              ${page === currentPage
                ? 'text-pink-400'
                : 'text-off-white/50 hover:text-off-white'
              }
            `}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {formatPageNumber(page)}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          w-12 h-12 flex items-center justify-center
          border border-off-white/30
          transition-all duration-200
          ${currentPage === totalPages
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-pink-400 hover:bg-pink-400/10'
          }
        `}
        aria-label="Next page"
      >
        <Image
          src="/icons/arrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="text-off-white"
        />
      </button>
    </div>
  );
}
