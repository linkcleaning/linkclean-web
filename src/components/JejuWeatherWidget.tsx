import React, { useState } from 'react';
import { JejuCityType, JejuDailyWeather } from '../types';
import { getJejuWeather } from '../data/jejuWeatherData';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  X, 
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface JejuWeatherWidgetProps {
  className?: string;
}

export const JejuWeatherWidget: React.FC<JejuWeatherWidgetProps> = ({ className = '' }) => {
  const { goToReservationWithService } = useApp();
  const [selectedCity, setSelectedCity] = useState<JejuCityType>('jeju');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCity, setModalCity] = useState<JejuCityType>('jeju');

  const weatherList = getJejuWeather(selectedCity);
  const activeDay = weatherList[selectedDayIndex] || weatherList[0];

  const modalWeatherList = getJejuWeather(modalCity);

  // Weather icon helper
  const renderWeatherIcon = (condition: JejuDailyWeather['condition'], iconClassName = 'w-5 h-5') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${iconClassName} text-amber-400`} />;
      case 'cloudy':
      case 'fog':
        return <Cloud className={`${iconClassName} text-sky-200`} />;
      case 'rain':
        return <CloudRain className={`${iconClassName} text-blue-300`} />;
      case 'windy':
        return <Wind className={`${iconClassName} text-teal-200`} />;
      default:
        return <Sun className={`${iconClassName} text-amber-400`} />;
    }
  };

  const getCleaningBadgeColor = (index: JejuDailyWeather['cleaningIndex']) => {
    switch (index) {
      case '매우좋음':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '좋음':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '보통':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '주의':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getCleaningDotColor = (index: JejuDailyWeather['cleaningIndex']) => {
    switch (index) {
      case '매우좋음':
        return 'bg-emerald-400';
      case '좋음':
        return 'bg-sky-400';
      case '보통':
        return 'bg-amber-400';
      case '주의':
        return 'bg-rose-400';
    }
  };

  return (
    <>
      {/* Bento Card: 제주도 날씨 & 1주일 청소 예보 (제주시 / 서귀포시 구분) */}
      <div 
        id="jeju-weather-bento-card"
        className={`col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0A1D37] rounded-3xl p-5 sm:p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all group ${className}`}
      >
        {/* Subtle background ambient elements */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 text-white/10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
          {activeDay.condition === 'sunny' ? (
            <Sun className="w-32 h-32" />
          ) : activeDay.condition === 'rain' ? (
            <CloudRain className="w-32 h-32" />
          ) : (
            <Cloud className="w-32 h-32" />
          )}
        </div>

        <div className="relative z-10">
          {/* Header: Title & Distinct City Tabs (제주시 vs 서귀포시) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h4 className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                <span>제주도 날씨</span>
                <span className="text-[10px] font-semibold text-sky-200">(1주일 예보)</span>
              </h4>
            </div>

            {/* City Segmented Switch: 제주시 vs 서귀포시 */}
            <div 
              className="inline-flex bg-black/30 backdrop-blur-xs p-0.5 rounded-full border border-white/20 shadow-inner"
              role="tablist"
              aria-label="제주 권역 선택"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCity === 'jeju'}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCity('jeju');
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCity === 'jeju'
                    ? 'bg-white text-[#0A1D37] shadow-sm scale-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="w-2.5 h-2.5" />
                <span>제주시</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedCity === 'seogwipo'}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCity('seogwipo');
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCity === 'seogwipo'
                    ? 'bg-white text-[#0A1D37] shadow-sm scale-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="w-2.5 h-2.5" />
                <span>서귀포시</span>
              </button>
            </div>
          </div>

          {/* Active Day Highlight Preview */}
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/15">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-white/15 border border-white/20">
                  {renderWeatherIcon(activeDay.condition, 'w-5 h-5')}
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black">{activeDay.tempHigh}°</span>
                    <span className="text-xs text-sky-200">/ {activeDay.tempLow}°</span>
                    <span className="text-xs font-bold text-amber-300 ml-1">{activeDay.conditionText}</span>
                  </div>
                  <div className="text-[10px] text-sky-200 flex items-center gap-1.5">
                    <span>{selectedCity === 'jeju' ? '제주시(북부)' : '서귀포시(남부)'}</span>
                    <span>•</span>
                    <span className="font-semibold text-white">
                      {activeDay.dayLabel === '오늘' ? '오늘' : `${activeDay.date.slice(5)} (${activeDay.dayOfWeek})`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[9px] text-sky-200 bg-black/20 px-1.5 py-0.5 rounded-md">
                  <Droplets className="w-2.5 h-2.5 text-sky-300" />
                  <span>습도 {activeDay.humidity}%</span>
                </div>
                <div className="text-[9px] text-sky-200">
                  강수확률 {activeDay.rainProb}%
                </div>
              </div>
            </div>

            {/* Cleaning Tip for the selected day */}
            <div className="pt-1.5 border-t border-white/15">
              <div className="flex items-center justify-between gap-1 text-[9px] font-bold text-amber-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  청소 추천 가이드
                </span>
                <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded">
                  지수: {activeDay.cleaningIndex}
                </span>
              </div>
              <p className="text-[10px] text-white/95 leading-snug line-clamp-2">
                {activeDay.cleaningTip}
              </p>
            </div>
          </div>
        </div>

        {/* 1주일 (7일간) 주간 예보 그리드 */}
        <div className="mt-2.5 pt-2 border-t border-white/15 relative z-10">
          <div className="text-[10px] text-sky-200 font-bold mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-300" />
              1주일 (7일) 주간 예보
            </span>
            <span className="text-[9px] text-sky-100/70">요일을 클릭해 확인</span>
          </div>

          {/* 7-day strip */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weatherList.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDayIndex(idx);
                  }}
                  className={`p-1 rounded-xl transition-all flex flex-col items-center justify-between cursor-pointer border ${
                    isSelected 
                      ? 'bg-white text-[#0A1D37] border-white shadow-sm font-bold scale-102' 
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  title={`${day.date} (${day.dayOfWeek}) - ${day.conditionText}, 청소지수: ${day.cleaningIndex}`}
                >
                  <span className={`text-[8px] sm:text-[9px] leading-tight ${isSelected ? 'text-[#0A1D37] font-black' : 'text-sky-200'}`}>
                    {idx === 0 ? '오늘' : day.dayOfWeek}
                  </span>
                  <div className="my-0.5 flex justify-center">
                    {renderWeatherIcon(day.condition, isSelected ? 'w-3.5 h-3.5' : 'w-3 h-3')}
                  </div>
                  <span className={`text-[9px] font-black leading-none ${isSelected ? 'text-[#0A1D37]' : 'text-white'}`}>
                    {day.tempHigh}°
                  </span>
                  <span 
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${getCleaningDotColor(day.cleaningIndex)}`}
                    title={`청소지수: ${day.cleaningIndex}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Open full 1-week modal CTA */}
          <button
            type="button"
            onClick={() => {
              setModalCity(selectedCity);
              setIsModalOpen(true);
            }}
            className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/20 group-hover:border-white/40"
          >
            <span>1주일 상세 캘린더 & 제주시/서귀포시 비교</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 1주일 제주 날씨 & 청소 추천 가이드 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                제주 기후 맞춤 1주일 클리닝 가이드
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37]">
                제주 1주일 날씨 & 권역별 청소 지수
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                바다로 둘러싸인 제주는 북부(제주시)와 남부(서귀포시)의 기온 및 습도 편차가 큽니다. 권역별 주간 날씨를 고려해 최적의 방문 실측 일정을 확인해 보세요.
              </p>

              {/* City Switch in Modal */}
              <div className="flex gap-2 mt-4 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setModalCity('jeju')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalCity === 'jeju'
                      ? 'bg-[#0284C7] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  제주시 (북부권) 1주일 예보
                </button>
                <button
                  type="button"
                  onClick={() => setModalCity('seogwipo')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    modalCity === 'seogwipo'
                      ? 'bg-[#0284C7] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  서귀포시 (남부권) 1주일 예보
                </button>
              </div>
            </div>

            {/* 7-Day Detailed Cards */}
            <div className="space-y-3">
              {modalWeatherList.map((day) => (
                <div
                  key={day.date}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-sky-200 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    {/* Left: Date & Condition */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-100">
                        {renderWeatherIcon(day.condition, 'w-5 h-5')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0A1D37] text-sm">
                            {day.date} ({day.dayOfWeek})
                          </span>
                          {day.dayLabel === '오늘' && (
                            <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                              오늘
                            </span>
                          )}
                          <span className="text-xs text-slate-500 font-medium">
                            {day.conditionText}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-700">
                            최고 {day.tempHigh}° / 최저 {day.tempLow}°
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-sky-600 font-medium">
                            <Droplets className="w-3 h-3" /> 습도 {day.humidity}%
                          </span>
                          <span>•</span>
                          <span>강수 {day.rainProb}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Cleaning Index Badge & Booking CTA */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCleaningBadgeColor(day.cleaningIndex)}`}>
                        청소지수: {day.cleaningIndex}
                      </span>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          goToReservationWithService?.('move-in');
                        }}
                        className="text-xs font-bold text-[#0284C7] bg-white border border-sky-200 hover:bg-sky-50 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        이 날 예약
                      </button>
                    </div>
                  </div>

                  {/* Cleaning Recommendation Tip */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-[#0284C7] font-bold shrink-0">💡 청소 추천:</span>
                    <span>{day.cleaningTip}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-sky-500" />
                제주 기상청 및 해양 날씨 기준 실시간 주간 지표 제공
              </span>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  goToReservationWithService?.('move-in');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                날씨 좋은 날로 무료 방문 견적 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

