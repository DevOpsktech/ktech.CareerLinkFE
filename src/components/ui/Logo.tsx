import React, { useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "logo" | "emblem";
}

interface LogoConfig {
  light: string;
  dark: string;
  alt: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
  variant = "logo",
}) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  // Logo configurations
  const logoConfigs: Record<string, LogoConfig> = {
    logo: {
      light: "/lightlogo.png",
      dark: "/darklogo.png",
      alt: "ktech Logo",
    },
    emblem: {
      light: "/darkemblem.png",
      dark: "/lightemblem.png",
      alt: "ktech Emblem",
    },
  };

  const config = logoConfigs[variant];
  const logoSrc = theme === "dark" ? config.dark : config.light;

  // Preload the opposite theme logo for smoother transitions
  useEffect(() => {
    const oppositeLogoSrc = theme === "dark" ? config.light : config.dark;
    const img = new Image();
    img.src = oppositeLogoSrc;
  }, [theme, config.light, config.dark]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <img
        src={logoSrc}
        alt={config.alt}
        className={`${sizeClasses[size]} object-contain transition-opacity duration-300`}
      />
    </div>
  );
};

export const EmblemLogo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  return (
    <Logo
      size={size}
      showText={showText}
      className={className}
      variant="emblem"
    />
  );
};
