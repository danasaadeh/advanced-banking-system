import React from "react";
import { useTranslation } from "react-i18next";

interface AccountsPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const AccountsPagination: React.FC<AccountsPaginationProps> = ({
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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border">
      <div className="text-sm text-muted-foreground">
        {safeTotal === 0
          ? "no accounts Found"
          : ` ${startIndex} to ${endIndex} of  ${safeTotal} ${t(
              "Accounts"
            )}`}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className={paginationButtonBase}
        >
          Previous
        </button>

        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`
      min-w-[40px] px-3 py-1 rounded
      flex items-center justify-center
      border
      ${
        safePage === p
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground hover:bg-muted"
      }
    `}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage(Math.min(totalPages || 1, safePage + 1))
          }
          disabled={safePage === totalPages}
          className={paginationButtonBase}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountsPagination;
