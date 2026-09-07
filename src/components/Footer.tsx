import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, ShieldCheck, Award, ExternalLink, ChevronDown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { goToReservationWithService } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <footer className="bg-[#0A1D37] text-slate-400 py-6 lg:py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Top Row: Logo + Quick Contact + Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          {/* Brand & Trust Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <BrandLogo variant="dark" size="sm" showBadge={false} />
            <span className="text-slate-400 text-xs hidden md:inline">|</span>
            <span className="text-slate-400 text-xs hidden md:inline">현장 실측 100% · 합리적인 청소 견적</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                배상책임보험 가입
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                <Award className="w-3 h-3 text-[#38BDF8]" />
                친환경 안심시공
              </span>
            </div>
          </div>

          {/* Contact & Social Quick Buttons */}
          <div className="flex items-center gap-3 text-xs">
            <a
              href="tel:064-763-4545"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#38BDF8] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>064-763-4545</span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(연중무휴 08:30~20:00)</span>
            </a>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/80">
              <a
                href="https://blog.naver.com/linkcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded text-[11px] font-medium transition-colors"
                title="공식 네이버 블로그"
              >
                블로그
              </a>
              <a
                href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 rounded text-[11px] font-medium transition-colors"
                title="카카오톡 1:1 상담"
              >
                카톡상담
              </a>
              <a
                href="https://www.instagram.com/linkcleaning/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-pink-950/60 hover:bg-pink-900/60 text-pink-300 rounded text-[11px] font-medium transition-colors"
                title="공식 인스타그램"
              >
                인스타
              </a>
            </div>
          </div>
        </div>

        {/* Compact Legal & Company Info */}
        <div className="pt-4 text-xs text-slate-400 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs">
              <span className="font-semibold text-slate-300">링크클린</span>
              <span>대표이사: 한승우</span>
              <span className="hidden sm:inline">·</span>
              <span>사업자등록번호: 687-54-00154</span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                linkdole@naver.com
              </span>
            </div>

            {/* Mobile Toggle Button for Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="sm:hidden text-[11px] text-slate-400 hover:text-white flex items-center gap-1 self-start cursor-pointer py-1"
            >
              <span>사업장 소재지 및 세부정보</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Address Details: Always visible on Desktop, collapsible on Mobile */}
          <div className={`${showDetails ? 'block' : 'hidden'} sm:block text-[11px] text-slate-400 space-y-0.5`}>
            <p>제주시: 제주특별자치도 제주시 도령북길 8 제일상가 2층 | 서귀포시: 제주특별자치도 서귀포시 서호호근로 86-6</p>
            <p>개인정보책임관리자: 안심클린팀 | 통신판매업신고 완료</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>© 2016 LINKCLEAN Inc. All rights reserved.</div>
            <div className="text-[10px] text-slate-400">
              * 상단 [청소서비스] 및 [바로가기] 메뉴에서 모든 서비스와 세부 페이지로 바로 이동하실 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

