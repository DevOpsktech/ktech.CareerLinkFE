export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "reviewing":
      return "bg-blue-100 text-blue-800";
    case "shortlisted":
      return "bg-green-100 text-green-800";
    case "interview_scheduled":
      return "bg-purple-100 text-purple-800";
    case "interviewed":
      return "bg-indigo-100 text-indigo-800";
    case "offered":
      return "bg-green-100 text-green-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "withdrawn":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getRoleColor = (roleKey: string) => {
  switch (roleKey) {
    case "admin":
      return "from-red-500 to-red-600";
    case "employer":
      return "from-blue-500 to-blue-600";
    case "student":
      return "from-teal-500 to-teal-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
