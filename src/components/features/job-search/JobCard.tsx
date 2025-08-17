/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "../../ui/Button";

interface JobCardProps {
  job: any; // ideally type Job
  user: any;
  onViewDetails: () => void;
  onApply: () => void;
  applying: boolean;
}

export function JobCard({
  job,
  user,
  onViewDetails,
  onApply,
  applying,
}: JobCardProps) {
  const formatSalary = (job: any) => {
    if (!job.salary) return "Salary not specified";
    const { min, max, period } = job.salary;
    const formatAmount = (a: number) =>
      period === "hourly" ? `$${a}` : `${a.toLocaleString()}`;
    if (min && max)
      return `${formatAmount(min)} - ${formatAmount(max)}${
        period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
      }`;
    if (min)
      return `From ${formatAmount(min)}${
        period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
      }`;
    return "Competitive salary";
  };

  const formatJobType = (type: string) =>
    type
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Building size={16} className="mr-1" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {formatJobType(job.type)}
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              {formatSalary(job)}
            </div>
          </div>
          <p className="text-gray-700 mb-3">{job.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
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
          {user?.role === "student" && (
            <Button
              variant="secondary"
              size="md"
              onClick={onApply}
              disabled={applying}
              className="w-full md:w-auto"
            >
              {applying ? "Applying..." : "Quick Apply"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
