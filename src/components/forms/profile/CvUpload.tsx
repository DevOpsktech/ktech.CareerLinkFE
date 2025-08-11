import React from "react";
import { Upload } from "lucide-react";

interface CvUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CvUpload({ onFileUpload }: CvUploadProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload CV/Resume
      </h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="text-sm text-gray-600 mb-2">
          <label
            htmlFor="cv-upload"
            className="cursor-pointer text-teal-600 hover:text-teal-500"
          >
            Click to upload
          </label>
          <span> or drag and drop your CV</span>
        </div>
        <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
        <input
          id="cv-upload"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={onFileUpload}
        />
      </div>
    </div>
  );
}
