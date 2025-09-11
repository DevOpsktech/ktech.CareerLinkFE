import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLanguage(newLanguage);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Language Switcher */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-tertiary transition-colors text-primary"
          title="Switch Language"
        >
          <Globe size={16} />
          <span className="text-sm font-medium">
            {language === "en" ? "EN" : "AR"}
          </span>
        </button>
        {isLanguageDropdownOpen && (
          <div
            className={`absolute top-full ${
              language === "ar" ? "right-0" : "left-0"
            } right-0 mt-1 w-32 bg-primary border border-primary rounded-lg shadow-theme-md z-50`}
          >
            <button
              onClick={() => handleLanguageChange("en")}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-lg ${
                language === "en"
                  ? "bg-lightest-blue text-dark-blue"
                  : "text-primary"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("ar")}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors last:rounded-b-lg ${
                language === "ar"
                  ? "bg-lightest-blue text-dark-blue"
                  : "text-primary"
              }`}
            >
              العربية
            </button>
          </div>
        )}
      </div>

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-tertiary transition-colors text-primary"
        title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </button>
    </div>
  );
};
