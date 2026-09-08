import { JejuCityType, JejuDailyWeather } from '../types';

export const JEJU_CITY_WEATHER_7DAYS: JejuDailyWeather[] = [
  {
    date: '2026-09-08',
    dayOfWeek: '월',
    dayLabel: '오늘',
    condition: 'sunny',
    conditionText: '맑음',
    tempHigh: 27,
    tempLow: 21,
    humidity: 58,
    windSpeed: 2.8,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '쾌청하고 선선한 날씨! 이사·입주청소 및 베란다 통창문 환기 세척 최적의 날입니다.'
  },
  {
    date: '2026-09-09',
    dayOfWeek: '화',
    dayLabel: '내일',
    condition: 'cloudy',
    conditionText: '구름많음',
    tempHigh: 26,
    tempLow: 22,
    humidity: 65,
    windSpeed: 3.2,
    rainProb: 20,
    cleaningIndex: '좋음',
    cleaningTip: '햇빛이 강하지 않아 실외기실 먼지 배출 및 샷시 창틀 레일 찌든 흑먼지 불림 청소에 좋습니다.'
  },
  {
    date: '2026-09-10',
    dayOfWeek: '수',
    dayLabel: '모레',
    condition: 'rain',
    conditionText: '비',
    tempHigh: 24,
    tempLow: 20,
    humidity: 84,
    windSpeed: 4.5,
    rainProb: 75,
    cleaningIndex: '보통',
    cleaningTip: '비 오는 날! 외창 대신 실내 주방 후드 찌든 기름때 박리 및 오븐·가스레인지 딥클린을 추천합니다.'
  },
  {
    date: '2026-09-11',
    dayOfWeek: '목',
    dayLabel: '글피',
    condition: 'cloudy',
    conditionText: '구름많음',
    tempHigh: 25,
    tempLow: 21,
    humidity: 72,
    windSpeed: 3.0,
    rainProb: 30,
    cleaningIndex: '좋음',
    cleaningTip: '비 갠 후 습기가 차기 쉬운 욕실 줄눈 곰팡이 고온 스팀 살균 및 피톤치드 연무 소독을 권장합니다.'
  },
  {
    date: '2026-09-12',
    dayOfWeek: '금',
    dayLabel: '9/12',
    condition: 'sunny',
    conditionText: '맑음',
    tempHigh: 27,
    tempLow: 22,
    humidity: 60,
    windSpeed: 2.5,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '바람이 잔잔하고 건조하여 거실 강마루·원목 바닥 오염 박리 및 친환경 코팅 작업에 최적입니다.'
  },
  {
    date: '2026-09-13',
    dayOfWeek: '토',
    dayLabel: '9/13',
    condition: 'sunny',
    conditionText: '맑음',
    tempHigh: 28,
    tempLow: 23,
    humidity: 62,
    windSpeed: 2.2,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '주말 쾌청! 침구류 털기, 에어컨 필터 분해 세척 및 창문 전면 개방 맞통풍 환기를 진행하세요.'
  },
  {
    date: '2026-09-14',
    dayOfWeek: '일',
    dayLabel: '9/14',
    condition: 'cloudy',
    conditionText: '구름조금',
    tempHigh: 27,
    tempLow: 22,
    humidity: 64,
    windSpeed: 2.9,
    rainProb: 20,
    cleaningIndex: '좋음',
    cleaningTip: '가을맞이 옷장 묵은 먼지 정리와 싱크대 상하부장 탈거 진공 청소로 한 주를 상쾌하게 마무리하세요.'
  }
];

export const SEOGWIPO_CITY_WEATHER_7DAYS: JejuDailyWeather[] = [
  {
    date: '2026-09-08',
    dayOfWeek: '월',
    dayLabel: '오늘',
    condition: 'sunny',
    conditionText: '맑고 온화',
    tempHigh: 28,
    tempLow: 22,
    humidity: 66,
    windSpeed: 2.4,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '서귀포 해풍 건조 최적일! 발코니 샷시 소금기 물세척과 오션뷰 유리창 스퀴지 클리닝 추천.'
  },
  {
    date: '2026-09-09',
    dayOfWeek: '화',
    dayLabel: '내일',
    condition: 'cloudy',
    conditionText: '흐림·해무',
    tempHigh: 26,
    tempLow: 23,
    humidity: 78,
    windSpeed: 3.5,
    rainProb: 30,
    cleaningIndex: '보통',
    cleaningTip: '남부 해무로 다습 주의! 욕실 환풍기 돔 커버 탈거 세척과 배수구 트랩 고온 살균을 진행하세요.'
  },
  {
    date: '2026-09-10',
    dayOfWeek: '수',
    dayLabel: '모레',
    condition: 'rain',
    conditionText: '비·강풍',
    tempHigh: 23,
    tempLow: 21,
    humidity: 89,
    windSpeed: 5.2,
    rainProb: 80,
    cleaningIndex: '주의',
    cleaningTip: '강수 및 다습 경보! 외창 청소는 피하고, 실내 결로 취약부 곰팡이 방지 젤 도포 및 제습 관리를 추천합니다.'
  },
  {
    date: '2026-09-11',
    dayOfWeek: '목',
    dayLabel: '글피',
    condition: 'cloudy',
    conditionText: '구름많음',
    tempHigh: 26,
    tempLow: 22,
    humidity: 74,
    windSpeed: 3.1,
    rainProb: 20,
    cleaningIndex: '좋음',
    cleaningTip: '비 갠 후 실내 제습 완료 후 맞바람 환기! 베란다 탄성코트 곰팡이 억제 항균 코팅 권장.'
  },
  {
    date: '2026-09-12',
    dayOfWeek: '금',
    dayLabel: '9/12',
    condition: 'sunny',
    conditionText: '맑음',
    tempHigh: 28,
    tempLow: 22,
    humidity: 63,
    windSpeed: 2.1,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '청명한 하늘! 중문·서호동 등 전원주택 테라스 고압 세척 및 방충망 먼지 딥클린에 안성맞춤.'
  },
  {
    date: '2026-09-13',
    dayOfWeek: '토',
    dayLabel: '9/13',
    condition: 'sunny',
    conditionText: '맑고 쾌청',
    tempHigh: 29,
    tempLow: 23,
    humidity: 64,
    windSpeed: 2.0,
    rainProb: 10,
    cleaningIndex: '매우좋음',
    cleaningTip: '주말 쾌청한 햇살! 침실 매트리스 자외선 소독과 패브릭 소파 스팀 살균 작업에 적합합니다.'
  },
  {
    date: '2026-09-14',
    dayOfWeek: '일',
    dayLabel: '9/14',
    condition: 'sunny',
    conditionText: '맑음',
    tempHigh: 28,
    tempLow: 22,
    humidity: 65,
    windSpeed: 2.6,
    rainProb: 15,
    cleaningIndex: '좋음',
    cleaningTip: '현관 신발장 및 전실 타일 줄눈 묵은 때 세척으로 쾌적한 주간을 준비하세요.'
  }
];

export const getJejuWeather = (city: JejuCityType): JejuDailyWeather[] => {
  return city === 'jeju' ? JEJU_CITY_WEATHER_7DAYS : SEOGWIPO_CITY_WEATHER_7DAYS;
};
