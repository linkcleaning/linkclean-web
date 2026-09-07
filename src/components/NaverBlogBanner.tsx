import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface NaverBlogBannerProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gradient';
}

export const NaverBlogBanner: React.FC<NaverBlogBannerProps> = ({
  className = '',
  variant = 'light',
}) => {
  const [copied, setCopied] = useState(false);
  const blogUrl = 'https://blog.naver.com/linkcleaning';

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        variant === 'dark'
          ? 'bg-[#0A1D37] text-white border-slate-800 shadow-xl'
          : 'bg-gradient-to-br from-white via-slate-50/80 to-emerald-50/30 text-slate-800 border-emerald-100/80 shadow-md shadow-emerald-950/5'
      } ${className}`}
      id="naver-blog-showcase-banner"
    >
      {/* Decorative ambient glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#03C75A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left: Content Info */}
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {/* Naver Brand Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#03C75A] text-white shadow-xs tracking-tight">
              <span className="w-3.5 h-3.5 rounded-xs bg-white text-[#03C75A] flex items-center justify-center font-black text-[10px] leading-none">
                N
              </span>
              네이버 공식 블로그
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <Sparkles className="w-3 h-3 text-[#03C75A]" />
              생생한 청소 현장 일지
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0A1D37]">
              더 많은 실제 시공 사례가 궁금하신가요?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              링크클린 공식 네이버 블로그에서 <strong className="text-[#0A1D37] font-bold">1,000여 건 이상의 다양한 공간별 청소 전/후 스토리</strong>와 
              생생한 현장 작업 사진, 청소 꿀팁을 지금 바로 확인해보세요!
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#03C75A]" />
              100% 무보정 실제 현장 사진
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
              구역별 세부 작업 공정 기록
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[#03C75A] font-bold">
              매주 신규 시공사례 업데이트
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['#제주입주청소', '#원룸쓰레기집청소', '#욕실물때복원', '#주방후드기름때', '#이사청소실시간일지'].map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-slate-500 bg-white/90 px-2.5 py-0.5 rounded-lg border border-slate-200/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Actions & Clickable Link */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch gap-3">
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="naver-blog-external-link-btn"
            className="group px-7 py-4 rounded-2xl bg-[#03C75A] hover:bg-[#02b350] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer text-center"
          >
            <span className="w-5 h-5 rounded-md bg-white text-[#03C75A] flex items-center justify-center font-black text-xs leading-none shadow-xs">
              N
            </span>
            <span>블로그에서 청소사례 더보기</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* URL Display & Copy Card */}
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <span className="font-mono text-xs text-slate-600 select-all truncate max-w-[200px] sm:max-w-none">
              blog.naver.com/linkcleaning
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#03C75A] hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
              title="주소 복사"
            >
              {copied ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#03C75A]">
                  <Check className="w-3.5 h-3.5" /> 복사됨
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
