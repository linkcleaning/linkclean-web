import { useEffect, useState } from 'react';
import { JejuCityType, JejuDailyWeather } from '../types';

/**
 * 실제 제주 날씨 (노르웨이 기상청 MET Norway 예보).
 * GitHub에서 3시간마다 자동으로 받아 /weather.json 으로 올려두고, 홈페이지는 그 파일만 읽습니다.
 */
interface WeatherFile {
  updatedAt: string;
  source: string;
  cities: Record<JejuCityType, JejuDailyWeather[]>;
}

let cache: Promise<WeatherFile | null> | null = null;

const loadWeather = (): Promise<WeatherFile | null> => {
  if (!cache) {
    const bucket = Math.floor(Date.now() / (30 * 60 * 1000)); // 30분 단위로 새로 받기
    cache = fetch(`/weather.json?t=${bucket}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return cache;
};

const todayKst = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

/** 오늘 이후 날짜만 남기고 '오늘/내일/모레' 표시를 다시 붙입니다. */
const prepare = (list: JejuDailyWeather[]): JejuDailyWeather[] => {
  const today = todayKst();
  const labels = ['오늘', '내일', '모레'];
  return list
    .filter((d) => d.date >= today)
    .slice(0, 7)
    .map((d, i) => ({ ...d, dayLabel: d.date === today ? '오늘' : labels[i] || '' }));
};

export type WeatherStatus = 'loading' | 'ready' | 'error';

export function useJejuWeather(): {
  status: WeatherStatus;
  get: (city: JejuCityType) => JejuDailyWeather[];
  updatedAt?: string;
} {
  const [file, setFile] = useState<WeatherFile | null>(null);
  const [status, setStatus] = useState<WeatherStatus>('loading');

  useEffect(() => {
    let alive = true;
    loadWeather().then((f) => {
      if (!alive) return;
      const ok = !!f && prepare(f.cities?.jeju || []).length >= 2;
      setFile(ok ? f : null);
      setStatus(ok ? 'ready' : 'error');
    });
    return () => {
      alive = false;
    };
  }, []);

  return {
    status,
    get: (city) => (file ? prepare(file.cities?.[city] || []) : []),
    updatedAt: file?.updatedAt,
  };
}
