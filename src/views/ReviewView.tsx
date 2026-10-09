import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Calendar, MessageSquarePlus, X, Upload, CheckCircle2, Award, HelpCircle, PhoneCall, MessageCircle, Send } from 'lucide-react';
import { notifyInquiry } from '../utils/notifyReservation';
import { NAVER_TALK_URL } from '../components/MobileBottomBar';

export const ReviewView: React.FC = () => {
  const { reviews, addReview, goToReservationWithService } = useApp();
  const [showWriteModal, setShowWriteModal] = useState(false);

  // New review form
  const [author, setAuthor] = useState('');
  const [serviceType, setServiceType] = useState('입주·이사청소');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // 문의하기
  const [qName, setQName] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qMessage, setQMessage] = useState('');
  const [qSent, setQSent] = useState(false);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (qPhone.replace(/[^0-9]/g, '').length < 9) {
      alert('답변받으실 휴대폰 번호를 입력해 주세요.');
      return;
    }
    if (!qMessage.trim()) {
      alert('문의 내용을 적어주세요.');
      return;
    }
    notifyInquiry({ name: qName.trim(), phone: qPhone.trim(), message: qMessage.trim(), source: '후기 페이지' });
    setQSent(true);
  };

  const scrollToInquiry = () => document.getElementById('review-inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Visible reviews
  const visibleReviews = reviews.filter((r) => r.isVisible);

  // Calculate average rating
  const avgRating = visibleReviews.length > 0
    ? (visibleReviews.reduce((acc, r) => acc + r.rating, 0) / visibleReviews.length).toFixed(1)
    : '5.0';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    addReview({
      author: author.trim(),
      serviceType,
      rating,
      content: content.trim(),
      photos,
      isVisible: true
    });

    setShowWriteModal(false);
    setAuthor('');
    setContent('');
    setPhotos([]);
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
          CUSTOMER REVIEWS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1D37] tracking-tight">
          고객님이 직접 말해주신 이야기
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          링크클린의 정직한 방문 견적과 디테일한 시공을 경험하신 생생한 후기입니다.
        </p>
      </div>

      {/* Rating Summary Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl font-black text-[#0A1D37] font-mono">
            {avgRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              총 {visibleReviews.length}개의 정직한 고객 후기
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={scrollToInquiry}
            className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0A1D37] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            문의하기
          </button>
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0A1D37] font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#38BDF8]" />
            후기 작성하기
          </button>
          <button
            onClick={() => goToReservationWithService('move-in')}
            className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            방문 견적 예약
          </button>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                "{rev.content}"
              </p>

              {rev.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {rev.photos.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt="후기 사진"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0A1D37]">{rev.author}</span>
              <span className="text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold border border-blue-100 text-[11px]">
                {rev.serviceType}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div id="review-inquiry" className="scroll-mt-28 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Q&amp;A
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37]">후기 보시고 궁금한 점, 바로 물어보세요</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            가격, 일정, 작업 범위 등 무엇이든 남겨주시면 대표가 직접 확인하고 문자나 전화로 답변드립니다.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a href="tel:064-763-4545" className="px-3 py-2 rounded-xl bg-[#0A1D37] text-white text-xs font-bold flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" /> 전화
            </a>
            <a href="https://pf.kakao.com/_xfxdrxmM?from=qr" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-[#FEE500] text-[#3A1D1D] text-xs font-bold flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 fill-[#3A1D1D]" /> 카톡
            </a>
            {NAVER_TALK_URL && (
              <a href={NAVER_TALK_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-[#03C75A] text-white text-xs font-bold flex items-center gap-1.5">
                <span className="font-black">N</span> 톡톡
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {qSent ? (
            <div className="h-full rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              <p className="font-extrabold text-[#0A1D37]">문의가 접수되었습니다!</p>
              <p className="text-xs text-slate-600">남겨주신 번호({qPhone})로 빠르게 답변드릴게요.</p>
              <button
                type="button"
                onClick={() => {
                  setQSent(false);
                  setQMessage('');
                }}
                className="mt-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer"
              >
                다른 문의 남기기
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquiry} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    휴대폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={qPhone}
                    onChange={(e) => setQPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    성함 <span className="text-slate-400 font-medium">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                  문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={qMessage}
                  onChange={(e) => setQMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="예: 32평 입주청소 다음 주 가능할까요? 베란다 곰팡이도 해주시나요?"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                문의 보내기
              </button>
              <p className="text-center text-[10px] text-slate-400">🔒 회원가입 없이 접수돼요 · 남겨주신 정보는 이번 문의 답변에만 사용합니다.</p>
            </form>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowWriteModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-[#0A1D37]">고객 후기 작성</h3>
              <p className="text-xs text-slate-500 mt-1">
                링크클린을 이용해보신 소중한 경험을 남겨주시면 큰 힘이 됩니다.
              </p>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  작성자명 (예: 김*현 고객님)
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 홍*동 고객님"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    이용 서비스
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                  >
                    <option value="입주·이사청소">입주·이사청소</option>
                    <option value="거주청소">거주청소</option>
                    <option value="상가청소">상가청소</option>
                    <option value="사무실청소">사무실청소</option>
                    <option value="부분청소">부분청소</option>
                    <option value="쓰레기집청소">쓰레기집청소</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    별점
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                  >
                    <option value="5">★★★★★ (5점 만점)</option>
                    <option value="4">★★★★☆ (4점)</option>
                    <option value="3">★★★☆☆ (3점)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  후기 내용
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="방문 견적 실측과 청소 시공 퀄리티에 대한 솔직한 의견을 적어주세요."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  사진 첨부 (선택)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#38BDF8] hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#38BDF8] text-white text-xs font-bold hover:bg-[#0EA5E9] shadow-sm cursor-pointer"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
