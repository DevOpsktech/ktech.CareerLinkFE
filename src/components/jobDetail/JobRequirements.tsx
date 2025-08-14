export default function JobRequirements({ requirements }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
      <ul className="space-y-2">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
