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
  'https://script.google.com/macros/s/AKfycbxW517Oxd8fuq8o0gazO0hsZCx4wQ3Ow0nWzqjMvdxMogPrs26DhL_IIKSUcQ--jGM4lQ/exec';

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
    message: [r.cleaning_date_hint ? `청소희망일: ${r.cleaning_date_hint}` : '', r.customer_message]
      .filter(Boolean)
      .join(' / '),
    cleaning_date: r.cleaning_date_hint || '',
    photo_count: r.uploaded_images?.length || 0,
    page: typeof window !== 'undefined' ? window.location.href : '',
    website: '', // 스팸 봇 차단용 빈 칸 (봇이 채우면 무시)
  };

  const body = JSON.stringify(payload);

  // 아이폰 사파리는 다른 사이트로 보내는 fetch/sendBeacon을 조용히 막는 경우가 있어,
  // 모든 브라우저에서 확실히 전송되는 "숨은 양식 제출(form POST)" 방식을 사용합니다.
  try {
    sendViaHiddenForm(RESERVATION_NOTIFY_URL, body);
  } catch (err) {
    console.warn('[예약 알림] 전송 실패', err);
  }
}

/**
 * 화면에 보이지 않는 iframe으로 form POST를 보냅니다.
 * enctype="text/plain" 양식은 "이름=값" 형태로 전송되므로,
 * JSON의 마지막 } 앞을 이름으로, "} 를 값으로 넣어 본문 전체가 그대로 JSON이 되게 합니다.
 *   보내지는 본문 예: {"customer_name":"홍길동", ... ,"_":"="}
 * (Apps Script의 doPost는 받은 본문을 JSON.parse 합니다)
 */
function sendViaHiddenForm(url: string, json: string) {
  if (typeof document === 'undefined') return;

  const frameName = `lc-notify-${Date.now()}`;
  const iframe = document.createElement('iframe');
  iframe.name = frameName;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;';
  document.body.appendChild(iframe);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.target = frameName;
  form.enctype = 'text/plain';
  form.acceptCharset = 'UTF-8';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = json.slice(0, -1) + ',"_":"';
  input.value = '"}';
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();

  // 전송이 끝날 시간을 충분히 준 뒤 정리
  window.setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 60000);
}
