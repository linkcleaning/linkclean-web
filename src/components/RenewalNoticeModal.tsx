import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, Clock, X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface RenewalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenewalNoticeModal: React.FC<RenewalNoticeModalProps> = ({ isOpen, onClose }) => {
  const [dontShowToday, setDontShowToday] = useState(false);

  // Close with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowToday) {
      const today = new Date().toISOString().split('T')[0];
      try {
        localStorage.setItem('linkclean_dismiss_renewal_date', today);
      } catch {
        // ignore
      }
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="renewal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Small pop-up window (조그마한 새창) */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 select-none">
        {/* Top Header Banner with Deep Blue Tone */}
        <div className="bg-[#0A1D37] text-white px-5 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-[#38BDF8] tracking-wider uppercase">
              공지사항 • NOTICE
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="닫기"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Logo & Headline */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-6 h-6 text-amber-500 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0284C7] text-[11px] font-bold mb-1 border border-blue-100">
                🛠️ 홈페이지 리뉴얼 진행 중
              </div>
              <h2 id="renewal-modal-title" className="text-base sm:text-lg font-extrabold text-[#0A1D37] leading-snug">
                예약 및 이벤트 기능 준비 중 안내
              </h2>
            </div>
          </div>

          {/* Description Text */}
          <div className="bg-slate-50 rounded-2xl p-3.5 text-xs text-slate-600 leading-relaxed border border-slate-100 space-y-2">
            <p className="font-semibold text-slate-800">
              현재 링크클린 홈페이지는 더욱 편리한 서비스 제공을 위해 <span className="text-[#0284C7] font-bold">시스템 리뉴얼</span>을 진행하고 있습니다.
            </p>
            <p className="text-slate-600">
              이에 따라 <span className="font-bold text-slate-800">온라인 예약 및 이벤트 등 일부 기능이 준비 중</span>에 있습니다. 이용에 불편을 드려 죄송합니다.
            </p>
            <p className="text-slate-700 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 font-medium">
              💡 <strong className="text-amber-900 font-bold">청소 예약 및 견적 문의</strong>가 있으신 고객님께서는 <strong className="text-blue-700 underline font-bold">전화로 문의</strong>해 주시면 즉시 친절하고 빠른 상담 및 예약 접수가 가능합니다.
            </p>
          </div>

          {/* Direct Phone Call Action Card */}
          <div className="bg-gradient-to-br from-[#0A1D37] to-[#132742] rounded-2xl p-4 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#38BDF8] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                대표 전화 문의 상담
              </span>
              <span className="text-[10px] text-slate-300 font-medium bg-white/10 px-2 py-0.5 rounded-full">
                연중무휴 상담
              </span>
            </div>

            <a
              href="tel:064-763-4545"
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-extrabold text-base tracking-wide shadow-sm hover:shadow transition-all group cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              <span>064-763-4545</span>
              <span className="text-xs font-semibold opacity-90">(터치 시 바로 통화 연결)</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5 px-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#38BDF8]" />
                상담시간: 08:00 ~ 20:00
              </span>
              <span className="text-[10px] text-slate-400">
                제주 전지역 출장 견적 가능
              </span>
            </div>
          </div>

          {/* Footer Controls: Don't show today & Close button */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-4 h-4 text-[#0284C7] rounded border-slate-300 focus:ring-[#38BDF8] cursor-pointer"
              />
              <span className="text-xs text-slate-500 font-medium hover:text-slate-800">
                오늘 하루 보지 않기
              </span>
            </label>

            <button
              type="button"
              onClick={handleDismiss}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              확인 (닫기)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
