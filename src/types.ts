export type ServiceType = 'move-in' | 'residential' | 'commercial' | 'office' | 'partial' | 'special' | 'trash';

export type PropertyType = '아파트' | '빌라' | '원룸/오피스텔' | '주택' | '상가' | '사무실' | '기타';

export type ReservationStatus = 
  | '접수완료'
  | '방문확정'
  | '방문완료'
  | '취소'
  | 'NEW'        // 신규예약
  | 'CONFIRMING' // 확인중
  | 'CONFIRMED'  // 예약확정
  | 'VISITED'    // 방문완료
  | 'COMPLETED'  // 완료
  | 'CANCELLED'; // 예약취소

export interface Reservation {
  id?: string;
  reservation_id: string;      // LC-YYYYMMDD-XXXX
  reservationNumber?: string;
  user_id: string;             // 예약자 ID (비회원인 경우 'guest')
  userId?: string;
  customer_name: string;
  customerName?: string;
  phone: string;
  customerPhone?: string;
  email: string;
  service_type: ServiceType;
  serviceType?: ServiceType;
  serviceTypeName?: string;
  visit_date: string;          // YYYY-MM-DD
  visitDate?: string;
  visit_time: string;          // HH:mm (e.g. 10:00)
  visitTime?: string;
  address: string;
  address_detail: string;
  addressDetail?: string;
  property_type: PropertyType;
  spaceType?: string;
  area: string;                // 평수 (예: 24평)
  sizePyung?: string;
  roomCount?: number;
  bathroomCount?: number;
  hasBalcony?: boolean;
  balconyCount?: number;
  customer_message: string;
  notes?: string;
  uploaded_images: string[];
  photos?: string[];
  status: ReservationStatus;
  admin_memo: string;
  adminNote?: string;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface TimeSlotConfig {
  date: string;             // YYYY-MM-DD
  closedTimes?: string[];    // e.g. ["11:00", "14:00"]
  unavailableHours?: string[];
  isHoliday?: boolean;      // 해당 날짜 전체 휴무일 지정
  isClosed?: boolean;
  maxPerSlot?: number;
}

export type PortfolioCategory = '전체' | '주방' | '욕실' | '거실' | '창틀' | '베란다' | '상가' | '쓰레기집' | '기타';

export interface PortfolioItem {
  id: string;
  title: string;
  location?: string;
  category: PortfolioCategory;
  representativeImage: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  serviceType: string;
  rating: number;
  content: string;
  photos: string[];
  date: string;
  isVisible: boolean;
}

export type Review = ReviewItem;
export type CustomerReview = ReviewItem;

export interface ServiceDetail {
  id: ServiceType;
  name: string;
  tagline: string;
  description: string;
  mainImage: string;
  recommendedFor: string[];
  scopeList: {
    title: string;
    items: string[];
  }[];
  workImages: string[];
  processSteps: {
    step: string;
    title: string;
    desc: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
