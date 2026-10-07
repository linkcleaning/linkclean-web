// 빌드할 때 제주시·서귀포시 7일 날씨를 받아 public/weather.json 으로 저장합니다.
// 자료: 노르웨이 기상청(MET Norway) Locationforecast 2.0 — CC BY 4.0, 상업적 이용 가능(출처 표시)
// 실패해도 빌드는 계속됩니다(홈페이지는 날씨 칸만 숨김).
import fs from 'node:fs';
import path from 'node:path';

const CITIES = {
  jeju: { lat: 33.4996, lon: 126.5312 }, // 제주시청 부근
  seogwipo: { lat: 33.2541, lon: 126.5601 }, // 서귀포시청 부근
};
const UA = 'LinkClean-Website/1.0 (+https://www.linkclean.co.kr)';
const OUT = path.resolve('public/weather.json');
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const kst = (iso) => {
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return { date: d.toISOString().slice(0, 10), hour: d.getUTCHours() };
};

const SEVERITY = ['clearsky', 'fair', 'partlycloudy', 'cloudy', 'fog', 'showers', 'rain', 'sleet', 'snow', 'thunder'];
const sev = (code) => {
  let s = 0;
  SEVERITY.forEach((k, i) => {
    if (code.includes(k)) s = Math.max(s, i);
  });
  return s;
};

function condition(code, windMax, rainMm) {
  const wet = rainMm >= 1;
  if (wet && code.includes('thunder')) return ['rain', '뇌우'];
  if (wet && code.includes('snow')) return ['rain', '눈'];
  if (wet && code.includes('sleet')) return ['rain', '진눈깨비'];
  if (wet && code.includes('showers')) return ['rain', '소나기'];
  if (wet && code.includes('rain')) return ['rain', '비'];
  if (windMax >= 9) return ['windy', '바람 강함'];
  if (code.includes('fog')) return ['fog', '안개'];
  if (code.includes('cloudy') && !code.includes('partly')) return ['cloudy', '흐림'];
  if (code.includes('partlycloudy')) return ['cloudy', '구름조금'];
  if (code.includes('fair')) return ['sunny', '대체로 맑음'];
  if (wet) return ['rain', '비'];
  return ['sunny', '맑음'];
}

function cleaning(cond, rainProb, rainMm, humidity, wind) {
  if (cond === 'rain' && (rainMm >= 5 || rainProb >= 60)) {
    return ['주의', '비 소식이 있어요. 외부 창·베란다 청소는 피하고 실내 위주로 하신 뒤 제습을 충분히 해주세요.'];
  }
  if (wind >= 10) {
    return ['주의', '바람이 강해요. 창틀로 모래·먼지가 다시 들어오기 쉬워 외부 창 청소는 다른 날을 추천합니다.'];
  }
  if (cond === 'rain' || humidity >= 85 || rainProb >= 40) {
    return ['보통', '습도가 높아요. 청소 후 제습기나 에어컨 제습으로 물기를 꼭 말려야 곰팡이를 막을 수 있습니다.'];
  }
  if (humidity < 70 && wind < 7 && (cond === 'sunny' || cond === 'cloudy')) {
    return ['매우좋음', '건조하고 바람도 잔잔해요. 이사·입주청소와 창문·베란다 세척, 환기 마무리에 가장 좋은 날입니다.'];
  }
  return ['좋음', '무난한 날씨예요. 실내 청소 후 창문을 열어 충분히 환기해 주세요.'];
}

async function fetchCity({ lat, lon }) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`MET ${res.status}`);
  const json = await res.json();
  const series = json?.properties?.timeseries || [];

  const byDay = new Map();
  for (const e of series) {
    const { date, hour } = kst(e.time);
    if (!byDay.has(date)) byDay.set(date, { temps: [], hum: [], wind: [], rain: 0, prob: [], symbols: [] });
    const d = byDay.get(date);
    const inst = e.data?.instant?.details || {};
    if (typeof inst.air_temperature === 'number') d.temps.push(inst.air_temperature);
    if (typeof inst.relative_humidity === 'number') d.hum.push(inst.relative_humidity);
    if (typeof inst.wind_speed === 'number') d.wind.push(inst.wind_speed);

    const n1 = e.data?.next_1_hours;
    const n6 = e.data?.next_6_hours;
    if (n1) {
      d.rain += n1.details?.precipitation_amount || 0;
      if (typeof n1.details?.probability_of_precipitation === 'number') d.prob.push(n1.details.probability_of_precipitation);
      if (hour >= 8 && hour <= 19 && n1.summary?.symbol_code) d.symbols.push(n1.summary.symbol_code);
    } else if (n6) {
      d.rain += n6.details?.precipitation_amount || 0;
      if (typeof n6.details?.air_temperature_max === 'number') d.temps.push(n6.details.air_temperature_max);
      if (typeof n6.details?.air_temperature_min === 'number') d.temps.push(n6.details.air_temperature_min);
      if (hour >= 3 && hour <= 15 && n6.summary?.symbol_code) d.symbols.push(n6.summary.symbol_code);
    }
    if (n6 && typeof n6.details?.probability_of_precipitation === 'number') d.prob.push(n6.details.probability_of_precipitation);
  }

  const today = kst(new Date().toISOString()).date;
  const days = [...byDay.keys()].filter((k) => k >= today).sort().slice(0, 7);

  return days
    .map((date) => {
      const d = byDay.get(date);
      if (!d.temps.length) return null;
      const rainMm = Math.round(d.rain * 10) / 10;
      const windMax = d.wind.length ? Math.max(...d.wind) : 0;
      const humidity = d.hum.length ? Math.round(d.hum.reduce((a, b) => a + b, 0) / d.hum.length) : 0;
      const rainProb = d.prob.length ? Math.round(Math.max(...d.prob)) : null;
      // 낮 시간 날씨 중 가장 "궂은" 것을 대표로 (단, 비가 1mm 미만이면 비 아이콘은 쓰지 않음)
      const code = d.symbols.sort((a, b) => sev(b) - sev(a))[0] || 'cloudy';
      const [cond, condText] = condition(code, windMax, rainMm);
      const [idx, tip] = cleaning(cond, rainProb ?? 0, rainMm, humidity, windMax);
      return {
        date,
        dayOfWeek: DAYS[new Date(date + 'T00:00:00Z').getUTCDay()],
        dayLabel: '',
        condition: cond,
        conditionText: condText,
        tempHigh: Math.round(Math.max(...d.temps)),
        tempLow: Math.round(Math.min(...d.temps)),
        humidity,
        windSpeed: Math.round(windMax * 10) / 10,
        rainProb,
        rainMm,
        cleaningIndex: idx,
        cleaningTip: tip,
      };
    })
    .filter(Boolean);
}

try {
  const cities = {};
  for (const [name, c] of Object.entries(CITIES)) cities[name] = await fetchCity(c);
  if (!cities.jeju.length || !cities.seogwipo.length) throw new Error('빈 예보');
  const out = {
    updatedAt: new Date().toISOString(),
    source: 'MET Norway (api.met.no), CC BY 4.0',
    cities,
  };
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log(`[weather] 저장 완료: ${cities.jeju.length}일 / ${cities.seogwipo.length}일`);
} catch (err) {
  console.warn('[weather] 날씨를 받지 못했습니다 (빌드는 계속):', err.message);
}
