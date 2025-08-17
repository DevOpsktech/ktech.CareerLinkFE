import { Button } from "../../ui/Button";

export function JobPagination({ pagination, onPageChange, loading }: any) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="text-center pt-6 flex justify-center items-center space-x-4">
      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1 || loading}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages || loading}
      >
        Next
      </Button>
    </div>
  );
}
