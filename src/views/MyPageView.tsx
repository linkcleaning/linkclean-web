import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation, ReservationStatus } from '../types';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  Home
} from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { currentUser, userReservations, cancelReservation, logout, setCurrentView, goToReservationWithService } = useApp();
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="py-24 max-w-md mx-auto text-center px-4 space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">로그인이 필요한 페이지입니다</h2>
        <p className="text-slate-500 text-sm">
          방문 견적 예약 내역 확인 및 관리를 위해 로그인해주세요.
        </p>
        <button
          onClick={() => setCurrentView('login')}
          className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 cursor-pointer"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case '접수완료':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            접수완료 (확인중)
          </span>
        );
      case '방문확정':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            방문확정
          </span>
        );
      case '방문완료':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            방문완료
          </span>
        );
      case '취소':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            예약취소
          </span>
        );
    }
  };

  const handleConfirmCancel = (id: string) => {
    cancelReservation(id, cancelReason || '고객 단순 변심 취소');
    setShowCancelModal(null);
    setCancelReason('');
  };

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0A1D37] text-[#38BDF8] flex items-center justify-center font-bold text-xl shadow-sm">
            {currentUser.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37]">
                {currentUser.name} 고객님
              </h1>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] font-bold text-[#38BDF8] bg-[#0A1D37] px-2.5 py-0.5 rounded-full border border-slate-800">
                  관리자 계정
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2 rounded-full bg-[#0A1D37] text-[#38BDF8] text-xs font-bold hover:bg-[#132742] transition-colors cursor-pointer"
            >
              관리자 대시보드
            </button>
          )}
          <button
            onClick={() => {
              logout();
              setCurrentView('home');
            }}
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>
      </div>

      {/* Reservations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0A1D37] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#38BDF8]" />
              내 방문 견적 예약 내역
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              접수된 실시간 견적 방문 예약 및 진행 현황을 확인하실 수 있습니다.
            </p>
          </div>

          <button
            onClick={() => goToReservationWithService('move-in')}
            className="px-4 py-2 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          >
            + 새 방문 견적 예약
          </button>
        </div>

        {userReservations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#0A1D37]">등록된 예약 내역이 없습니다.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              공간의 상태를 직접 확인하고 정직한 견적을 안내해드립니다. 지금 원하는 날짜를 선택해보세요.
            </p>
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="px-6 py-2.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white text-xs font-bold cursor-pointer"
            >
              방문 견적 예약 신청하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userReservations.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm hover:border-[#38BDF8]/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {res.reservationNumber}
                    </span>
                    <span className="font-extrabold text-[#0A1D37] text-sm sm:text-base">
                      {res.serviceTypeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(res.status)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      신청일: {res.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>
                      <strong className="text-slate-800">방문 희망일:</strong> {res.visitDate} ({res.visitTime})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>
                      <strong className="text-slate-800">공간:</strong> {res.spaceType} ({res.sizePyung}평 / 방{res.roomCount} 화{res.bathroomCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                    <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span className="truncate">
                      <strong className="text-slate-800">주소:</strong> {res.address} {res.addressDetail}
                    </span>
                  </div>
                </div>

                {res.adminNote && (
                  <div className="bg-blue-50/70 rounded-2xl p-3 text-xs text-blue-900 border border-blue-100 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-[#0A1D37]">링크클린 안내사항: </strong>
                      <span>{res.adminNote}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedRes(res)}
                    className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    상세 내역 보기
                  </button>
                  {(res.status === '접수완료' || res.status === '방문확정') && (
                    <button
                      onClick={() => setShowCancelModal(res.id)}
                      className="px-3.5 py-1.5 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      예약 취소
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-slate-400">예약번호</span>
                <div className="font-mono font-bold text-[#0A1D37] text-sm">
                  {selectedRes.reservationNumber}
                </div>
              </div>
              <div>{getStatusBadge(selectedRes.status)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50/80 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">신청 서비스</span>
                  <span className="font-bold text-[#0A1D37]">{selectedRes.serviceTypeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">방문 희망 일시</span>
                  <span className="font-bold text-[#38BDF8]">
                    {selectedRes.visitDate} {selectedRes.visitTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">공간 면적 및 구조</span>
                  <span className="font-bold text-[#0A1D37]">
                    {selectedRes.spaceType} / {selectedRes.sizePyung}평 (방 {selectedRes.roomCount}개, 화장실 {selectedRes.bathroomCount}개)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">베란다 유무</span>
                  <span className="font-bold text-[#0A1D37]">
                    {selectedRes.hasBalcony ? `있음 (${selectedRes.balconyCount}개)` : '없음'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl space-y-1 border border-slate-100">
                <div className="text-slate-500">방문 주소</div>
                <div className="font-bold text-[#0A1D37]">
                  {selectedRes.address} {selectedRes.addressDetail}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl space-y-1 border border-slate-100">
                <div className="text-slate-500">예약자 연락처</div>
                <div className="font-bold text-[#0A1D37]">
                  {selectedRes.customerName} ({selectedRes.customerPhone})
                </div>
              </div>

              {selectedRes.notes && (
                <div className="p-3.5 bg-slate-50/80 rounded-2xl space-y-1 border border-slate-100">
                  <div className="text-slate-500">고객 요청사항</div>
                  <div className="text-slate-700 leading-relaxed">{selectedRes.notes}</div>
                </div>
              )}

              {selectedRes.photos.length > 0 && (
                <div>
                  <div className="text-slate-500 mb-1.5">첨부된 현장 사진</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedRes.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="현장사진"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRes(null)}
                className="px-5 py-2 rounded-full bg-[#0A1D37] text-white text-xs font-bold hover:bg-[#132742] cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0A1D37]">방문 견적 예약을 취소하시겠습니까?</h3>
            <p className="text-xs text-slate-500">
              취소 후 필요하실 경우 언제든 새로 방문 견적을 신청하실 수 있습니다.
            </p>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="취소 사유 (선택 입력)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-400 outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                아니오
              </button>
              <button
                onClick={() => handleConfirmCancel(showCancelModal)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                취소 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
