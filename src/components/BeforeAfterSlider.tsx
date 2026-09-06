import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = '청소 전 (Before)',
  afterLabel = '청소 후 (After)',
  title,
  description,
  className = ''
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${className}`}>
      {/* Visual Header if title provided */}
      {title && (
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-900 text-base">{title}</h4>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3 text-blue-600" />
              좌우로 슬라이드하여 비교
            </span>
          </div>
        </div>
      )}

      {/* Comparison Stage */}
      <div
        ref={containerRef}
        className="relative w-full aspect-16/10 sm:aspect-16/9 select-none overflow-hidden cursor-ew-resize bg-slate-950"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* After Image (Base) */}
        <img
          src={afterImage}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-blue-600/90 backdrop-blur-md text-white font-bold text-xs shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          {afterLabel}
        </div>

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'
            }}
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-slate-200 font-bold text-xs shadow-md">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center border-2 border-blue-600 transition-transform hover:scale-110">
            <ArrowLeftRight className="w-4 h-4 text-blue-700" />
          </div>
        </div>
      </div>

      {/* Preset quick buttons */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <button
          type="button"
          onClick={() => setSliderPosition(100)}
          className="px-3 py-1 rounded-md hover:bg-slate-200 font-medium transition-colors"
        >
          청소 전만 보기
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className="px-3 py-1 rounded-md bg-white border border-slate-200 text-blue-700 font-bold shadow-xs hover:bg-blue-50 transition-colors"
        >
          50% 비교
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(0)}
          className="px-3 py-1 rounded-md hover:bg-slate-200 font-medium transition-colors"
        >
          청소 후만 보기
        </button>
      </div>
    </div>
  );
};
