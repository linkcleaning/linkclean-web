import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation, ReservationStatus, PortfolioCategory, PortfolioItem, Review } from '../types';
import {
  ShieldAlert,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Save,
  Users,
  Layers,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  MapPin,
  Phone,
  FileText
} from 'lucide-react';

type AdminTab = 'reservations' | 'timeSlots' | 'portfolio' | 'reviews';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    login,
    reservations,
    updateReservationStatus,
    updateReservationNote,
    deleteReservation,
    portfolio,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    reviews,
    toggleReviewVisibility,
    deleteReview,
    timeSlotConfigs,
    updateTimeSlotConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('reservations');

  // Reservation Filters
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResForDetail, setSelectedResForDetail] = useState<Reservation | null>(null);

  // Admin note editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');

  // Portfolio add/edit modal state
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [portTitle, setPortTitle] = useState('');
  const [portCategory, setPortCategory] = useState<PortfolioCategory>('주방');
  const [portDesc, setPortDesc] = useState('');
  const [portRepImg, setPortRepImg] = useState('');
  const [portBeforeImg, setPortBeforeImg] = useState('');
  const [portAfterImg, setPortAfterImg] = useState('');

  // TimeSlot configuration state
  const [selectedConfigDate, setSelectedConfigDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [isDayOff, setIsDayOff] = useState(false);
  const [blockedHours, setBlockedHours] = useState<string[]>([]);
  const [maxPerSlot, setMaxPerSlot] = useState(2);

  const AVAILABLE_HOURS = ['09:00', '11:00', '13:00', '15:00', '17:00'];

  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-24 max-w-md mx-auto text-center px-4 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0A1D37]">관리자 인증이 필요합니다</h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          관리자(Admin) 권한을 가진 계정으로 로그인해야 대시보드에 접근할 수 있습니다.
        </p>
        <button
          onClick={() => {
            login('admin@linkclean.co.kr', 'admin1234');
          }}
          className="px-6 py-3 rounded-full bg-[#0A1D37] text-[#38BDF8] font-bold text-xs sm:text-sm shadow-sm hover:bg-[#132742] transition-colors cursor-pointer"
        >
          🛡️ 관리자 원클릭 로그인하기
        </button>
      </div>
    );
  }

  // Filter reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = statusFilter === '전체' || r.status === statusFilter;
    const matchesQuery =
      r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Statistics
  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === '접수완료').length;
  const confirmedCount = reservations.filter((r) => r.status === '방문확정').length;
  const completedCount = reservations.filter((r) => r.status === '방문완료').length;
  const cancelledCount = reservations.filter((r) => r.status === '취소').length;

  // Open Portfolio Modal for Create
  const handleOpenCreatePortfolio = () => {
    setEditingPortfolioItem(null);
    setPortTitle('');
    setPortCategory('주방');
    setPortDesc('');
    setPortRepImg('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
    setPortBeforeImg('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
    setPortAfterImg('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80');
    setShowPortfolioModal(true);
  };

  // Open Portfolio Modal for Edit
  const handleOpenEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setPortTitle(item.title);
    setPortCategory(item.category);
    setPortDesc(item.description);
    setPortRepImg(item.representativeImage);
    setPortBeforeImg(item.beforeImage);
    setPortAfterImg(item.afterImage);
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim() || !portDesc.trim()) return;

    if (editingPortfolioItem) {
      updatePortfolioItem(editingPortfolioItem.id, {
        title: portTitle.trim(),
        category: portCategory,
        description: portDesc.trim(),
        representativeImage: portRepImg,
        beforeImage: portBeforeImg,
        afterImage: portAfterImg
      });
    } else {
      addPortfolioItem({
        title: portTitle.trim(),
        category: portCategory,
        description: portDesc.trim(),
        representativeImage: portRepImg || portAfterImg,
        beforeImage: portBeforeImg,
        afterImage: portAfterImg
      });
    }
    setShowPortfolioModal(false);
  };

  // Time Slot config handlers
  const handleToggleHourBlock = (hour: string) => {
    setBlockedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleSaveTimeSlotConfig = () => {
    updateTimeSlotConfig(selectedConfigDate, {
      date: selectedConfigDate,
      isClosed: isDayOff,
      unavailableHours: blockedHours,
      maxPerSlot
    });
    alert(`${selectedConfigDate} 일자의 예약 가능 설정이 성공적으로 저장되었습니다.`);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Bar Header */}
      <div className="bg-[#0A1D37] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-bold font-mono">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-slate-400">링크클린 통합 관리자</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            관리자 대시보드
          </h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-[#132742] p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reservations'
                ? 'bg-[#38BDF8] text-[#0A1D37] shadow-sm font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            예약 관리 ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('timeSlots')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeSlots'
                ? 'bg-[#38BDF8] text-[#0A1D37] shadow-sm font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            일정/마감 설정
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-[#38BDF8] text-[#0A1D37] shadow-sm font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            포트폴리오 CMS
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-[#38BDF8] text-[#0A1D37] shadow-sm font-extrabold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            고객후기 CMS
          </button>
        </div>
      </div>

      {/* Metric Cards Overview Bento Style */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">총 접수 예약</span>
          <div className="text-2xl font-black text-[#0A1D37] font-mono mt-1">{totalCount}건</div>
        </div>
        <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200/70 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <Clock3 className="w-3 h-3" />
            접수완료 (대기)
          </span>
          <div className="text-2xl font-black text-amber-900 font-mono mt-1">{pendingCount}건</div>
        </div>
        <div className="bg-blue-50/70 rounded-3xl p-5 border border-blue-200/70 shadow-sm">
          <span className="text-[11px] font-bold text-[#0A1D37] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#38BDF8]" />
            방문확정
          </span>
          <div className="text-2xl font-black text-[#0A1D37] font-mono mt-1">{confirmedCount}건</div>
        </div>
        <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200/70 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            방문완료
          </span>
          <div className="text-2xl font-black text-emerald-900 font-mono mt-1">{completedCount}건</div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            취소됨
          </span>
          <div className="text-2xl font-black text-slate-700 font-mono mt-1">{cancelledCount}건</div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: RESERVATIONS MANAGEMENT
      ========================================================================= */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(['전체', '접수완료', '방문확정', '방문완료', '취소'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0A1D37] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예약번호, 고객명, 연락처, 주소"
                className="w-full pl-9 pr-3.5 py-2 rounded-full border border-slate-200 text-xs focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
              />
            </div>
          </div>

          {/* Reservations Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">예약번호</th>
                    <th className="p-4">고객정보</th>
                    <th className="p-4">서비스 / 공간</th>
                    <th className="p-4">방문희망일시</th>
                    <th className="p-4">주소</th>
                    <th className="p-4">상태변경</th>
                    <th className="p-4">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        조건에 일치하는 예약 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#0A1D37] whitespace-nowrap">
                          {res.reservationNumber}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-[#0A1D37]">{res.customerName}</div>
                          <div className="text-slate-500 text-[11px]">{res.customerPhone}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-[#38BDF8]">{res.serviceTypeName}</div>
                          <div className="text-slate-500 text-[11px]">
                            {res.spaceType} ({res.sizePyung}평)
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-[#0A1D37]">{res.visitDate}</div>
                          <div className="text-slate-500 text-[11px]">{res.visitTime}</div>
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          <div className="text-[#0A1D37] truncate">{res.address}</div>
                          <div className="text-slate-500 text-[11px] truncate">{res.addressDetail}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={res.status}
                            onChange={(e) =>
                              updateReservationStatus(res.id, e.target.value as ReservationStatus)
                            }
                            className={`px-2.5 py-1.5 rounded-full font-bold text-xs border cursor-pointer outline-none ${
                              res.status === '접수완료'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : res.status === '방문확정'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : res.status === '방문완료'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                          >
                            <option value="접수완료">접수완료</option>
                            <option value="방문확정">방문확정</option>
                            <option value="방문완료">방문완료</option>
                            <option value="취소">예약취소</option>
                          </select>
                        </td>
                        <td className="p-4 whitespace-nowrap flex items-center gap-2">
                          <button
                            onClick={() => setSelectedResForDetail(res)}
                            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0A1D37] font-semibold cursor-pointer"
                          >
                            상세
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('정말 이 예약을 삭제하시겠습니까?')) {
                                deleteReservation(res.id);
                              }
                            }}
                            className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TIME SLOTS & CALENDAR CONFIGURATION
      ========================================================================= */}
      {activeTab === 'timeSlots' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#0A1D37] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#38BDF8]" />
              날짜 및 시간대별 예약 마감/휴무 관리
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              특정 날짜를 휴무일로 지정하거나, 특정 시간대를 마감 처리하여 고객 중복 예약을 방지할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  설정할 날짜 선택
                </label>
                <input
                  type="date"
                  value={selectedConfigDate}
                  onChange={(e) => {
                    const d = e.target.value;
                    setSelectedConfigDate(d);
                    const cfg = timeSlotConfigs[d];
                    if (cfg) {
                      setIsDayOff(cfg.isClosed);
                      setBlockedHours(cfg.unavailableHours || []);
                      setMaxPerSlot(cfg.maxPerSlot || 2);
                    } else {
                      setIsDayOff(false);
                      setBlockedHours([]);
                      setMaxPerSlot(2);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>

              {/* Day-Off Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0A1D37] text-xs sm:text-sm">해당 일자 전체 휴무 지정</div>
                  <div className="text-[11px] text-slate-500">지정 시 고객 예약 달력에서 해당 날짜가 비활성화됩니다.</div>
                </div>
                <input
                  type="checkbox"
                  checked={isDayOff}
                  onChange={(e) => setIsDayOff(e.target.checked)}
                  className="w-5 h-5 text-[#38BDF8] rounded focus:ring-[#38BDF8]"
                />
              </div>

              {/* Max Reservations per Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  시간대당 최대 예약 수용 건수 (동시 방문 가능 건수)
                </label>
                <select
                  value={maxPerSlot}
                  onChange={(e) => setMaxPerSlot(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white outline-none"
                >
                  <option value={1}>1건 (단독 방문 전담)</option>
                  <option value={2}>2건 (팀 분산 방문 가능)</option>
                  <option value={3}>3건 (최대 수용)</option>
                </select>
              </div>
            </div>

            {/* Block individual hours */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                개별 시간대 마감 설정 ({selectedConfigDate})
              </label>
              <p className="text-xs text-slate-500">
                빨간색으로 선택된 시간대는 고객 예약 화면에서 "마감" 처리됩니다.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_HOURS.map((hr) => {
                  const isBlocked = blockedHours.includes(hr);
                  return (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => handleToggleHourBlock(hr)}
                      className={`p-3 rounded-2xl border font-mono font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isBlocked
                          ? 'bg-red-50 text-red-700 border-red-200 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-100 shadow-xs hover:border-slate-300'
                      }`}
                    >
                      <span>{hr}</span>
                      <span className="text-[10px] mt-1 font-sans">
                        {isBlocked ? '마감됨 (불가)' : '예약가능'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTimeSlotConfig}
                  className="px-6 py-2.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  일정 설정 저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PORTFOLIO CMS
      ========================================================================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0A1D37]">시공 사례 (포트폴리오) CMS</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Before/After 비교 시공 사례를 추가, 수정, 삭제 관리합니다.
              </p>
            </div>
            <button
              onClick={handleOpenCreatePortfolio}
              className="px-4 py-2 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              새 시공 사례 등록
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all"
              >
                <div>
                  <div className="h-44 relative bg-slate-100">
                    <img
                      src={item.afterImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0A1D37]/85 text-[#38BDF8] text-[10px] font-bold border border-slate-700/50">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-extrabold text-[#0A1D37] text-xs sm:text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">{item.createdAt}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditPortfolio(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('삭제하시겠습니까?')) deletePortfolioItem(item.id);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: REVIEWS CMS
      ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0A1D37]">고객 후기 CMS 관리</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                등록된 고객 리뷰의 메인 화면 노출 On/Off 토글 및 관리를 수행합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0A1D37] text-sm">{rev.author}</span>
                      <span className="text-xs text-[#38BDF8] bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                        {rev.serviceType}
                      </span>
                      <span className="text-amber-500 font-bold text-xs">★ {rev.rating}.0</span>
                      <span className="text-slate-400 text-xs font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleReviewVisibility(rev.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        rev.isVisible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {rev.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {rev.isVisible ? '홈 노출 중' : '숨김 상태'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('후기를 삭제하시겠습니까?')) deleteReview(rev.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RESERVATION DETAIL & ADMIN NOTES
      ========================================================================= */}
      {selectedResForDetail && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-slate-400">예약 번호</span>
                <div className="font-mono font-bold text-[#0A1D37] text-base">
                  {selectedResForDetail.reservationNumber}
                </div>
              </div>
              <select
                value={selectedResForDetail.status}
                onChange={(e) => {
                  const newSt = e.target.value as ReservationStatus;
                  updateReservationStatus(selectedResForDetail.id, newSt);
                  setSelectedResForDetail((prev) => prev ? { ...prev, status: newSt } : null);
                }}
                className="px-3 py-1.5 rounded-full font-bold text-xs border border-slate-200 cursor-pointer bg-slate-50 outline-none"
              >
                <option value="접수완료">접수완료</option>
                <option value="방문확정">방문확정</option>
                <option value="방문완료">방문완료</option>
                <option value="취소">취소</option>
              </select>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400">고객명</span>
                  <div className="font-bold text-[#0A1D37]">{selectedResForDetail.customerName}</div>
                </div>
                <div>
                  <span className="text-slate-400">연락처</span>
                  <div className="font-bold text-[#0A1D37]">{selectedResForDetail.customerPhone}</div>
                </div>
                <div>
                  <span className="text-slate-400">방문 희망 일시</span>
                  <div className="font-bold text-[#38BDF8]">
                    {selectedResForDetail.visitDate} {selectedResForDetail.visitTime}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">서비스 종류</span>
                  <div className="font-bold text-[#0A1D37]">{selectedResForDetail.serviceTypeName}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400">공간 구조 및 평수</span>
                <div className="font-bold text-[#0A1D37]">
                  {selectedResForDetail.spaceType} ({selectedResForDetail.sizePyung}평 / 방 {selectedResForDetail.roomCount}개 / 화장실 {selectedResForDetail.bathroomCount}개)
                </div>
                <div className="text-slate-600">
                  베란다: {selectedResForDetail.hasBalcony ? `있음 (${selectedResForDetail.balconyCount}개)` : '없음'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400">방문 주소</span>
                <div className="font-bold text-[#0A1D37]">
                  {selectedResForDetail.address} {selectedResForDetail.addressDetail}
                </div>
              </div>

              {selectedResForDetail.notes && (
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400">고객 요청사항</span>
                  <div className="text-slate-700 leading-relaxed">{selectedResForDetail.notes}</div>
                </div>
              )}

              {/* Admin Note Input */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-bold text-[#0A1D37] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                  관리자 전달 메모 (고객 마이페이지에도 노출)
                </span>
                <textarea
                  rows={2}
                  defaultValue={selectedResForDetail.adminNote || ''}
                  onChange={(e) => {
                    updateReservationNote(selectedResForDetail.id, e.target.value);
                  }}
                  placeholder="예: 09:00 팀장 직접 방문 예정입니다. 특이사항 확인 완료."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#38BDF8] resize-none outline-none"
                />
              </div>

              {selectedResForDetail.photos.length > 0 && (
                <div>
                  <span className="text-slate-500 font-bold mb-1.5 block">고객 첨부 현장 사진</span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedResForDetail.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="첨부"
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedResForDetail(null)}
                className="px-5 py-2.5 rounded-full bg-[#0A1D37] text-white font-bold text-xs hover:bg-[#132742] cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT PORTFOLIO
      ========================================================================= */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-extrabold text-[#0A1D37]">
              {editingPortfolioItem ? '시공 사례 수정' : '새 시공 사례 등록'}
            </h3>

            <form onSubmit={handleSavePortfolio} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">제목</label>
                <input
                  type="text"
                  required
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  placeholder="예: 마포 34평 아파트 주방 기름때 완벽 박리"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38BDF8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={portCategory}
                    onChange={(e) => setPortCategory(e.target.value as PortfolioCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none"
                  >
                    <option value="주방">주방</option>
                    <option value="욕실">욕실</option>
                    <option value="거실">거실</option>
                    <option value="창틀">창틀</option>
                    <option value="베란다">베란다</option>
                    <option value="상가">상가</option>
                    <option value="쓰레기집">쓰레기집</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">대표 이미지 URL</label>
                  <input
                    type="url"
                    value={portRepImg}
                    onChange={(e) => setPortRepImg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Before 이미지 URL</label>
                  <input
                    type="url"
                    required
                    value={portBeforeImg}
                    onChange={(e) => setPortBeforeImg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">After 이미지 URL</label>
                  <input
                    type="url"
                    required
                    value={portAfterImg}
                    onChange={(e) => setPortAfterImg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">작업 상세 설명</label>
                <textarea
                  rows={3}
                  required
                  value={portDesc}
                  onChange={(e) => setPortDesc(e.target.value)}
                  placeholder="작업 내용과 특이사항을 적어주세요."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold cursor-pointer hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#38BDF8] text-white font-bold hover:bg-[#0EA5E9] shadow-sm cursor-pointer"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
