import { Button } from "../../ui/Button";

type Pagination = {
  page?: number;
  totalPages?: number;
};

interface Props {
  pagination?: Pagination | null;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function JobPagination({
  pagination,
  onPageChange,
  loading = false,
}: Props) {
  if (!pagination) return null;
  const currentPage = typeof pagination.page === "number" ? pagination.page : 1;
  const totalPages =
    typeof pagination.totalPages === "number" ? pagination.totalPages : 1;
  if (totalPages <= 1) return null;

  return (
    <div className="text-center pt-6 flex justify-center items-center space-x-4">
      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
      >
        Next
      </Button>
    </div>
  );
}
