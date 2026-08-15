"use client";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PageItem = number | "...";

function getPageList(current: number, last: number): PageItem[] {
  const maxVisible = 5;

  if (last <= maxVisible + 1) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  if (current <= maxVisible - 1) {
    return [1, 2, 3, 4, 5, "...", last];
  }

  if (current >= last - (maxVisible - 2)) {
    return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
  }
  return [1, "...", current - 1, current, current + 1, "...", last];
}

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total?: number;
  from?: number;
  to?: number;
  onPageChange: (page: number) => void;
  showSummary?: boolean;
  className?: string;
}

export default function PaginationControl({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
  showSummary = true,
  className = "",
}: PaginationProps) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = getPageList(currentPage, lastPage);
  const hasSummary = showSummary && from != null && to != null && total != null;

  return (
    <div
      className={`flex items-center py-8 flex-wrap gap-4 ${
        hasSummary ? "justify-between" : "justify-center"
      } ${className}`}
    >
      {hasSummary && (
        <p className="text-sm text-gray">
          Showing <span className="font-medium text-black">{from}</span>
          {"–"}
          <span className="font-medium text-black">{to}</span> of{" "}
          <span className="font-medium text-black">{total}</span> results
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className={`flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 transition-colors ${
            currentPage > 1
              ? "text-black bg-white hover:border-primary/40 hover:text-primary cursor-pointer"
              : "text-gray/40 bg-gray-50 cursor-not-allowed"
          }`}
        >
          <FiChevronLeft size={15} />
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-gray text-sm select-none"
            >
              ⋯
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                p === currentPage
                  ? "bg-primary-green text-white"
                  : "text-black bg-white border border-gray-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className={`flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 transition-colors ${
            currentPage < lastPage
              ? "text-black bg-white hover:border-primary/40 hover:text-primary cursor-pointer"
              : "text-gray/40 bg-gray-50 cursor-not-allowed"
          }`}
        >
          <FiChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
