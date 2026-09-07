import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cleaningAudio } from '../utils/cleaningAudio';
import { Sparkles, Flame, Wind, Waves, Volume2, Gift, ChevronRight } from 'lucide-react';
import mascotImg from '../assets/images/cleaning_master_mascot_1788782482073.png';

interface SoundOption {
  id: 'steam' | 'vacuum' | 'wipe' | 'flush';
  title: string;
  subText: string;
  soundLabel: string;
  icon: React.ReactNode;
  activeColor: string;
  bgGradient: string;
  bubbleEmoji: string;
}

export const CleaningSoundboard: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [soundFeedback, setSoundFeedback] = useState<string>('버튼을 누르면 시원한 청소 사운드가 재생됩니다!');

  const sounds: SoundOption[] = [
    {
      id: 'steam',
      title: '고온 스팀기',
      subText: '140℃ 멸균 살균',
      soundLabel: '치이이익~ 쏴아아!',
      icon: <Flame className="w-5 h-5 text-orange-500 animate-bounce" />,
      activeColor: 'from-orange-500 to-amber-500 text-white shadow-orange-500/30 ring-orange-400',
      bgGradient: 'hover:border-orange-400 hover:bg-orange-50/50',
      bubbleEmoji: '💨'
    },
    {
      id: 'vacuum',
      title: '강력 청소기',
      subText: '미세먼지 초강력 흡입',
      soundLabel: '위이이잉~ 슝슝!',
      icon: <Wind className="w-5 h-5 text-sky-500 animate-spin" />,
      activeColor: 'from-sky-500 to-cyan-500 text-white shadow-sky-500/30 ring-sky-400',
      bgGradient: 'hover:border-sky-400 hover:bg-sky-50/50',
      bubbleEmoji: '🌀'
    },
    {
      id: 'wipe',
      title: '바닥 닦는 소리',
      subText: '친환경 세정 & 스퀴지',
      soundLabel: '쓱싹쓱싹~ 뽀드득!',
      icon: <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />,
      activeColor: 'from-emerald-500 to-teal-500 text-white shadow-emerald-500/30 ring-emerald-400',
      bgGradient: 'hover:border-emerald-400 hover:bg-emerald-50/50',
      bubbleEmoji: '✨'
    },
    {
      id: 'flush',
      title: '화장실 물내림',
      subText: '변기 배수 & 고압 세척',
      soundLabel: '철컥- 콸콸콸~ 샤아!',
      icon: <Waves className="w-5 h-5 text-blue-500 animate-pulse" />,
      activeColor: 'from-blue-500 to-indigo-500 text-white shadow-blue-500/30 ring-blue-400',
      bgGradient: 'hover:border-blue-400 hover:bg-blue-50/50',
      bubbleEmoji: '🌊'
    }
  ];

  const handlePlaySound = (option: SoundOption) => {
    setActiveSound(option.id);
    setSoundFeedback(`${option.bubbleEmoji} ${option.title}: "${option.soundLabel}"`);

    switch (option.id) {
      case 'steam':
        cleaningAudio.playSteamSound();
        break;
      case 'vacuum':
        cleaningAudio.playVacuumSound();
        break;
      case 'wipe':
        cleaningAudio.playFloorWipeSound();
        break;
      case 'flush':
        cleaningAudio.playToiletFlushSound();
        break;
    }

    setTimeout(() => {
      setActiveSound(null);
    }, 1600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1D37] via-[#0E294E] to-[#0A1D37] p-6 sm:p-10 border border-[#38BDF8]/40 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black mb-2 border border-amber-400/30">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>ASMR 리얼 사운드박스</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>청소 마스터의 생생한 현장 사운드</span>
                <span className="text-xs font-bold text-[#38BDF8] bg-sky-950/70 border border-[#38BDF8]/40 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  사운드 ON 🔊
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal max-w-xl">
                청소 달인의 6개 손이 바쁘게 움직이는 소리! 버튼을 누르면 짧고 통쾌한 현장 청소음이 울려 퍼집니다.
              </p>
            </div>

            {/* Link to Event Page */}
            <button
              onClick={() => setCurrentView('event')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-[#0A1D37] text-xs sm:text-sm font-black transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-amber-400/20 shrink-0 self-start md:self-auto"
            >
              <Gift className="w-4 h-4 text-[#0A1D37]" />
              <span>선물 이벤트 페이지 가기</span>
              <ChevronRight className="w-4 h-4 text-[#0A1D37]" />
            </button>
          </div>

          {/* Center Stage: Mascot + Sound Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Mascot Interactive Profile (Left Column) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="relative mb-3 group">
                <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-2 bg-gradient-to-tr from-[#38BDF8] via-amber-300 to-rose-400 shadow-2xl transition-all duration-300 ${activeSound ? 'scale-110 rotate-2 ring-4 ring-amber-300' : 'group-hover:scale-105'}`}>
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1">
                    <img
                      src={mascotImg}
                      alt="링크클린 멀티 청소 마스터 마스코트"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                  <span className="bg-[#0A1D37] text-amber-300 border border-amber-300/40 text-[11px] font-black px-3 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
                    <span>링크클린 청소 마스터</span>
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  </span>
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="mt-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-[#38BDF8]/40 text-xs text-white max-w-xs transition-all">
                <p className="font-extrabold text-[#38BDF8] text-[11px] mb-0.5">
                  {activeSound ? '💥 사운드 발동 중!' : '💬 마스터의 한마디'}
                </p>
                <p className="font-medium leading-tight">
                  {soundFeedback}
                </p>
              </div>
            </div>

            {/* 4 Fun Interactive Sound Buttons (Right Column) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {sounds.map((sound) => {
                const isPlaying = activeSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => handlePlaySound(sound)}
                    id={`sound-btn-${sound.id}`}
                    type="button"
                    className={`relative p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer overflow-hidden group select-none ${
                      isPlaying
                        ? `bg-gradient-to-r ${sound.activeColor} scale-102 ring-4 shadow-xl border-transparent`
                        : `bg-slate-900/60 border-slate-700/80 text-white ${sound.bgGradient}`
                    }`}
                  >
                    {/* Ripple sound wave visual when playing */}
                    {isPlaying && (
                      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 animate-ping pointer-events-none" />
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${isPlaying ? 'bg-white/20 text-white' : 'bg-white/10 text-white'}`}>
                        {sound.icon}
                      </div>
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${isPlaying ? 'bg-white text-slate-900' : 'bg-slate-800/90 text-amber-300 border border-slate-700'}`}>
                        {isPlaying ? '재생 중 🔊' : 'CLICK ▶'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                        <span>{sound.title}</span>
                        <span className="text-xs font-semibold opacity-80">({sound.bubbleEmoji})</span>
                      </h4>
                      <p className={`text-xs mt-0.5 ${isPlaying ? 'text-white/90 font-medium' : 'text-slate-400'}`}>
                        {sound.subText}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className={`font-extrabold ${isPlaying ? 'text-white underline underline-offset-4' : 'text-[#38BDF8]'}`}>
                        "{sound.soundLabel}"
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">
                        소리 듣기 🎧
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
