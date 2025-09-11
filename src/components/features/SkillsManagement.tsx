import React, { useMemo, useState } from "react";
import { useSkills } from "../../hooks/useSkills";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";

export function SkillsManagement() {
  const { skills = [], loading, createSkill } = useSkills();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      "Frontend Development",
      "Backend Development",
      "Database",
      "DevOps",
      "Mobile Development",
      "Design",
      "Project Management",
      "Other",
    ],
    []
  );

  const handleOpenAdd = () => {
    setError(null);
    setName("");
    setCategory("");
    setIsAddOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setError("Please provide name and category.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const created = await createSkill({
        name: name.trim(),
        category: category.trim(),
      });
      if (created) {
        setIsAddOpen(false);
        setName("");
        setCategory("");
      } else {
        setError("Failed to create skill");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the global skill taxonomy available across the platform.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Add Skill
        </Button>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="text-gray-500">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="text-gray-500">
            No skills found. Click "Add Skill" to create the first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {skill.id}</p>
                  </div>
                  <Badge variant="secondary">{skill.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => (!submitting ? setIsAddOpen(false) : undefined)}
        title="Add Skill"
        subtitle="Create a new skill that will be available for selection across the app"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., React, Kubernetes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !name.trim() || !category.trim()}
            >
              {submitting ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SkillsManagement;
