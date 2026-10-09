import React from 'react';
import { useApp } from '../context/AppContext';
import { RefundPolicyList } from '../components/RefundPolicyList';

/** 예약금 및 취소·환불 규정 페이지 (하단 링크·자주 묻는 질문에서 연결) */
export const RefundView: React.FC = () => {
  const { setCurrentView } = useApp();
  return (
    <div className="py-6 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1D37]">예약금 및 취소·환불 규정</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">예약 전에 꼭 확인해 주세요. 예약 시 이 규정에 동의하신 것으로 봅니다.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <RefundPolicyList />
        </div>
        <button
          type="button"
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0 });
          }}
          className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0A1D37] cursor-pointer"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};
