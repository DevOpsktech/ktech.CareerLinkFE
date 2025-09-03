import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorBlockProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBlock({
  message,
  onRetry,
  className = "",
}: ErrorBlockProps) {
  return (
    <div
      className={`mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50/60 p-4 sm:p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-red-100 p-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            Something went wrong
          </p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={onRetry}>
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBlock;
