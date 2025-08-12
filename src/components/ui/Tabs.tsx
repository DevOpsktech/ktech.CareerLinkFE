import React from "react";

interface TabProps {
  tabs: {
    key: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
  }[];
  activeTab: string;
  setActiveTab: (key: string) => void;
  activeTabFor: "employer" | "student";
}

const Tabs: React.FC<TabProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  activeTabFor,
}) => {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-xs lg:text-sm transition-colors ${
                activeTab === key
                  ? activeTabFor === "employer"
                    ? "border-blue-600 text-blue-600"
                    : "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
