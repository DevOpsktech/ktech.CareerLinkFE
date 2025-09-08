import { Button } from "../ui/Button";

export default function ShareJob({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Share This Job
      </h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigator.clipboard.writeText(window.location.href)} 
          
        >
          Copy Link 
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() =>
            window.open(
              `mailto:?subject=${encodeURIComponent(
                job.title
              )} at ${encodeURIComponent(
                job.company
              )}&body=${encodeURIComponent(window.location.href)}`,
              "_blank"
            )
          }
        >
          Share via Email
        </Button>
      </div>
    </div>
  );
}
