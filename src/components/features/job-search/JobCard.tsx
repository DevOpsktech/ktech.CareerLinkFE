/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building, MapPin, Clock } from "lucide-react";
import { Button } from "../../ui/Button";
import {
  formatJobType,
  formatPostedDate,
} from "../../jobDetail/JobDetailFunctions";

interface JobCardProps {
  job: any; // ideally type Job
  user: any;
  onViewDetails: () => void;
  onApply: () => void;
  applying: boolean;
  hasApplied?: boolean;
}

export function JobCard({
  job,
  user,
  onViewDetails,
  onApply,
  applying,
  hasApplied,
}: JobCardProps) {
  // Helper function to safely render values
  const safeRender = (value: any, fallback: string = "N/A"): string => {
    if (value == null) return fallback;
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "object" && value.$ref) {
      return fallback;
    }
    if (typeof value === "object") {
      return fallback;
    }
    return String(value);
  };

  const getCompanyName = (job: any): string => {
    const company =
      job.company?.name || job.company || job.employer?.company?.title;
    return safeRender(company, "Company");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {safeRender(job.title, "Job Title")}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Building size={16} className="mr-1" />
              {getCompanyName(job)}
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {safeRender(job.location, "Location not specified")}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {formatJobType(job.type)}
            </div>
            {/* <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              {formatSalary(job)}
            </div> */}
          </div>
          <p className="text-gray-700 mb-3">
            {safeRender(job.description, "No description available")}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {(Array.isArray(job.skills) ? job.skills : [])
              .filter(
                (skill: any) => skill != null && typeof skill === "string"
              )
              .map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full uppercase"
                >
                  {skill}
                </span>
              ))}
          </div>
          <p className="text-xs text-gray-500">
            Posted {formatPostedDate(job.postedDate)}
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 space-y-2">
          <Button
            variant="outline"
            size="md"
            onClick={onViewDetails}
            className="w-full md:w-auto mr-2"
          >
            View Details
          </Button>
          {user?.role === "Student" &&
            (hasApplied ? (
              <Button
                variant="secondary"
                size="md"
                disabled
                className="w-full md:w-auto"
              >
                Already applied
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={onApply}
                disabled={applying}
                className="w-full md:w-auto"
              >
                {applying ? "Applying..." : "Quick Apply"}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
