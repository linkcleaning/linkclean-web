import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, ExternalLink, ChevronDown, BookOpen, MessageCircle, Instagram } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { goToReservationWithService, setCurrentView, currentUser } = useApp();
  const [showDetails, setShowDetails] = useState(false);
const naverPhoneConversion = () => {
  const w = window as any;

  if (w.wcs) {
    if (!w.wcs_add) w.wcs_add = {};
    w.wcs_add['wa'] = 's_274563371b48';

    const _conv = {
      type: 'custom001'
    };

    w.wcs.trans(_conv);
  }
};
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
            {/* 친환경 안심시공 배지 */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-full text-emerald-300 font-bold">
                🌿 친환경 세제 사용
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                ♨️ 고온 스팀 살균
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                🌲 피톤치드 마무리
              </span>
            </div>
          </div>

          {/* Contact & Social Quick Buttons */}
          <div className="flex items-center gap-3 text-xs">
            <a
              href="tel:064-763-4545"
              onClick={naverPhoneConversion}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#38BDF8] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>064-763-4545</span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(연중무휴 08:30~20:00)</span>
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-700/80">
              {[
                {
                  href: 'https://blog.naver.com/linkcleaning',
                  title: '네이버 공식 블로그',
                  desc: '시공 전후 작업일지 & 청소 꿀팁',
                  emoji: '📝',
                  cls: 'bg-[#03C75A] text-white',
                  icon: <BookOpen className="w-4 h-4" />,
                },
                {
                  href: 'https://pf.kakao.com/_xfxdrxmM?from=qr',
                  title: '카카오톡 1:1 상담',
                  desc: '사진 보내고 빠른 채팅 상담',
                  emoji: '💬',
                  cls: 'bg-[#FEE500] text-[#371D1E]',
                  icon: <MessageCircle className="w-4 h-4 fill-[#371D1E]" />,
                },
                {
                  href: 'https://www.instagram.com/linkcleaning/',
                  title: '인스타그램 공식 채널',
                  desc: '@linkcleaning 청소 릴스 & 현장',
                  emoji: '📷',
                  cls: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
                  icon: <Instagram className="w-4 h-4" />,
                },
              ].map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={it.title}
                  className="group relative"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-110 ${it.cls}`}>
                    {it.icon}
                  </span>
                  {/* 마우스를 올리면 뜨는 말풍선 */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-2.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50 hidden sm:block"
                  >
                    <span className="relative flex items-center gap-2 whitespace-nowrap bg-[#0A1D37] text-white px-3 py-2 rounded-xl shadow-2xl border border-slate-700">
                      <span className="text-base leading-none">{it.emoji}</span>
                      <span className="text-left">
                        <span className="block text-xs font-bold">{it.title}</span>
                        <span className="block text-[10px] text-slate-300 font-normal">{it.desc}</span>
                      </span>
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 bg-[#0A1D37] border-r border-b border-slate-700" aria-hidden="true" />
                    </span>
                  </span>
                </a>
              ))}
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
            <p>
              개인정보책임관리자: 안심클린팀 ·{' '}
              <button
                type="button"
                onClick={() => {
                  setCurrentView('refund');
                  window.scrollTo({ top: 0 });
                }}
                className="underline underline-offset-2 hover:text-slate-200 cursor-pointer"
              >
                예약금·취소·환불 규정
              </button>
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span>© 2016 LINKCLEAN Inc. All rights reserved.</span>
              {/* 사장님 전용 관리자 로그인 (메뉴에서 로그인 버튼을 뺐기 때문에 여기 작게 둠) */}
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('login');
                    window.scrollTo({ top: 0 });
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline-offset-2 hover:underline cursor-pointer"
                >
                  관리자
                </button>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              * 상단 [청소서비스] 및 [바로가기] 메뉴에서 모든 서비스와 세부 페이지로 바로 이동하실 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

