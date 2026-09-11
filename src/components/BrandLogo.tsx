import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'symbol';
  theme?: 'auto' | 'light' | 'dark' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  // Height / scale presets
  const sizeClasses = {
    sm: variant === 'symbol' ? 'h-6 w-6' : 'h-6 w-auto',
    md: variant === 'symbol' ? 'h-8 w-8' : 'h-8 w-auto',
    lg: variant === 'symbol' ? 'h-10 w-10' : 'h-10 w-auto',
    xl: variant === 'symbol' ? 'h-14 w-14' : 'h-12 w-auto',
    custom: '',
  }[size];

  // Star geometry with rounded tips
  const starPath =
    'M 155 16 C 156.2 16 157.3 16.8 157.7 18 L 163.5 33.5 L 179.8 34.6 C 181.1 34.7 182.2 35.7 182.5 37 C 182.9 38.3 182.4 39.6 181.3 40.4 L 168.7 50.2 L 172.9 66.2 C 173.2 67.5 172.7 68.8 171.6 69.6 C 170.5 70.4 169.1 70.4 168 69.5 L 155 60.3 L 142 69.5 C 140.9 70.4 139.5 70.4 138.4 69.6 C 137.3 68.8 136.8 67.5 137.1 66.2 L 141.3 50.2 L 128.7 40.4 C 127.6 39.6 127.1 38.3 127.5 37 C 127.8 35.7 128.9 34.7 130.2 34.6 L 146.5 33.5 L 152.3 18 C 152.7 16.8 153.8 16 155 16 Z';

  const symbolStarPath =
    'M 155 24 C 156.2 24 157.3 24.8 157.7 26 L 163.5 41.5 L 179.8 42.6 C 181.1 42.7 182.2 43.7 182.5 45 C 182.9 46.3 182.4 47.6 181.3 48.4 L 168.7 58.2 L 172.9 74.2 C 173.2 75.5 172.7 76.8 171.6 77.6 C 170.5 78.4 169.1 78.4 168 77.5 L 155 68.3 L 142 77.5 C 140.9 78.4 139.5 78.4 138.4 77.6 C 137.3 76.8 136.8 75.5 137.1 74.2 L 141.3 58.2 L 128.7 48.4 C 127.6 47.6 127.1 46.3 127.5 45 C 127.8 43.7 128.9 42.7 130.2 42.6 L 146.5 41.5 L 152.3 26 C 152.7 24.8 153.8 24 155 24 Z';

  // Dynamic color classes based on theme
  const isPurple = theme === 'purple';
  const qColorClass = isPurple ? 'fill-white' : 'fill-[#7B2FFF]';
  const iStemClass = isPurple ? 'fill-white' : 'fill-[#7B2FFF]';
  const starColor = '#FFA800';

  const ndicaColorClass = isPurple
    ? 'fill-[#232733]'
    : theme === 'light'
    ? 'fill-[#232733]'
    : theme === 'dark'
    ? 'fill-white'
    : 'fill-[#232733] dark:fill-white'; // auto

  const ndicaDefaultFill = isPurple ? '#232733' : theme === 'dark' ? '#FFFFFF' : '#232733';

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} ${className} shrink-0`}
        aria-label="Qindica"
      >
        {isPurple && <rect width="200" height="200" rx="44" fill="#7B2FFF" />}
        <g transform="translate(100, 100) scale(0.70) translate(-96, -93)">
          {/* Letter Q */}
          <path
            d="M 68 36 C 33 36 10 59 10 94 C 10 129 33 152 68 152 C 78.5 152 88.5 149.2 97.2 144.1 L 115.8 162.7 C 119.2 166.1 124.8 166.1 128.2 162.7 C 131.6 159.3 131.6 153.7 128.2 150.3 L 110.1 132.2 C 118.9 122.3 124 109 124 94 C 124 59 101 36 68 36 Z M 68 60 C 86.8 60 99 74.5 99 94 C 99 105.2 93.8 115 85.4 120.6 L 79.2 114.4 C 75.8 111 70.2 111 66.8 114.4 C 63.4 117.8 63.4 123.4 66.8 126.8 L 71.2 131.2 C 70.1 131.7 69.1 132 68 132 C 49.2 132 35 113.2 35 94 C 35 74.8 49.2 60 68 60 Z"
            className={qColorClass}
          />

          {/* Letter i stem */}
          <rect x="144" y="90" width="22" height="62" rx="11" className={iStemClass} />

          {/* Star dot on top of i */}
          <path
            d={symbolStarPath}
            fill={starColor}
            stroke={starColor}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  return (
    <div className="inline-flex flex-col text-left">
      <svg
        viewBox="0 0 540 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} ${className} shrink-0`}
        aria-label="Qindica"
      >
        {isPurple && <rect width="540" height="180" rx="36" fill="#7B2FFF" />}
        <g transform="translate(14, 0)">
          {/* Letter Q */}
          <path
            d="M 68 28 C 33 28 10 51 10 86 C 10 121 33 144 68 144 C 78.5 144 88.5 141.2 97.2 136.1 L 115.8 154.7 C 119.2 158.1 124.8 158.1 128.2 154.7 C 131.6 151.3 131.6 145.7 128.2 142.3 L 110.1 124.2 C 118.9 114.3 124 101 124 86 C 124 51 101 28 68 28 Z M 68 52 C 86.8 52 99 66.5 99 86 C 99 97.2 93.8 107 85.4 112.6 L 79.2 106.4 C 75.8 103 70.2 103 66.8 106.4 C 63.4 109.8 63.4 115.4 66.8 118.8 L 71.2 123.2 C 70.1 123.7 69.1 124 68 124 C 49.2 124 35 105.2 35 86 C 35 66.8 49.2 52 68 52 Z"
            className={qColorClass}
          />

          {/* Letter i stem */}
          <rect x="144" y="82" width="22" height="62" rx="11" className={iStemClass} />

          {/* Star dot on top of i */}
          <path
            d={starPath}
            fill={starColor}
            stroke={starColor}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* "ndica" in pristine, non-overlapping geometric rounded typography */}
          <text
            x="180"
            y="144"
            fontFamily="'Nunito', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="120"
            fontWeight="900"
            letterSpacing="-2px"
            fill={ndicaDefaultFill}
            className={ndicaColorClass}
          >
            ndica
          </text>
        </g>
      </svg>
      {showTagline && (
        <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 leading-none mt-1 tracking-wider uppercase">
          Rede de Indicações
        </span>
      )}
    </div>
  );
};
