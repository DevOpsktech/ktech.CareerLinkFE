export default function JobSummary({
  job,
  formatSalary,
  formatJobType,
  formatPostedDate,
  formatDeadline,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
      <div className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Job Type</dt>
          <dd className="text-sm text-gray-900 mt-1">
            {formatJobType(job.type)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            Experience Level
          </dt>
          <dd className="text-sm text-gray-900 mt-1 capitalize">
            {String(job.experienceLevel).toLowerCase()}
          </dd>
        </div>
        {job.location && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="text-sm text-gray-900 mt-1">
              {job.location}
              {job.isRemote && (
                <span className="block text-green-600">
                  Remote work available
                </span>
              )}
            </dd>
          </div>
        )}
        {/* {(job.salary || job.salaryMin != null || job.salaryMax != null) && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Salary</dt>
            <dd className="text-sm text-gray-900 mt-1">{formatSalary(job)}</dd>
          </div>
        )} */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Posted</dt>
          <dd className="text-sm text-gray-900 mt-1">
            {formatPostedDate(job.postedDate)}
          </dd>
        </div>
        {job.applicationDeadline && (
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Application Deadline
            </dt>
            <dd className="text-sm text-gray-900 mt-1">
              {formatDeadline(job.applicationDeadline)}
            </dd>
          </div>
        )}
      </div>
    </div>
  );
}
