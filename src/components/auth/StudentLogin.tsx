import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { GraduationCap, AlertCircle } from "lucide-react";

export function StudentLogin() {
  const { loginWithMicrosoft, isLoading, error } = useAuth();

  const handleMicrosoftLogin = async () => {
    await loginWithMicrosoft();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Student Login</h3>
        <p className="text-sm text-gray-600 mt-1">
          Sign in with your university Microsoft account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleMicrosoftLogin}
          variant="primary"
          size="lg"
          className="w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 flex items-center justify-center"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
          </svg>
          {isLoading ? "Signing In..." : "Sign in with Microsoft"}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
