import { Reservation } from '../types';
import { SERVICE_DETAILS } from '../data/initialData';

/**
 * 예약 알림 전송 주소 (Google Apps Script 웹 앱 URL)
 *
 * 설정 방법은 docs/reservation-notify/설정방법.md 를 참고하세요.
 * 주소를 넣기 전(빈 문자열)에는 알림을 보내지 않습니다.
 * 예: 'https://script.google.com/macros/s/AKfycb.../exec'
 */
export const RESERVATION_NOTIFY_URL =
  'https://script.google.com/macros/s/AKfycbwzRbWwlHvZ5UqdESOFJTaczpR0XG10UykFJvjZvK1bzU5dreNNURbmRy1psg7hZJYkig/exec';

/**
 * 손님이 예약·견적을 신청하면 사장님 휴대폰으로 문자 알림을 보냅니다.
 * 실제 발송은 Apps Script가 처리하고, 이 함수는 예약 내용만 전달합니다.
 * 알림 실패가 손님의 예약 완료 화면을 막지 않도록 오류는 조용히 넘깁니다.
 */
export async function notifyReservation(r: Reservation): Promise<void> {
  if (!RESERVATION_NOTIFY_URL) return;

  const payload = {
    reservation_id: r.reservation_id,
    created_at: r.created_at,
    customer_name: r.customer_name,
    phone: r.phone,
    email: r.email === 'guest@linkclean.co.kr' ? '' : r.email,
    service: SERVICE_DETAILS[r.service_type]?.name || r.service_type,
    visit_date: r.visit_date,
    visit_time: r.visit_time,
    address: [r.address, r.address_detail].filter(Boolean).join(' '),
    property_type: r.property_type,
    area: r.area,
    message: r.customer_message,
    photo_count: r.uploaded_images?.length || 0,
    page: typeof window !== 'undefined' ? window.location.href : '',
    website: '', // 스팸 봇 차단용 빈 칸 (봇이 채우면 무시)
  };

  try {
    // text/plain + no-cors: Apps Script로 보낼 때 브라우저 사전 요청(CORS) 없이 전송
    await fetch(RESERVATION_NOTIFY_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // 알림 실패는 무시 (예약 자체는 정상 처리)
  }
}
