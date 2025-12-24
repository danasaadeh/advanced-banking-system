import React from "react";
import { useTranslation } from "react-i18next";

interface TransactionsPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}) => {
  const safeTotal = totalItems || 0;
  const safePage = currentPage || 1;
  const paginationButtonBase =
    "min-w-[70px] px-3 py-1 rounded flex items-center justify-center " +
    "bg-primary text-primary-foreground border border-border " +
    "hover:opacity-90 disabled:opacity-40";

  const startIndex = safeTotal === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex =
    safeTotal === 0 ? 0 : Math.min(safePage * itemsPerPage, safeTotal);
  const { t } = useTranslation();

  // Calculate range of pages to show
  const pageRange = 3; // Number of pages before and after the current page to show
  let pages = [];
  for (
    let i = Math.max(1, safePage - pageRange);
    i <= Math.min(totalPages, safePage + pageRange);
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border">
      <div className="text-sm text-muted-foreground">
        {safeTotal === 0
          ? t("noTransactionsFound")
          : `${t("showingTransactions")} ${startIndex} ${t(
              "toTransactions"
            )} ${endIndex} ${t("ofTransactions")} ${safeTotal} ${t(
              "Transactions"
            )}`}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className={paginationButtonBase}
        >
          Previous
        </button>

        {/* First Page Button */}
        {safePage > 4 && (
          <button
            onClick={() => setCurrentPage(1)}
            className={`min-w-[40px] px-3 py-1 rounded flex items-center justify-center border bg-background text-foreground hover:bg-muted`}
          >
            1
          </button>
        )}

        {/* Ellipsis if there is a gap between pages */}
        {safePage > 5 && (
          <span className="min-w-[40px] px-3 py-1 rounded flex items-center justify-center text-muted-foreground">
            ...
          </span>
        )}

        {/* Page Number Buttons */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`min-w-[40px] px-3 py-1 rounded flex items-center justify-center border ${
              safePage === p
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Ellipsis if there is a gap between pages */}
        {safePage < totalPages - 4 && (
          <span className="min-w-[40px] px-3 py-1 rounded flex items-center justify-center text-muted-foreground">
            ...
          </span>
        )}

        {/* Last Page Button */}
        {safePage < totalPages - 3 && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`min-w-[40px] px-3 py-1 rounded flex items-center justify-center border bg-background text-foreground hover:bg-muted`}
          >
            {totalPages}
          </button>
        )}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
          className={paginationButtonBase}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsPagination;
