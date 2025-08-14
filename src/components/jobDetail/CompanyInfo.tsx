import { Building, MapPin, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";

export default function CompanyInfo({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        About {job.company}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <Building className="w-5 h-5 text-gray-400 mr-3" />
          <span className="text-sm text-gray-700">{job.company}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
          <span className="text-sm text-gray-700">{job.location}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 flex items-center justify-center"
          onClick={() =>
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(
                job.company
              )}`,
              "_blank"
            )
          }
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          <span className="text-sm lg:text-xs">Learn More About Company</span>
        </Button>
      </div>
    </div>
  );
}
