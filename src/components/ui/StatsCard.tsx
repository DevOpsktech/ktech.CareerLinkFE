import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500 text-blue-50";
      case "green":
        return "bg-green-500 text-green-50";
      case "purple":
        return "bg-purple-500 text-purple-50";
      case "red":
        return "bg-red-500 text-red-50";
      case "yellow":
        return "bg-yellow-500 text-yellow-50";
      default:
        return "bg-gray-500 text-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
