import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { GraduationCap, AlertCircle, Mail, Lock, User } from "lucide-react";

export function StudentLogin() {
  const { login, register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering) {
      const success = await register({
        email: credentials.email,
        password: credentials.password,
        fullName: credentials.fullName,
        role: "Student",
      });
      if (success) {
        // After successful registration, log in
        const loginSuccess = await login({
          email: credentials.email,
          password: credentials.password,
        });
        if (loginSuccess) {
          navigate("/student", { replace: true });
        }
      }
    } else {
      const success = await login({
        email: credentials.email,
        password: credentials.password,
      });
      if (success) {
        navigate("/student", { replace: true });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isRegistering ? "Student Registration" : "Student Login"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {isRegistering
            ? "Create your student account"
            : "Sign in to your student account"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <div>
            <label
              htmlFor="student-fullname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                id="student-fullname"
                name="fullName"
                required={isRegistering}
                value={credentials.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="student-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              id="student-email"
              name="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="your-email@university.edu"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="student-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="password"
              id="student-password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
          disabled={isLoading}
        >
          {isLoading
            ? isRegistering
              ? "Creating Account..."
              : "Signing In..."
            : isRegistering
            ? "Create Account"
            : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "Don't have an account? Register"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
