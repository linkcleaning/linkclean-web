import { CleaningDateHint } from './CleaningDateHint';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceType, PropertyType } from '../types';
import {
  Calendar as CalendarIcon,
  Upload,
  Phone,
  CheckCircle2,
  Sparkles,
  Camera,
  MapPin,
  Home,
  MessageCircle,
  Clock
} from 'lucide-react';

export const QuickQuoteFormSection: React.FC = () => {
  const { createReservation, openRenewalNotice } = useApp();

  const [serviceType, setServiceType] = useState<ServiceType>('move-in');
  const [propertyType, setPropertyType] = useState<PropertyType>('아파트');
  const [area, setArea] = useState<string>('24평');
  const [region, setRegion] = useState<string>('제주시 동지역');
  const [visitDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cleaningDateHint, setCleaningDateHint] = useState<string>('');
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const regionOptions = [
    '제주시 동지역 (연동·노형·이도·아라 등)',
    '제주시 서부 읍면 (애월·한림·한경)',
    '제주시 동부 읍면 (조천·구좌)',
    '서귀포시 동지역 (서홍·동홍·중문 등)',
    '서귀포시 서부 (대정·안덕·영어교육도시)',
    '서귀포시 동부 (남원·표선·성산)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/[^0-9]/g, '').length < 9) {
      alert('연락받으실 휴대폰 번호를 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        customer_name: name.trim() || '고객(이름 미입력)',
        phone: phone,
        email: 'guest@linkclean.co.kr',
        service_type: serviceType,
        visit_date: visitDate,
        // 사진 견적은 시간 예약이 아니므로 '협의'로 접수 (시간대 마감 검사 대상 아님)
        visit_time: '협의',
        property_type: propertyType,
        area: area,
        address: region,
        address_detail: '사진 견적 신청',
        customer_message: `[지역: ${region}] ${notes}`.trim(),
        uploaded_images: [],
        cleaning_date_hint: cleaningDateHint.trim(),
      });

      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="quick-quote-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-14">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg sm:shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1D37] via-[#102A4E] to-[#0A1D37] text-white px-4 py-2.5 sm:p-8 flex sm:block items-baseline gap-2 sm:text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-base sm:text-3xl font-extrabold tracking-tight shrink-0">간편 견적 신청</h2>
          <p className="text-[10px] sm:text-sm text-slate-300 sm:mt-1 max-w-lg mx-auto truncate">
            번호만 남겨주시면 빠르게 연락드려요<span className="hidden sm:inline">. 나머지는 선택이에요.</span>
          </p>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-6 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0A1D37]">
              견적 신청이 성공적으로 접수되었습니다!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              담당자가 확인 후 남겨주신 번호(<strong>{phone}</strong>)로 빠르게 연락드려요. 현장 사진을 <strong>카카오톡</strong>으로 보내주시면 더 정확한 견적을 받으실 수 있어요.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:064-763-4545"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A1D37] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#38BDF8]" />
                <span>급한 일정 바로 전화하기 (064-763-4545)</span>
              </a>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                다른 견적 다시 작성
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-3 sm:p-8 space-y-2.5 sm:space-y-5">
            {/* 필수: 서비스 + 연락처 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-0.5 sm:mb-1">청소 종류</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                >
                  <option value="move-in">🏡 입주·이사청소</option>
                  <option value="residential">🛋️ 거주 대청소</option>
                  <option value="partial">🏖️ 숙소·펜션·에어비앤비</option>
                  <option value="commercial">☕ 상가·매장청소</option>
                  <option value="office">🏢 사무실청소</option>
                  <option value="trash">🧹 쓰레기집·특수청소</option>
                </select>
              </div>
              <div className="grid grid-cols-2 sm:contents gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-0.5 sm:mb-1">
                    휴대폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-0.5 sm:mb-1">
                    성함 <span className="text-slate-400 font-medium">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 청소 희망일 (대략) */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1 sm:mb-1.5">
                청소 희망일 <span className="text-slate-400 font-medium">(대략이라도 좋아요)</span>
              </label>
              <CleaningDateHint value={cleaningDateHint} onChange={setCleaningDateHint} compact />
            </div>

            {/* 선택 정보 (접기) */}
            <div className="rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
                className="w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-sm font-bold text-[#0A1D37] cursor-pointer"
              >
                <span>➕ 평수·지역·요청사항 <span className="text-slate-400 font-medium">(선택)</span></span>
                <span className={`text-[#38BDF8] transition-transform ${showMore ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {showMore && (
                <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">공간 형태</label>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)} className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white">
                      <option value="아파트">아파트</option>
                      <option value="빌라">빌라·연립</option>
                      <option value="원룸/오피스텔">원룸·오피스텔</option>
                      <option value="주택">단독주택·타운하우스</option>
                      <option value="상가">상가·펜션·숙소</option>
                      <option value="사무실">사무실</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">평수</label>
                    <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="예: 24평" className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">지역</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white">
                      {regionOptions.map((r, i) => (
                        <option key={i} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">요청사항</label>
                    <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="예: 곰팡이 있음, 엘리베이터 없음" className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white" />
                  </div>
                </div>
              )}
            </div>

            {/* 사진은 카톡으로 */}
            <a
              href="https://pf.kakao.com/_xfxdrxmM?from=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FEE500]/30 border border-[#FEE500] text-[11px] sm:text-xs text-[#3A1D1D] font-bold"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span className="flex-1">현장 사진은 카톡으로 보내주세요<span className="hidden sm:inline"> — 더 정확한 견적을 드려요</span></span>
              <MessageCircle className="w-4 h-4 shrink-0 fill-[#3A1D1D]" />
            </a>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              id="quick-quote-submit-btn"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{submitting ? '전송 중...' : '무료 견적 신청하기'}</span>
            </button>
            <p className="text-center text-[9px] sm:text-[11px] text-slate-400 -mt-1.5 sm:-mt-1">
              🔒 회원가입 없이 접수돼요 · 남겨주신 정보는 이번 견적 상담과 예약에만 사용합니다.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
