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

export type AppView = 
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'portfolio'
  | 'review'
  | 'event'
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
        let updated = parsed.map((item) => {
          if (item.id === 'p-1') {
            return {
              ...item,
              title: '주방 아일랜드 원형 후드 찌든 기름때 및 필터 완벽 분해 세척',
              representativeImage: '/images/kitchen_hood_after.jpg?v=2',
              beforeImage: '/images/kitchen_hood_before.jpg?v=2',
              afterImage: '/images/kitchen_hood_after.jpg?v=2',
              description: '흡입구와 원형 필터망에 찌들어 있던 끈적한 조리 기름때를 친환경 유지방 분해제와 고온 고압 스팀으로 완전 박리하여 신품 수준의 스테인리스 광택을 복원했습니다.'
            };
          }
          if (item.id === 'p-2') {
            return {
              ...item,
              title: '원룸·오피스텔 욕실 방치 쓰레기 수거 및 도기·타일 살균 딥클린',
              representativeImage: '/images/bathroom_after.jpg?v=2',
              beforeImage: '/images/bathroom_before.jpg?v=2',
              afterImage: '/images/bathroom_after.jpg?v=2',
              description: '바닥에 방치되었던 생활 쓰레기와 빈 용기를 깔끔하게 수거하고, 변기 내부 찌든 때와 타일 줄눈 물때를 친환경 세정제 및 고온 스팀으로 완벽 살균 세척했습니다.'
            };
          }
          if (item.id === 'p-7') {
            return {
              ...item,
              title: '원룸 생활 폐기물·배달 용기 전량 수거 및 멸균 바닥 청소',
              representativeImage: '/images/trash_house_after.jpg?v=2',
              beforeImage: '/images/trash_house_before.jpg?v=2',
              afterImage: '/images/trash_house_after.jpg?v=2',
              description: '방 안 가득 쌓여 있던 배달 음식 용기와 생활 쓰레기를 100% 비밀보장 비대면으로 완벽 반출하고, 찌든 바닥 얼룩 및 냄새를 스팀 살균 소독으로 쾌적하게 복원했습니다.'
            };
          }
          return item;
        });
        if (!updated.some((item) => item.id === 'p-7')) {
          const p7 = INITIAL_PORTFOLIO.find((item) => item.id === 'p-7');
          if (p7) updated.push(p7);
        }
        return updated;
      }
      return INITIAL_PORTFOLIO;
    } catch {
      return INITIAL_PORTFOLIO;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('linkclean_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
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

  useEffect(() => {
    try {
      localStorage.setItem('linkclean_reviews', JSON.stringify(reviews));
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

    // 9월 일정 규칙: 하루 2개의 시간대만 오픈, 나머지는 기본 예약마감 처리
    if (isSeptemberDate(date)) {
      const allowed = getSeptemberAllowedSlots(date);
      if (!allowed.includes(time)) {
        return false;
      }
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
    if (!isSlotAvailable(data.visit_date, data.visit_time)) {
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
