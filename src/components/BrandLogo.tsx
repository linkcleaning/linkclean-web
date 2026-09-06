import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const imageSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Character Logo Container */}
      <div
        className={`${imageSizes[size]} flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-white/10 border border-white/20 shadow-sm backdrop-blur-xs group-hover:bg-white/20'
            : 'bg-white border border-slate-200/80 shadow-xs group-hover:border-[#38BDF8] group-hover:shadow-sm'
        } p-0.5 shrink-0`}
      >
        {!imgError ? (
          <img
            src="/logo.png?v=2"
            alt="링크클린 캐릭터 로고"
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-200"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* SVG Cleaner Character Fallback */
          <div className="w-full h-full bg-[#0A1D37] text-[#38BDF8] flex items-center justify-center font-black text-xs">
            LC
          </div>
        )}
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-2">
        <span
          className={`font-black ${textSizes[size]} tracking-tight ${
            isDark ? 'text-white' : 'text-[#0A1D37]'
          }`}
        >
          LINKCLEAN
        </span>
        {showBadge && (
          <span
            className={`hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                : 'bg-[#38BDF8]/10 text-[#0284C7] border border-[#38BDF8]/20'
            }`}
          >
            링크클린
          </span>
        )}
      </div>
    </div>
  );
};
