import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Wind, Clock, Leaf, Home, Calendar, ChevronRight } from 'lucide-react';

/**
 * 신축 입주 고객 안내: 링크클린은 피톤치드 도포를 해드리고,
 * 새집증후군을 줄이는 베이크아웃은 이렇게 해주세요.
 */
const STEPS = [
  {
    icon: Home,
    title: '준비 — 닫을 곳은 닫고, 열 곳은 열기',
    desc: '바깥으로 통하는 창문과 현관문은 모두 닫고, 붙박이장·신발장·싱크대 수납장·서랍은 전부 열어둡니다. 가구 안쪽에서도 유해물질이 빠져나오게 하기 위해서입니다.',
  },
  {
    icon: Flame,
    title: '가열 — 실내 온도를 35~40℃로 올리기',
    desc: '보일러를 최대로 켜서 실내 온도를 35~40℃ 정도로 올리고 6~10시간 유지합니다. 온도가 높을수록 마감재·접착제 속 포름알데히드와 휘발성유기화합물(VOCs)이 더 많이 나옵니다.',
  },
  {
    icon: Wind,
    title: '환기 — 창문을 모두 열고 1~2시간',
    desc: '가열이 끝나면 모든 창문을 활짝 열어 맞바람이 통하게 1~2시간 이상 환기합니다. 빠져나온 유해물질을 밖으로 내보내는 단계입니다.',
  },
  {
    icon: Clock,
    title: '반복 — 3~5회 이상',
    desc: '가열과 환기를 3~5회 이상 반복할수록 효과가 커집니다. 입주 날짜까지 여유가 있다면 며칠에 걸쳐 나눠서 진행해도 좋습니다.',
  },
];


export const BakeoutView: React.FC = () => {
  const { goToReservationWithService, setCurrentView } = useApp();

  return (
    <div className="py-6 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            NEW HOME GUIDE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1D37] tracking-tight mt-2">신축 입주 전, 베이크아웃 하셨나요?</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            새집 특유의 냄새와 따가움(새집증후군)을 줄이는 가장 기본적인 방법입니다.
          </p>
        </div>

        {/* 링크클린이 해드리는 것 / 고객님이 해주실 것 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-emerald-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
              <Leaf className="w-5 h-5" /> 링크클린이 해드려요
            </div>
            <p className="mt-2 text-base sm:text-lg font-black text-[#0A1D37]">입주청소 + 피톤치드 도포</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              신축 입주청소 때 공사 분진을 꼼꼼히 제거하고, 마무리로 <b>천연 피톤치드</b>를 도포해 상쾌한 실내 환경을 만들어 드립니다.
            </p>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-300 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
              <Flame className="w-5 h-5" /> 고객님이 해주세요
            </div>
            <p className="mt-2 text-base sm:text-lg font-black text-[#0A1D37]">베이크아웃 (보일러 가열 + 환기)</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              피톤치드는 상쾌함과 항균에 도움을 주지만, 마감재에서 나오는 <b>유해물질 자체를 빼내지는 못합니다.</b> 그래서 베이크아웃과 환기를 꼭 함께 해주세요.
            </p>
          </div>
        </div>

        {/* 방법 */}
        <section className="bg-[#0A1D37] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          <h2 className="text-lg sm:text-2xl font-black">베이크아웃 방법 4단계</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">일반적으로 권장되는 방법입니다. 집 구조와 날씨에 따라 시간은 조절하세요.</p>
          <ol className="mt-4 space-y-2.5">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4">
                <span className="w-8 h-8 shrink-0 rounded-full bg-[#38BDF8] text-[#0A1D37] font-black flex items-center justify-center">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                    <s.icon className="w-4 h-4 text-[#38BDF8] shrink-0" /> {s.title}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 입주 후 팁 */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black text-[#0A1D37]">입주 후에도 이렇게 해주세요</h2>
          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li>• 입주 후 몇 달간은 하루 2~3회, 30분 이상 맞바람 환기를 해주세요.</li>
            <li>• 새 가구는 포장을 벗겨 베란다 등에서 며칠 환기한 뒤 들이면 좋습니다.</li>
            <li>• 공기청정기만으로는 부족하니 환기를 꼭 함께 해주세요.</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="bg-[#0A1D37] text-white rounded-2xl sm:rounded-3xl p-6 text-center space-y-3">
          <p className="text-base sm:text-xl font-black">신축 입주청소 + 피톤치드 도포, 링크클린에 맡겨주세요</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => goToReservationWithService('move-in')}
              className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-black text-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> 입주청소 견적 예약
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0 });
              }}
              className="px-6 py-3 rounded-xl border border-white/30 text-white font-bold text-sm cursor-pointer inline-flex items-center justify-center gap-1"
            >
              홈으로 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
