import { CheckCircle } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
      <div>
        <h4 className="text-green-800 font-medium">
          Application Submitted Successfully!
        </h4>
        <p className="text-green-700 text-sm">
          Your application has been sent to the employer.
        </p>
      </div>
    </div>
  );
}
