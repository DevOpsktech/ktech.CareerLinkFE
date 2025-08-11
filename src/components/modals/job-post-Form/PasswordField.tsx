import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generatePassword?: () => void;
}

export function PasswordField({
  id,
  name,
  label,
  value,
  error,
  showPassword,
  onToggleShowPassword,
  onChange,
  generatePassword,
}: PasswordFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {generatePassword && (
          <button
            type="button"
            onClick={generatePassword}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Generate Strong Password
          </button>
        )}
      </div>
      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error ? "border-red-300" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
