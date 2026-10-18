import React, { useEffect, useState } from 'react';
import { ChevronRight, Newspaper } from 'lucide-react';

/**
 * 오늘의 링크클린 새소식 — 네이버 블로그 최신 글 자동 표시
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
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
    </section>
  );
};
