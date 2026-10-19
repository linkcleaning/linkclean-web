import React from 'react';

/**
 * 링크클린이 만든 무료 생활앱 (매거진 카드 옆)
 * 주소가 정해지지 않은 앱은 url을 비워두면 '곧 오픈'으로 표시됩니다.
 */
const APPS = [
  {
    emoji: '🚻',
    name: 'Ddong 전국 공중화장실',
    desc: '내 주변 화장실 찾기',
    url: 'https://linkcleaning.github.io/ddong-korea/',
    tone: 'from-pink-100 to-rose-50 border-pink-200',
  },
  {
    emoji: '🍀',
    name: '행운로또 생성기',
    desc: '가족 생일로 번호 뽑기',
    url: 'https://linkcleaning.github.io/lucky-lotto/',
    tone: 'from-amber-100 to-yellow-50 border-amber-200',
  },
  {
    emoji: '🔮',
    name: '띠링 오늘의 운세',
    desc: '재미로 보는 오늘 운세',
    url: '', // 배포되면 주소 입력
    tone: 'from-violet-100 to-purple-50 border-violet-200',
  },
];

export const LinkAppsCard: React.FC = () => (
  <div className="h-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4">
    <p className="text-[10px] sm:text-xs font-black text-[#38BDF8] tracking-wider">LINKCLEAN APPS</p>
    <p className="text-sm sm:text-base font-black text-[#0A1D37] mb-2">📱 링크클린이 만든 무료 생활앱</p>
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {APPS.map((a) => {
        const inner = (
          <>
            <span className="text-2xl sm:text-3xl leading-none">{a.emoji}</span>
            <span className="mt-1 text-[10px] sm:text-xs font-black text-[#0A1D37] leading-tight">{a.name}</span>
            <span className="hidden sm:block text-[10px] text-slate-500 leading-tight mt-0.5">{a.desc}</span>
            {!a.url && <span className="mt-1 text-[9px] font-black text-white bg-slate-400 px-1.5 py-0.5 rounded-full">곧 오픈</span>}
          </>
        );
        const cls = `flex flex-col items-center text-center rounded-xl border bg-gradient-to-b ${a.tone} px-1.5 py-2 sm:py-2.5 transition-transform`;
        return a.url ? (
          <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:-translate-y-0.5 hover:shadow-md`}>
            {inner}
          </a>
        ) : (
          <div key={a.name} className={`${cls} opacity-80`}>
            {inner}
          </div>
        );
      })}
    </div>
  </div>
);
