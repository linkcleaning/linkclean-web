/**
 * 링크클린 예약 알림 (Google Apps Script)
 *
 * 홈페이지에서 손님이 예약·견적을 신청하면
 *   1) 구글 시트에 한 줄씩 기록하고
 *   2) 사장님 메일로 예약 내용을 보내고
 *   3) 사장님 휴대폰으로 문자를 보냅니다 (솔라피 API 키를 넣었을 때만)
 *
 * 설치 방법: 같은 폴더의 「설정방법.md」 참고
 */

const CONFIG = {
  OWNER_EMAIL: 'linkdole@naver.com', // 알림 받을 메일
  OWNER_PHONE: '01090900440',        // 문자 받을 번호
  SMS_FROM: '01090900440',           // 솔라피에 등록한 발신번호
  SHEET_NAME: '예약접수',
  MAX_PER_HOUR: 30,                  // 1시간에 이 숫자를 넘으면 알림 중단 (스팸·요금 폭탄 방지)
};

/** 홈페이지에서 예약이 들어오면 실행됩니다 */
function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (d.website) return ok_();                    // 스팸 봇
    if (!d.customer_name || !d.phone) return ok_(); // 필수 값 없음
    if (!underRateLimit_()) return ok_();

    const r = clean_(d);
    saveToSheet_(r);
    sendEmail_(r);
    sendSms_(r);
  } catch (err) {
    console.error(err);
  }
  return ok_();
}

/** 브라우저로 주소를 열었을 때 동작 확인용 */
function doGet() {
  return ContentService.createTextOutput('링크클린 예약 알림이 작동 중입니다.');
}

/** 설치 후 편집기에서 한 번 실행해 보세요 (메일·문자·시트 테스트) */
function testNotify() {
  const sample = clean_({
    reservation_id: 'LC-TEST-0000',
    created_at: Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm'),
    customer_name: '테스트 고객',
    phone: '010-0000-0000',
    email: 'test@example.com',
    service: '입주·이사청소',
    visit_date: '2026-10-20',
    visit_time: '10:00',
    address: '제주시 노형동 테스트아파트 101동',
    property_type: '아파트',
    area: '32평',
    message: '알림 테스트입니다.',
    photo_count: 2,
  });
  saveToSheet_(sample);
  sendEmail_(sample);
  sendSms_(sample);
}

/* ───────────────────────── 내부 함수 ───────────────────────── */

function clean_(d) {
  const s = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
  return {
    id: s(d.reservation_id, 40),
    createdAt: s(d.created_at, 30) || Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm'),
    name: s(d.customer_name, 40),
    phone: s(d.phone, 30),
    email: s(d.email, 80),
    service: s(d.service, 40),
    date: s(d.visit_date, 20),
    time: s(d.visit_time, 10),
    address: s(d.address, 200),
    propertyType: s(d.property_type, 30),
    area: s(d.area, 30),
    message: s(d.message, 1000),
    photos: Number(d.photo_count) || 0,
  };
}

function saveToSheet_(r) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.SHEET_NAME);
    sh.appendRow(['접수시각', '예약번호', '이름', '연락처', '이메일', '서비스', '방문일', '시간', '주소', '건물', '평수', '요청사항', '사진수', '처리상태']);
    sh.setFrozenRows(1);
  }
  // 전화번호가 숫자로 바뀌어 앞자리 0이 사라지지 않도록 앞에 ' 를 붙임
  sh.appendRow([r.createdAt, r.id, r.name, "'" + r.phone, r.email, r.service, r.date, r.time, r.address, r.propertyType, r.area, r.message, r.photos, '신규']);
}

function sendEmail_(r) {
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const row = (k, v) => v ? `<tr><td style="padding:6px 10px;color:#64748b;white-space:nowrap">${k}</td><td style="padding:6px 10px;font-weight:600">${esc(v)}</td></tr>` : '';
  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="color:#0A1D37;margin:0 0 6px">🧹 새 예약이 들어왔어요</h2>
      <p style="color:#64748b;margin:0 0 14px">${esc(r.createdAt)} 접수 · ${esc(r.id)}</p>
      <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px">
        ${row('이름', r.name)}
        ${row('연락처', r.phone)}
        ${row('이메일', r.email)}
        ${row('서비스', r.service)}
        ${row('방문 희망', [r.date, r.time].filter(String).join(' '))}
        ${row('주소', r.address)}
        ${row('건물/평수', [r.propertyType, r.area].filter(String).join(' / '))}
        ${row('요청사항', r.message)}
        ${row('첨부 사진', r.photos ? r.photos + '장 (손님 기기에 있음, 카톡으로 요청)' : '')}
      </table>
      <p style="margin:16px 0 0"><a href="tel:${esc(r.phone.replace(/[^0-9]/g, ''))}" style="background:#38BDF8;color:#0A1D37;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700">📞 손님에게 전화하기</a></p>
    </div>`;
  const text = [
    '새 예약이 들어왔어요',
    `이름: ${r.name}`, `연락처: ${r.phone}`, `서비스: ${r.service}`,
    `방문 희망: ${r.date} ${r.time}`, `주소: ${r.address}`, `요청사항: ${r.message}`,
  ].join('\n');

  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: `[링크클린 예약] ${r.name} · ${r.service} · ${r.date}`,
    body: text,
    htmlBody: html,
    name: '링크클린 홈페이지',
  });
}

function sendSms_(r) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('SOLAPI_API_KEY');
  const apiSecret = props.getProperty('SOLAPI_API_SECRET');
  if (!apiKey || !apiSecret) return; // 문자 설정 전에는 메일만 발송

  const text = [
    '[링크클린 새 예약]',
    `${r.name} ${r.phone}`,
    `${r.service} / ${r.date} ${r.time}`,
    r.address ? `주소: ${r.address}` : '',
    r.area ? `평수: ${r.area}` : '',
  ].filter(String).join('\n');

  const date = new Date().toISOString();
  const salt = Utilities.getUuid().replace(/-/g, '');
  const sigBytes = Utilities.computeHmacSha256Signature(date + salt, apiSecret);
  const signature = sigBytes.map((b) => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');

  const res = UrlFetchApp.fetch('https://api.solapi.com/messages/v4/send', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
    },
    payload: JSON.stringify({ message: { to: CONFIG.OWNER_PHONE, from: CONFIG.SMS_FROM, text } }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() >= 300) {
    console.error('문자 발송 실패: ' + res.getContentText());
  }
}

function underRateLimit_() {
  const cache = CacheService.getScriptCache();
  const key = 'cnt_' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMddHH');
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 3600);
  return n <= CONFIG.MAX_PER_HOUR;
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
