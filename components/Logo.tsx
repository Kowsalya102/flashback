import React from "react";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({
  showWordmark = true,
  className = "",
  size = 32
}) => {
  const gradientId = "flashback-chip-gradient";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Hexagonal IC Chip SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon IC Chip outline */}
        <polygon
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill="#0A0A0F"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* IC Pins on Hexagon sides */}
        <line x1="2" y1="18" x2="6" y2="18" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="30" x2="6" y2="30" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="18" x2="46" y2="18" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="30" x2="46" y2="30" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />

        {/* Memory Recall Circular Arrow looping back into center */}
        <path
          d="M 24,14 A 10,10 0 1,1 15,22"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Arrow head pointing into center dot */}
        <polygon
          points="15,18 20,22 13,24"
          fill="#06B6D4"
        />
        {/* Central Core Memory Node */}
        <circle cx="24" cy="24" r="3" fill="#06B6D4" />
      </svg>

      {/* Geometric Wordmark */}
      {showWordmark && (
        <span className="font-sans text-xl font-bold tracking-tighter text-white">
          flash<span className="gradient-brand-text font-black">back</span>
        </span>
      )}
    </div>
  );
};
