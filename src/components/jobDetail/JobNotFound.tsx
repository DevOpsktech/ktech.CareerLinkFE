import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JobNotFound = ({ error }: { error?: any }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Job Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "The job you are looking for does not exist."}
        </p>
        <Button onClick={() => navigate(-1)} variant="primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default JobNotFound;
