import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Reservation,
  User,
  TimeSlotConfig,
  PortfolioItem,
  ReviewItem,
  ServiceType,
  ReservationStatus
} from '../types';
import {
  INITIAL_RESERVATIONS,
  INITIAL_USERS,
  INITIAL_PORTFOLIO,
  INITIAL_REVIEWS
} from '../data/initialData';
import { notifyReservation } from '../utils/notifyReservation';
import { fetchSheetPortfolio } from '../utils/sheetPortfolio';

export const STANDARD_TIME_SLOTS = [
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
];

/**
 * 9월 한정: 일정 품질 및 이동 동선 확보를 위해 하루 2개의 시간대만 예약 가능하도록 설정
 * (오전 1타임 + 오후 1타임, 최소 4~5시간 텀으로 서로 중복되지 않음)
 */
export const isSeptemberDate = (dateString: string): boolean => {
  return /-09-/.test(dateString);
};

export const getSeptemberAllowedSlots = (dateString: string): string[] => {
  const parts = dateString.split('-');
  const day = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  const mod = day % 3;
  if (mod === 0) return ['10:00', '14:00']; // 오전 10:00 & 오후 14:00 (4시간 간격)
  if (mod === 1) return ['11:00', '16:00']; // 오전 11:00 & 오후 16:00 (5시간 간격)
  return ['10:00', '15:00'];                // 오전 10:00 & 오후 15:00 (5시간 간격)
};

/**
 * 월별로 하루에 열어둘 예약 시간대 수.
 * 나머지 시간대는 자연스럽게 "예약마감"으로 보이도록, 날짜마다 다른 조합을 고릅니다.
 * (같은 날짜는 언제 봐도 같은 조합 → 새로고침해도 바뀌지 않음)
 */
const OPEN_SLOTS_PER_DAY_BY_MONTH: Record<string, number> = {
  '10': 2, // 10월: 하루 2개
  '11': 3, // 11월: 하루 3개
};

