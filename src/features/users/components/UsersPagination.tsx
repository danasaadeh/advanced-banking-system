import React from "react";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const safeTotal = totalItems || 0;
  const safePage = currentPage || 1;
  
  const startIndex = safeTotal === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex = safeTotal === 0 ? 0 : Math.min(safePage * itemsPerPage, safeTotal);
  
  const paginationButtonBase = "min-w-[70px] px-3 py-1 rounded flex items-center justify-center bg-primary text-primary-foreground border border-border hover:opacity-90 disabled:opacity-40";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border">
      <div className="text-sm text-muted-foreground">
        {safeTotal === 0
          ? "No users found"
          : `Showing ${startIndex} to ${endIndex} of ${safeTotal} users`}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className={paginationButtonBase}
        >
          Previous
        </button>

        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-10 px-3 py-1 rounded
              flex items-center justify-center
              border
              ${safePage === page
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages || 1, safePage + 1))}
          disabled={safePage === totalPages}
          className={paginationButtonBase}
        >
          Next
        </button>
      </div>
    </div>
  );
};