import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const HomeFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const MOBILE_VISIBLE = 3;

  const faqs: FaqItem[] = [
    {
      category: '비대면 진행',
      q: '현재 육지(서울/수도권)에 있어서 현장에 못 가는데 괜찮나요?',
      a: '네, 전혀 문제없습니다! 링크클린 이용 고객의 절반 이상이 타지에서 의뢰하시는 고객님입니다. 청소 시작 전 오염 부위 사진부터 청소 진행 중, 그리고 완료 후의 디테일한 고화질 사진 리포트를 카카오톡이나 문자로 실시간 전송해 드립니다. 고객님께서 사진으로 꼼꼼히 확인 및 검수하신 후에 결제하므로 멀리서도 100% 안심하고 맡기실 수 있습니다.',
    },
    {
      category: '가격 및 추가요금',
      q: '청소 당일 현장에서 갑작스러운 추가금이 발생하지 않나요?',
      a: '링크클린은 사전에 협의되지 않은 현장 당일 바가지 추가금을 철저히 금지합니다. 단, 사전에 고지되지 않은 심한 곰팡이 특수 박리, 베란다/유리창의 대량 시트지·스티커 제거, 엘리베이터가 없는 고층 계단 작업 등의 특수 환경이 있을 경우 청소 시작 전 고객님께 사진과 함께 충분히 설명드리고 사전 동의 하에만 정직하게 진행합니다.',
    },
    {
      category: '작업 범위',
      q: '외창(아파트 외부 바깥 유리창)도 청소 범위에 포함되나요?',
      a: '기본 입주·이사청소는 안전상의 이유와 낙하 사고 방지를 위해 외창(바깥을 향한 바깥 유리면)은 기본 제외됩니다. 대신 내부 전체 유리창 및 창틀의 묵은 먼지와 찌든때는 완벽하게 세척해 드립니다. 만약 외창 청소를 꼭 원하시는 경우, 현장 난간 구조 및 안전 장비 설치 여부를 확인 후 별도 옵션으로 협의 가능합니다.',
    },
    {
      category: '소요 시간',
      q: '청소 소요 시간과 투입 인원은 어떻게 되나요?',
      a: '평균 24~34평 기준 3~4명의 전문 직영팀이 투입되며, 약 4~6시간 내외가 소요됩니다. 단순 시간 채우기식 청소가 아니라 공간의 모든 구역(주방 서랍장 탈거, 욕실 환풍기/배수구 스팀 소독 등)이 완벽하게 마무리될 때까지 꼼꼼하게 책임 시공합니다.',
    },
    {
      category: '숙소·펜션',
      q: '제주 독채 펜션이나 에어비앤비 숙소 정기 청소도 가능한가요?',
      a: '네, 가능합니다! 제주 전지역 독채 펜션, 풀빌라, 타운하우스, 에어비앤비 숙소의 퇴실 후 턴오버 청소, 침구 세탁 및 교체, 어메니티 보충, 실내 피톤치드 소독까지 맞춤형 정기 관리 서비스를 제공하고 있습니다. 대표번호로 문의 주시면 운영 형태에 맞춰 상세히 안내해 드립니다.',
    },
    {
      category: '결제 및 A/S',
      q: '예약금은 얼마이며 A/S는 어떻게 되나요?',
      a: '예약 확정 시 소정의 예약금 외에 잔금은 청소가 모두 끝나고 사진 리포트 또는 현장 검수를 마치신 후 결제하시는 안심 후불제 시스템입니다. 시공 완료 후 미흡한 부분이 발견될 경우 당일 즉시 무상 보완 조치해 드립니다.',
    },
  ];

  return (
    <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="text-center mb-4 sm:mb-10">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          FAQ
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2">
          자주 묻는 질문
        </h2>
        <p className="hidden sm:block text-slate-500 text-sm mt-1.5">
          제주 입주·이사·숙소 청소와 관련해 고객님들께서 가장 많이 문의하시는 내용입니다.
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          // 휴대폰에서는 처음 3개만 보이고 나머지는 '더보기'로
          const hiddenOnMobile = !showAll && index >= MOBILE_VISIBLE;
          return (
            <div
              key={index}
              className={`${hiddenOnMobile ? 'hidden sm:block ' : ''}rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isOpen ? 'border-[#38BDF8]/60 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-4 py-3 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-2.5">
                  <span className="hidden sm:inline text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0A1D37] shrink-0 mt-0.5">
                    {faq.category}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0A1D37] leading-snug">
                    {faq.q}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#38BDF8] text-white' : 'text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60 animate-in fade-in duration-200">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showAll && faqs.length > MOBILE_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="sm:hidden mt-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 cursor-pointer"
        >
          질문 {faqs.length - MOBILE_VISIBLE}개 더보기 ▾
        </button>
      )}

    </section>
  );
};
