import React, { useEffect, useState } from 'react';
import { Instagram, Play, X, ExternalLink } from 'lucide-react';
import { INSTAGRAM_REELS, INSTAGRAM_PROFILE, InstaPost } from '../data/instagramReels';

/** 인스타 게시물 주소 → 임베드 주소 (reel / p / tv 모두) */
const embedUrl = (url: string) => {
  const m = url.match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!m) return '';
  const kind = m[1] === 'reels' ? 'reel' : m[1];
  return `https://www.instagram.com/${kind}/${m[2]}/embed/`;
};
const cleanUrl = (url: string) => url.split('?')[0];
const codeOf = (url: string) => (url.match(/\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/) || [])[1] || '';

export const InstagramReelsSection: React.FC = () => {
  const [posts, setPosts] = useState<InstaPost[]>(INSTAGRAM_REELS);
  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  // 배포 때 받아둔 인스타 첫 화면 사진 (public/insta/thumbs.json)
  useEffect(() => {
    fetch('/insta/thumbs.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d === 'object' && setThumbs(d))
      .catch(() => null);
  }, []);

  // 토큰으로 자동 수집된 목록(public/instagram.json)이 있으면 그걸 우선 사용
  useEffect(() => {
    let alive = true;
    fetch('/instagram.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && Array.isArray(d?.posts) && d.posts.length) setPosts(d.posts);
      })
      .catch(() => null);
    return () => {
      alive = false;
    };
  }, []);

  const list = posts.filter((p) => embedUrl(p.url)).slice(0, 8);
  if (!list.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl border border-pink-200 bg-white p-3 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2 className="flex items-center gap-1.5 text-sm sm:text-lg font-extrabold text-[#0A1D37]">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center">
              <Instagram className="w-4 h-4" />
            </span>
            링크클린 인스타 릴스
          </h2>
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[11px] sm:text-xs font-bold text-pink-600 hover:underline"
          >
            @linkcleaning 팔로우 →
          </a>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 lg:grid lg:grid-cols-8 lg:overflow-visible lg:mx-0 lg:px-0">
          {list.map((p) => (
            <button
              key={p.url}
              type="button"
              onClick={() => setOpenUrl(p.url)}
              className="relative shrink-0 w-24 sm:w-28 lg:w-auto aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white text-left cursor-pointer group"
            >
              {(thumbs[codeOf(p.url)] || p.thumbnail) && (
                <img
                  src={thumbs[codeOf(p.url)] || p.thumbnail}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-white/90 text-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </span>
              </span>
              <span className="absolute bottom-1.5 inset-x-1.5 text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2">
                {p.caption || '릴스 보기'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {openUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
          onClick={() => setOpenUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[400px] bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-100">
              <a
                href={cleanUrl(openUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-pink-600"
              >
                인스타에서 보기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setOpenUrl(null)}
                className="inline-flex items-center gap-1 px-3 h-9 rounded-full bg-[#0A1D37] text-white text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" /> 닫기
              </button>
            </div>
            <iframe
              src={embedUrl(openUrl)}
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
