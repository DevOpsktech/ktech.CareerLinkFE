import { Button } from "../../ui/Button";

interface FormActionsProps {
  loading: boolean;
}

export function FormActions({ loading }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline">
        Save as Draft
      </Button>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Posting..." : "Post Job"}
      </Button>
    </div>
  );
}
