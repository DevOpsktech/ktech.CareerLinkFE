import {
  Building,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Eye,
} from "lucide-react";

export default function JobHeader({
  job,
  formatSalary,
  formatJobType,
  formatPostedDate,
  formatDeadline,
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
        <div className="flex items-center">
          <Building className="w-5 h-5 mr-2" />
          <span className="font-medium">{job.company}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{job.location}</span>
          {job.isRemote && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Remote
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span>{formatJobType(job.type)}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          <span>{formatSalary(job)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Posted {formatPostedDate(job.postedDate)}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {job.applicationCount} applications
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {job.viewCount} views
        </div>
        {job.applicationDeadline && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Deadline: {formatDeadline(job.applicationDeadline)}
          </div>
        )}
      </div>
    </div>
  );
}
