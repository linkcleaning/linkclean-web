import React, { useState } from 'react';
import { BookOpen, X, ExternalLink } from 'lucide-react';

/**
 * 월간 링크 매거진 (자체 플립북: public/magazine/<호>/)
 * 첫 화면에는 작은 카드만 보이고, 누르면 창이 열려 책장을 넘기며 볼 수 있습니다.
 * 새 호가 나오면 아래 주소와 표지만 바꾸면 됩니다.
 */
const MAGAZINE = {
  title: '월간 링크 매거진',
  issue: '2호 · 12월호',
  url: '/magazine/2/',
  cover: '/magazine/2/pages/p-1.jpg',
};

export const MagazineCard: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const [open, setOpen] = useState(false);
  const [coverOk, setCoverOk] = useState(true);

  return (
    <section className={bare ? 'h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-full text-left rounded-2xl sm:rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-violet-50 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex items-center gap-3 sm:gap-5 cursor-pointer"
      >
        {/* 표지 (작게) */}
        <span className="relative w-14 h-[72px] sm:w-16 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-indigo-100 shadow-md ring-1 ring-indigo-200 flex items-center justify-center">
          {coverOk ? (
            <img
              src={MAGAZINE.cover}
              alt={`${MAGAZINE.title} ${MAGAZINE.issue} 표지`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setCoverOk(false)}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-6 h-6 text-indigo-500" />
          )}
          <span className="absolute top-0 left-0 bg-rose-500 text-white text-[8px] font-black px-1 py-px rounded-br">NEW</span>
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-[10px] sm:text-xs font-black text-indigo-600 tracking-wider">LINK MAGAZINE · {MAGAZINE.issue}</span>
          <span className="block text-base sm:text-xl font-black text-[#0A1D37]">📖 {MAGAZINE.title} 12월호</span>
          <span className="block text-[11px] sm:text-sm text-slate-500 truncate">9년의 출근길 · 겨울 결로 홈케어 · 비움 서비스와 앱 소개</span>
        </span>
        <span className="shrink-0 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-black">펼쳐보기</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6" onClick={() => setOpen(false)}>
          <div
            className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-black text-[#0A1D37] truncate">📖 {MAGAZINE.title} · {MAGAZINE.issue}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={MAGAZINE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 h-9 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">크게 보기</span>
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="h-9 pl-2.5 pr-3 rounded-full bg-[#0A1D37] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" /> 닫기
                </button>
              </div>
            </div>
            <iframe
              src={MAGAZINE.url}
              title={`${MAGAZINE.title} ${MAGAZINE.issue}`}
              allowFullScreen
              loading="lazy"
              className="block w-full h-[70vh] sm:h-[78vh] border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
};
