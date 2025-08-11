import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download, Star, X, Check } from "lucide-react";

interface Student {
  id: string | number;
  [key: string]: any;
}

interface StudentActionsMenuProps {
  student: Student;
  onViewCv?: (cvUrl: string) => void;
  onShortlist?: (student: Student) => void;
  onRemove?: (student: Student) => void;
  onAccept?: (student: Student) => void;
}

export function StudentActionsMenu({
  student,
  onViewCv,
  onShortlist,
  onRemove,
  onAccept,
}: StudentActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-1 text-sm text-gray-700">
            {onViewCv && (
              <li>
                <button
                  onClick={() => {
                    onViewCv(student.cvUrl);
                    setOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                >
                  <Download size={14} className="mr-2" /> View CV
                </button>
              </li>
            )}
            {onShortlist && (
              <li>
                <button
                  onClick={() => {
                    onShortlist(student);
                    setOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                >
                  <Star size={14} className="mr-2" /> Shortlist
                </button>
              </li>
            )}
            {onAccept && (
              <li>
                <button
                  onClick={() => {
                    onAccept(student);
                    setOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                >
                  <Check size={14} className="mr-2" /> Accept
                </button>
              </li>
            )}
            {onRemove && (
              <li>
                <button
                  onClick={() => {
                    onRemove(student);
                    setOpen(false);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-red-600"
                >
                  <X size={14} className="mr-2" /> Remove
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
