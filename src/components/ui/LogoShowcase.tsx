import React from "react";
import { Logo, EmblemLogo } from "./Logo";
import { useTheme } from "../../hooks/useTheme";

export const LogoShowcase: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 bg-primary rounded-lg shadow-theme-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Logo Showcase</h2>
        <p className="text-secondary">
          Current theme:{" "}
          <span className="font-semibold capitalize">{theme}</span>
        </p>
        <button onClick={toggleTheme} className="mt-2 btn-primary">
          Switch Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Logo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Main Logo</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-secondary mb-2">Small with text:</p>
              <Logo size="sm" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Medium with text:</p>
              <Logo size="md" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Large with text:</p>
              <Logo size="lg" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Icon only:</p>
              <Logo size="md" showText={false} />
            </div>
          </div>
        </div>

        {/* Emblem Logo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Emblem Logo</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-secondary mb-2">Small with text:</p>
              <EmblemLogo size="sm" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Medium with text:</p>
              <EmblemLogo size="md" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Large with text:</p>
              <EmblemLogo size="lg" showText={true} />
            </div>

            <div>
              <p className="text-sm text-secondary mb-2">Icon only:</p>
              <EmblemLogo size="md" showText={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-secondary rounded-lg">
        <h4 className="text-md font-semibold text-primary mb-2">
          Usage Examples:
        </h4>
        <div className="text-sm text-secondary space-y-1">
          <p>
            <code className="bg-tertiary px-2 py-1 rounded">
              &lt;Logo size="md" showText={true} /&gt;
            </code>
          </p>
          <p>
            <code className="bg-tertiary px-2 py-1 rounded">
              &lt;EmblemLogo size="sm" showText={false} /&gt;
            </code>
          </p>
          <p>
            <code className="bg-tertiary px-2 py-1 rounded">
              &lt;Logo variant="emblem" size="lg" /&gt;
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
