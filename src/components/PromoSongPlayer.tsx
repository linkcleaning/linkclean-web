import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music2 } from 'lucide-react';
import { cleaningAudio } from '../utils/cleaningAudio';

/** 링크클린 홍보송 플레이어 (public/audio/linkclean-song-v2.mp3) */
const SONG_SRC = '/audio/linkclean-song-v2.mp3';

const fmt = (sec: number) => {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const PromoSongPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(179);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onPlay = () => setPlaying(true);
    // 홍보송이 멈추면 현장 사운드 엔진을 새로 준비 (아이폰에서 소리가 안 나는 문제 방지)
    const onPause = () => {
      setPlaying(false);
      cleaningAudio.reset();
    };
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
      cleaningAudio.reset();
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        // 휴대폰 잠금화면·알림창에 곡 정보 표시
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: '링크클린 홍보송',
            artist: '링크클린 LINKCLEAN',
            artwork: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }],
          });
        }
      } catch {
        // 재생 실패(네트워크 등)는 무시
      }
    } else {
      a.pause();
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
    setCurrent(a.currentTime);
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0A1D37] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-md border border-slate-800 flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? '일시정지' : '링크클린 홍보송 재생'}
          className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
        >
          {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Music2 className={`w-3.5 h-3.5 text-amber-300 ${playing ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 tracking-wider">LINKCLEAN SONG</span>
          </div>
          <p className="text-sm sm:text-base font-extrabold truncate">🎵 링크클린 홍보송 들어보세요!</p>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="relative flex-1 h-1.5 rounded-full bg-white/15">
              <div className="absolute inset-y-0 left-0 rounded-full bg-[#38BDF8]" style={{ width: `${pct}%` }} />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={1}
                value={current}
                onChange={seek}
                aria-label="재생 위치"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono shrink-0">
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>
        </div>

        {/* 재생 중일 때 움직이는 이퀄라이저 */}
        <div className="hidden sm:flex items-end gap-0.5 h-8 shrink-0" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-1 rounded-full bg-[#38BDF8] ${playing ? 'animate-pulse' : ''}`}
              style={{ height: playing ? `${40 + ((i * 37) % 60)}%` : '20%', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* 페이지 로딩을 느리게 하지 않도록 재생 버튼을 누를 때 내려받음 */}
        <audio ref={audioRef} src={SONG_SRC} preload="none" />
      </div>
    </section>
  );
};
