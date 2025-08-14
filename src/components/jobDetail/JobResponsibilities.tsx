export default function JobResponsibilities({ responsibilities }) {
  if (!responsibilities?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Key Responsibilities
      </h2>
      <ul className="space-y-2">
        {responsibilities.map((item, i) => (
          <li key={i} className="flex items-start">
            <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
