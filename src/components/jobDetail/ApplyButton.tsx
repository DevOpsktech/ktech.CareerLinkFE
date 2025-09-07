import { Button } from "../ui/Button";

export default function ApplyButton({
  user,
  hasApplied,
  applyingToJob,
  onApplyClick,
}) {
  if (user?.role !== "Student") return null;

  return hasApplied ? (
    <Button variant="secondary" size="lg" disabled className="w-full lg:w-auto">
      Already applied
    </Button>
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
