
import React from 'react';
import { Home, Building2, SprayCan, Sparkles, Wind, Droplets } from 'lucide-react';
import { ServiceCard, Testimonial } from './types';

export const SERVICES: ServiceCard[] = [
  {
    id: 'move-in',
    title: '입주 / 이사 청소',
    description: '신축 아파트의 공사 분진과 유해 물질을 완벽히 제거하여 쾌적한 첫 시작을 도와드립니다.',
    icon: 'sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'living',
    title: '거주 청소',
    description: '생활 중 쌓인 찌든 때와 보이지 않는 먼지까지, 일상을 리프레시하는 정밀 케어 서비스입니다.',
    icon: 'home',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'commercial',
    title: '상가 / 사무실 청소',
    description: '기업의 이미지를 높이는 쾌적한 비즈니스 환경을 위해 체계적인 관리 솔루션을 제공합니다.',
    icon: 'building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'aircon',
    title: '에어컨 분해 청소',
    description: '제주의 높은 습도로 인한 에어컨 내부 곰팡이와 세균을 고압 스팀으로 완전 박멸합니다.',
    icon: 'wind',
    image: 'https://images.unsplash.com/photo-1621905252507-b35482cd84b4?auto=format&fit=crop&q=80&w=800'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: '김지현',
    location: '제주시 노형동',
    content: '이사 청소 맡겼는데 정말 구석구석 깨끗해서 놀랐어요. 상담도 친절하십니다.',
    rating: 5
  },
  {
    id: 2,
    author: '박상준',
    location: '서귀포시 강정동',
    content: '에어컨 청소 받고 나니 냄새도 안 나고 너무 시원하네요. 제주에서 제일 믿음직해요.',
    rating: 5
  }
];

export const ICONS = {
  home: <Home className="w-6 h-6" />,
  building: <Building2 className="w-6 h-6" />,
  spray: <SprayCan className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  wind: <Wind className="w-6 h-6" />,
  droplet: <Droplets className="w-6 h-6" />
};
