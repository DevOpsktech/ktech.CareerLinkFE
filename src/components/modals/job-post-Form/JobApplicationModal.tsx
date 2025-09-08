import React, { useState } from "react";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";

interface JobApplicationModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  job: any;
  onClose: () => void;
  onSubmit: (data: { coverLetter: string; resumeUrl?: string }) => void;
  isSubmitting: boolean;
}

export function JobApplicationModal({
  job,
  onClose,
  onSubmit,
  isSubmitting,
}: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeFile: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeFile
          ? URL.createObjectURL(formData.resumeFile)
          : undefined,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          resume: "Please upload a PDF or Word document",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: "File size must be less than 5MB" });
        return;
      }

      setFormData({ ...formData, resumeFile: file });
      setErrors({ ...errors, resume: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Apply for Position" 
      subtitle={`${job.title} at ${job.company}`}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Job Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Position Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Company:</span> {job.company}
              </p>
              <p>
                <span className="font-medium">Location:</span> {job.location}
              </p>
              <p>
                <span className="font-medium">Type:</span> {job.type}
              </p>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Letter *
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={8}
              value={formData.coverLetter}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none ${
                errors.coverLetter ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Dear Hiring Manager,

I am writing to express my interest in the [Position Title] role at [Company Name]. With my background in [relevant field/experience], I am excited about the opportunity to contribute to your team.

[Explain why you're interested in this specific role and company]

[Highlight relevant skills, experiences, or achievements that make you a strong candidate]

[Conclude with enthusiasm and next steps]

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]"
              disabled={isSubmitting}
            />
            {errors.coverLetter && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.coverLetter}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.coverLetter.length}/1000 characters (minimum 50
              required)
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/CV (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
              {formData.resumeFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-8 w-8 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.resumeFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, resumeFile: null })
                    }
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600 mb-2">
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer text-teal-600 hover:text-teal-500 font-medium"
                    >
                      Click to upload
                    </label>
                    <span> or drag and drop your resume</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </>
              )}
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.resume && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.resume}
              </p>
            )}
          </div>

          {/* Application Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Application Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>
                • Customize your cover letter for this specific role and company
              </li>
              <li>
                • Highlight relevant skills and experiences mentioned in the job
                description
              </li>
              <li>
                • Keep your cover letter concise but compelling (200-400 words
                ideal)
              </li>
              <li>• Proofread for spelling and grammar errors</li>
              <li>• Show enthusiasm for the role and company</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="flex-1"
              disabled={isSubmitting || !formData.coverLetter.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
