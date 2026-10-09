import React from 'react';

/**
 * 이벤트 보상 표시용 "모바일 커피 쿠폰" 모양 카드.
 * 상표 로고는 쓰지 않고 글자로만 상품명을 표기합니다.
 */
export const CoffeeCouponCard: React.FC<{ label: string; note: string }> = ({ label, note }) => (
  <div className="relative rounded-2xl bg-gradient-to-br from-[#0B5D3B] via-[#0E6B45] to-[#0A4D31] text-white shadow-lg overflow-hidden">
    {/* 쿠폰 절취선 구멍 */}
    <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white" aria-hidden="true" />
    <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white" aria-hidden="true" />
    <div className="absolute inset-y-3 left-[68%] border-l-2 border-dashed border-white/30" aria-hidden="true" />

    <div className="flex items-stretch">
      <div className="flex-1 p-4 pr-3">
        <p className="text-[10px] font-black tracking-wider text-emerald-200">{label}</p>
        <p className="mt-1 text-lg font-black leading-tight">스타벅스 커피 1잔</p>
        <p className="mt-0.5 text-[11px] text-emerald-100/90">MOBILE COUPON · 모바일 쿠폰</p>
        <p className="mt-2 text-[10px] text-emerald-100/70">{note}</p>
      </div>
      <div className="w-[32%] flex flex-col items-center justify-center gap-1 p-2">
        <span className="text-4xl leading-none" aria-hidden="true">☕</span>
        <span className="text-[10px] font-black text-emerald-200">GIFT</span>
      </div>
    </div>
  </div>
);
