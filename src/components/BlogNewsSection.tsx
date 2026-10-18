import React, { useEffect, useState } from 'react';
import { ChevronRight, Newspaper, Instagram, Play, X, ExternalLink } from 'lucide-react';
import { INSTAGRAM_REELS, INSTAGRAM_PROFILE, InstaPost } from '../data/instagramReels';

const embedUrl = (url: string) => {
  const m = url.match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  return m ? `https://www.instagram.com/${m[1] === 'reels' ? 'reel' : m[1]}/${m[2]}/embed/` : '';
};

/**
 * 오늘의 링크클린 새소식 — 네이버 블로그 최신 글 자동 표시 + 끝에 인스타 릴스 1개
 * 배포할 때(3시간마다 자동) scripts/fetch-blog.mjs 가 블로그 RSS를 읽어 public/blog.json 을 만듭니다.
 */
interface BlogPost {
  title: string;
  link: string;
  summary: string;
  image: string;
  category: string;
  date: string;
}

const BLOG_URL = 'https://blog.naver.com/linkcleaning';

const todayKst = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const daysAgo = (date: string) => {
  if (!date) return 99;
  return Math.round((Date.parse(todayKst()) - Date.parse(date)) / 86400000);
};
const whenLabel = (date: string) => {
  const d = daysAgo(date);
  if (d <= 0) return '오늘';
  if (d === 1) return '어제';
  if (d < 7) return `${d}일 전`;
  return date.slice(5).replace('-', '.');
};

export const BlogNewsSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [reel, setReel] = useState<InstaPost | undefined>(INSTAGRAM_REELS[0]);
  const [reelOpen, setReelOpen] = useState(false);

  // 인스타 토큰으로 자동 수집된 목록이 있으면 최신 1개 사용
  useEffect(() => {
    fetch('/instagram.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Array.isArray(d?.posts) && d.posts[0] && setReel(d.posts[0]))
      .catch(() => null);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch('/blog.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setPosts(Array.isArray(d?.posts) ? d.posts.slice(0, 3) : []))
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  if (posts === null) return null; // 불러오는 중에는 자리 차지 안 함

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-white p-3 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
          <h2 className="flex items-center gap-1.5 text-sm sm:text-lg font-extrabold text-[#0A1D37]">
            <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[#03C75A]" />
            오늘의 링크클린 새소식
          </h2>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#03C75A] hover:underline"
          >
            <span className="w-4 h-4 rounded bg-[#03C75A] text-white flex items-center justify-center font-black text-[9px]">N</span>
            블로그 전체
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className={`grid grid-cols-1 gap-2 sm:gap-3 ${reel ? 'lg:grid-cols-4' : ''}`}>
        <div className={reel ? 'lg:col-span-3' : ''}>
        {posts.length === 0 ? (
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-3 text-xs text-emerald-900 font-medium"
          >
            현장 소식과 청소 사례를 네이버 블로그에 올리고 있어요. 눌러서 최신 글 보기 →
          </a>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 h-full">
            {posts.map((p) => {
              const isNew = daysAgo(p.date) <= 3;
              return (
                <li key={p.link}>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2.5 rounded-xl border border-slate-200 hover:border-[#03C75A]/60 hover:bg-emerald-50/40 p-2 transition-colors h-full"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg object-cover bg-slate-100"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                    ) : (
                      <span className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-emerald-50 text-[#03C75A] flex items-center justify-center font-black text-lg">N</span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-bold">
                        {isNew && <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-black">NEW</span>}
                        {whenLabel(p.date)}
                        {p.category && <span className="truncate">· {p.category}</span>}
                      </span>
                      <span className="block mt-0.5 text-xs sm:text-sm font-extrabold text-[#0A1D37] leading-snug line-clamp-2">{p.title}</span>
                      {p.summary && <span className="hidden sm:block mt-0.5 text-[11px] text-slate-500 line-clamp-1">{p.summary}</span>}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        </div>

        {/* 인스타 릴스 1개 (누르면 홈페이지 안에서 재생) */}
        {reel && embedUrl(reel.url) && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setReelOpen(true)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setReelOpen(true)}
            className="flex gap-2.5 rounded-xl border border-pink-200 hover:border-pink-400 hover:bg-pink-50/50 p-2 text-left cursor-pointer transition-colors"
          >
            <span className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600">
              {reel.thumbnail && (
                <img src={reel.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-7 h-7 rounded-full bg-white/90 text-pink-600 flex items-center justify-center shadow">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-pink-600">
                <Instagram className="w-3.5 h-3.5" /> 인스타 릴스
              </span>
              <span className="block mt-0.5 text-xs sm:text-sm font-extrabold text-[#0A1D37] leading-snug line-clamp-2">
                {reel.caption || '링크클린 현장 릴스'}
              </span>
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block mt-0.5 text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-pink-600"
              >
                @linkcleaning 팔로우 →
              </a>
            </span>
          </div>
        )}
        </div>
      </div>

      {reelOpen && reel && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3" onClick={() => setReelOpen(false)} role="dialog" aria-modal="true">
          <div className="w-full max-w-[400px] bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-100">
              <a href={reel.url.split('?')[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-pink-600">
                인스타에서 보기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setReelOpen(false)}
                className="inline-flex items-center gap-1 px-3 h-9 rounded-full bg-[#0A1D37] text-white text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" /> 닫기
              </button>
            </div>
            <iframe
              src={embedUrl(reel.url)}
              title="링크클린 인스타그램 릴스"
              className="w-full h-[75vh] max-h-[680px] border-0 bg-white"
              allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              scrolling="no"
            />
          </div>
        </div>
      )}
    </section>
  );
};
