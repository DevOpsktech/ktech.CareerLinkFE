import { CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";

export default function ApplyButton({
  user,
  hasApplied,
  applyingToJob,
  onApplyClick,
}) {
  if (user?.role !== "student") return null;

  return hasApplied ? (
    <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
      <CheckCircle className="w-5 h-5 mr-2" />
      <span className="font-medium">Applied</span>
    </div>
  ) : (
    <Button
      onClick={onApplyClick}
      variant="secondary"
      size="lg"
      disabled={applyingToJob}
      className="w-full lg:w-auto"
    >
      {applyingToJob ? "Applying..." : "Apply Now"}
    </Button>
  );
}