// 날짜 문자열로 항상 같은 난수열을 만드는 간단한 시드 난수
const seededRandom = (seedText: string) => {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const toHour = (slot: string) => parseInt(slot.split(':')[0], 10);

/** 해당 날짜에 열어둘 시간대 목록. 제한이 없는 달이면 null */
export const getLimitedAllowedSlots = (dateString: string): string[] | null => {
  if (isSeptemberDate(dateString)) return getSeptemberAllowedSlots(dateString);

  const month = dateString.split('-')[1];
  const count = OPEN_SLOTS_PER_DAY_BY_MONTH[month];
  if (!count) return null;

  const rand = seededRandom(`linkclean-${dateString}`);
  const shuffled = [...STANDARD_TIME_SLOTS]
    .map((slot) => ({ slot, key: rand() }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.slot);

  // 서로 2시간 이상 떨어진 시간대만 골라 실제 일정처럼 보이게
  const picked: string[] = [];
  for (const slot of shuffled) {
    if (picked.every((p) => Math.abs(toHour(p) - toHour(slot)) >= 2)) picked.push(slot);
    if (picked.length === count) break;
  }
  return picked.sort();
};

export type AppView = 
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'portfolio'
  | 'review'
  | 'event'
  | 'why'
  | 'bakeout'
  | 'reservation'
  | 'login'
  | 'register'
  | 'mypage'
  | 'admin';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedServiceId: ServiceType;
  setSelectedServiceId: (id: ServiceType) => void;
  currentUser: User | null;
  reservations: Reservation[];
  portfolio: PortfolioItem[];
  reviews: ReviewItem[];
  timeSlotConfigs: Record<string, TimeSlotConfig>;
  userReservations: Reservation[];
  // Reservation logic
  createReservation: (data: Omit<Reservation, 'reservation_id' | 'created_at' | 'updated_at' | 'status' | 'admin_memo'>) => Promise<{ success: boolean; reservation?: Reservation; error?: string }>;
  updateReservationStatus: (id: string, status: ReservationStatus, adminMemo?: string) => void;
  updateReservationNote: (id: string, note: string) => void;
  updateAdminMemo: (id: string, memo: string) => void;
  cancelReservation: (id: string, reason?: string) => void;
  deleteReservation: (id: string) => void;
  isSlotAvailable: (date: string, time: string) => boolean;
  toggleTimeSlot: (date: string, time: string) => void;
  toggleDateHoliday: (date: string) => void;
  updateTimeSlotConfig: (date: string, config: TimeSlotConfig) => void;
  // Auth
  login: (emailOrId: string, password?: string) => boolean;
  register: (params: { name: string; phone: string; email: string; password?: string }) => boolean;
  registerUser: (name: string, phone: string, email: string) => boolean;
  logout: () => void;
  withdrawAccount: (reason?: string) => { success: boolean; message: string };
  // Renewal Notice Popup
  isRenewalNoticeOpen: boolean;
  setIsRenewalNoticeOpen: (open: boolean) => void;
  openRenewalNotice: () => void;
  // CMS
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
  addReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  updateReview: (review: ReviewItem) => void;
  deleteReview: (id: string) => void;
  toggleReviewVisibility: (id: string) => void;
  // Navigation helpers
  goToServiceDetail: (serviceId: ServiceType) => void;
  goToReservationWithService?: (serviceId?: ServiceType) => void;
  preselectedReservationService: ServiceType;
  setPreselectedReservationService: (serviceId: ServiceType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceType>('move-in');
  const [preselectedReservationService, setPreselectedReservationService] = useState<ServiceType>('move-in');

  // Persistence with LocalStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('linkclean_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Notice & Event Popup State (defaults to true on first visit, respects "오늘 하루 보지 않기")
  const [isRenewalNoticeOpen, setIsRenewalNoticeOpen] = useState<boolean>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dismissedDate = localStorage.getItem('linkclean_dismiss_notice_date');
      return dismissedDate !== today;
    } catch {
      return true;
    }
  });

  const openRenewalNotice = () => setIsRenewalNoticeOpen(true);

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('linkclean_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('linkclean_portfolio');
      if (saved) {
        const parsed: PortfolioItem[] = JSON.parse(saved);
        // Replace mainland place names to Jeju locations in case user had legacy cached data
        let updated: PortfolioItem[] = parsed.map((item: PortfolioItem): PortfolioItem => {
          // If item matches an initial ID, ensure it has latest Jeju data
          const initialMatch = INITIAL_PORTFOLIO.find((init) => init.id === item.id);
          if (initialMatch) {
            return {
              ...item,
              title: initialMatch.title,
              location: initialMatch.location,
              category: initialMatch.category,
              description: initialMatch.description,
              representativeImage: initialMatch.representativeImage,
              beforeImage: initialMatch.beforeImage,
              afterImage: initialMatch.afterImage
            };
          }

          // For any custom items, sanitize any mainland names to Jeju locations
          let newTitle = item.title
            .replace(/분당/g, '제주시 연동')
            .replace(/강남/g, '제주시 노형동')
            .replace(/성동구|성동/g, '서귀포시 서호동')
            .replace(/영등포/g, '제주시 이도이동')
            .replace(/마포/g, '제주시 아라동')
            .replace(/판교/g, '제주시 애월읍')
            .replace(/일산/g, '서귀포시 중문동');

          let newDesc = item.description
            .replace(/분당/g, '제주시 연동')
            .replace(/강남/g, '제주시 노형동')
            .replace(/성동구|성동/g, '서귀포시 서호동')
            .replace(/영등포/g, '제주시 이도이동')
            .replace(/마포/g, '제주시 아라동')
            .replace(/판교/g, '제주시 애월읍')
            .replace(/일산/g, '서귀포시 중문동');

          let newLoc = item.location || '제주시';
          newLoc = newLoc
            .replace(/분당/g, '제주시 연동')
            .replace(/강남/g, '제주시 노형동')
            .replace(/성동구|성동/g, '서귀포시 서호동')
            .replace(/영등포/g, '제주시 이도이동')
            .replace(/마포/g, '제주시 아라동');

          return {
            ...item,
            title: newTitle,
            description: newDesc,
            location: newLoc
          };
        });

        // Ensure all INITIAL_PORTFOLIO items are present
        INITIAL_PORTFOLIO.forEach((initItem) => {
          if (!updated.some((item) => item.id === initItem.id)) {
            updated.push(initItem);
          }
        });

        localStorage.setItem('linkclean_portfolio', JSON.stringify(updated));
        return updated;
      }
      return INITIAL_PORTFOLIO;
    } catch {
      return INITIAL_PORTFOLIO;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      // 예전 샘플 후기(rev-1~4)는 지우고, 네이버 실제 후기를 항상 포함
      const saved = localStorage.getItem('linkclean_reviews_v2');
      if (!saved) return INITIAL_REVIEWS;
      const parsed: ReviewItem[] = JSON.parse(saved);
      const kept = parsed.filter((r) => !/^rev-\d+$/.test(r.id) && !INITIAL_REVIEWS.some((i) => i.id === r.id));
      return [...INITIAL_REVIEWS, ...kept];
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [timeSlotConfigs, setTimeSlotConfigs] = useState<Record<string, TimeSlotConfig>>(() => {
    try {
      const saved = localStorage.getItem('linkclean_slot_configs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('linkclean_reservations', JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('linkclean_portfolio', JSON.stringify(portfolio));
    } catch {
      // ignore
    }
  }, [portfolio]);

  // 사장님 구글 시트에 청소사례가 등록되어 있으면 그 내용으로 교체 (시트에서 직접 수정 가능)
  useEffect(() => {
    let cancelled = false;
    fetchSheetPortfolio().then((items) => {
      if (!cancelled && items) setPortfolio(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('linkclean_reviews_v2', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('linkclean_slot_configs', JSON.stringify(timeSlotConfigs));
    } catch {
      // ignore
    }
  }, [timeSlotConfigs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('linkclean_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('linkclean_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Sync with window scroll on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedServiceId]);

  // Check if a time slot is available
  const isSlotAvailable = (date: string, time: string): boolean => {
    const config = timeSlotConfigs[date];
    if (config?.isHoliday || config?.isClosed) {
      return false;
    }
    if (config?.closedTimes?.includes(time) || config?.unavailableHours?.includes(time)) {
      return false;
    }

    // 월별 일정 규칙 (9월·10월 하루 2개, 11월 하루 3개): 나머지는 예약마감 처리
    const allowed = getLimitedAllowedSlots(date);
    if (allowed && !allowed.includes(time)) {
      return false;
    }

    // Check existing active reservations
    const existing = reservations.find(
      (r) => r.visit_date === date && r.visit_time === time && r.status !== 'CANCELLED'
    );
    return !existing;
  };

  // Toggle admin closed timeslot
  const toggleTimeSlot = (date: string, time: string) => {
    setTimeSlotConfigs((prev) => {
      const current = prev[date] || { date, closedTimes: [] };
      const closed = current.closedTimes || [];
      const isAlreadyClosed = closed.includes(time);
      const updatedClosed = isAlreadyClosed
        ? closed.filter((t) => t !== time)
        : [...closed, time];

      return {
        ...prev,
        [date]: {
          ...current,
          closedTimes: updatedClosed
        }
      };
    });
  };

  // Toggle admin holiday
  const toggleDateHoliday = (date: string) => {
    setTimeSlotConfigs((prev) => {
      const current = prev[date] || { date, closedTimes: [] };
      return {
        ...prev,
        [date]: {
          ...current,
          isHoliday: !current.isHoliday
        }
      };
    });
  };

  // Create new reservation with collision detection
  const createReservation = async (
    data: Omit<Reservation, 'reservation_id' | 'created_at' | 'updated_at' | 'status' | 'admin_memo'>
  ) => {
    // 1. Double check availability
    // 시간을 고른 경우에만 마감 여부 확인 (시간 미선택 = '협의')
    if (STANDARD_TIME_SLOTS.includes(data.visit_time) && !isSlotAvailable(data.visit_date, data.visit_time)) {
      return {
        success: false,
        error: '선택하신 방문 일시의 예약이 마감되었습니다. 다른 시간대를 선택해주세요.'
      };
    }

    // 2. Generate clean ID: LC-YYYYMMDD-XXXX
    const dateCompact = data.visit_date.replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reservation_id = `LC-${dateCompact}-${randomSuffix}`;
    const now = new Date();
    const nowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReservation: Reservation = {
      ...data,
      reservation_id,
      user_id: currentUser ? currentUser.id : data.user_id || 'guest',
      status: 'NEW',
      admin_memo: '',
      created_at: nowFormatted,
      updated_at: nowFormatted
    };

    setReservations((prev) => [newReservation, ...prev]);

    // 사장님께 문자 알림 (실패해도 예약은 정상 처리)
    notifyReservation(newReservation);

    return {
      success: true,
      reservation: newReservation
    };
  };

  const updateReservationStatus = (id: string, status: ReservationStatus, adminMemo?: string) => {
    const now = new Date();
    const nowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setReservations((prev) =>
      prev.map((r) => {
        if (r.reservation_id === id || r.id === id) {
          return {
            ...r,
            status,
            admin_memo: adminMemo !== undefined ? adminMemo : r.admin_memo,
            adminNote: adminMemo !== undefined ? adminMemo : r.adminNote,
            updated_at: nowFormatted,
            updatedAt: nowFormatted
          };
        }
        return r;
      })
    );
  };

  const updateAdminMemo = (id: string, memo: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.reservation_id === id || r.id === id ? { ...r, admin_memo: memo, adminNote: memo } : r))
    );
  };

  const updateReservationNote = (id: string, note: string) => {
    updateAdminMemo(id, note);
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id && r.reservation_id !== id));
  };

  const cancelReservation = (id: string, reason?: string) => {
    updateReservationStatus(id, '취소', reason || '고객 요청으로 취소됨');
  };

  const updateTimeSlotConfig = (date: string, config: TimeSlotConfig) => {
    setTimeSlotConfigs((prev) => ({
      ...prev,
      [date]: config
    }));
  };

  // Auth logic
  const login = (emailOrId: string, _password?: string): boolean => {
    const trimmed = emailOrId.trim().toLowerCase();
    // Admin login match
    if (trimmed === 'admin' || trimmed === 'admin@linkclean.co.kr') {
      setCurrentUser({
        id: 'user-admin-1',
        name: '링크클린 관리자',
        phone: '064-763-4545',
        email: 'linkdole@naver.com',
        role: 'admin',
        created_at: '2026-01-01'
      });
      return true;
    }

    // Existing registered customer or sample customer
    const foundUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === trimmed || u.id === trimmed
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }

    // Default friendly login if user puts any valid email/name
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: emailOrId.includes('@') ? emailOrId.split('@')[0] : emailOrId,
      phone: '010-0000-0000',
      email: emailOrId.includes('@') ? emailOrId : `${emailOrId}@linkclean.user`,
      role: 'customer',
      created_at: new Date().toISOString().split('T')[0]
    });
    return true;
  };

  const registerUser = (name: string, phone: string, email: string): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      email,
      role: 'customer',
      created_at: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = (params: { name: string; phone: string; email: string; password?: string }): boolean => {
    return registerUser(params.name, params.phone, params.email);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const withdrawAccount = (reason?: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: '로그인되어 있지 않습니다.' };
    }

    const targetUserId = currentUser.id;
    const targetEmail = currentUser.email;

    // 1. Clear session
    setCurrentUser(null);
    try {
      localStorage.removeItem('linkclean_user');

      // 2. Anonymize/purge user reservations to protect personal data
      setReservations((prev) => {
        const remaining = prev.filter(
          (r) =>
            r.user_id !== targetUserId &&
            r.userId !== targetUserId &&
            r.email !== targetEmail
        );
        try {
          localStorage.setItem('linkclean_reservations', JSON.stringify(remaining));
        } catch {
          // ignore
        }
        return remaining;
      });
    } catch {
      // ignore
    }

    // 3. Move back to home view
    setCurrentView('home');

    return {
      success: true,
      message: '회원 탈퇴가 안전하게 처리되었습니다. 그동안 링크클린을 이용해 주셔서 진심으로 감사드립니다.'
    };
  };

  // Normalized reservations to supply both snake_case and camelCase getters
  const normalizedReservations: Reservation[] = reservations.map((r) => ({
    ...r,
    id: r.id || r.reservation_id,
    reservationNumber: r.reservationNumber || r.reservation_id,
    customerName: r.customerName || r.customer_name,
    customerPhone: r.customerPhone || r.phone,
    visitDate: r.visitDate || r.visit_date,
    visitTime: r.visitTime || r.visit_time,
    serviceTypeName:
      r.serviceTypeName ||
      (r.service_type === 'move-in'
        ? '입주·이사청소'
        : r.service_type === 'residential'
        ? '거주청소'
        : r.service_type === 'commercial'
        ? '상가청소'
        : r.service_type === 'office'
        ? '사무실청소'
        : r.service_type === 'trash'
        ? '쓰레기집청소'
        : '부분청소'),
    spaceType: r.spaceType || r.property_type,
    sizePyung: r.sizePyung || r.area,
    addressDetail: r.addressDetail || r.address_detail,
    adminNote: r.adminNote || r.admin_memo,
    createdAt: r.createdAt || r.created_at,
    photos: r.photos || r.uploaded_images || []
  }));

  const userReservations = normalizedReservations.filter((r) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return (
      r.user_id === currentUser.id ||
      r.userId === currentUser.id ||
      r.email === currentUser.email ||
      r.phone === currentUser.phone ||
      r.customerPhone === currentUser.phone
    );
  });

  // Portfolio CMS
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPortfolio((prev) => [newItem, ...prev]);
  };

  const updatePortfolioItem = (updated: PortfolioItem) => {
    setPortfolio((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  // Review CMS
  const addReview = (review: Omit<ReviewItem, 'id' | 'date'>) => {
    const newRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const updateReview = (updated: ReviewItem) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleReviewVisibility = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r))
    );
  };

  const goToServiceDetail = (serviceId: ServiceType) => {
    setSelectedServiceId(serviceId);
    setCurrentView('service-detail');
  };

  const goToReservationWithService = (serviceId: ServiceType = 'move-in') => {
    setPreselectedReservationService(serviceId);
    setCurrentView('reservation');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedServiceId,
        setSelectedServiceId,
        currentUser,
        reservations: normalizedReservations,
        userReservations,
        portfolio,
        reviews,
        timeSlotConfigs,
        createReservation,
        updateReservationStatus,
        updateReservationNote,
        updateAdminMemo,
        cancelReservation,
        deleteReservation,
        isSlotAvailable,
        toggleTimeSlot,
        toggleDateHoliday,
        updateTimeSlotConfig,
        login,
        register,
        registerUser,
        logout,
        withdrawAccount,
        isRenewalNoticeOpen,
        setIsRenewalNoticeOpen,
        openRenewalNotice,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        addReview,
        updateReview,
        deleteReview,
        toggleReviewVisibility,
        goToServiceDetail,
        goToReservationWithService,
        preselectedReservationService,
        setPreselectedReservationService
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
