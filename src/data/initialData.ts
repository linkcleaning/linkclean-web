import { ServiceDetail, PortfolioItem, ReviewItem, Reservation, User } from '../types';

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'move-in': {
    id: 'move-in',
    name: '입주·이사청소',
    tagline: '새로운 시작을 위한 완벽한 첫걸음, 미세먼지와 시공 잔여물까지 철저하게 제거합니다.',
    description: '신축 입주 시 발생하는 시공 분진, 시멘트 가루, 유해 화학물질 및 기존 거주자의 찌든 때와 묵은 먼지를 고온 스팀과 친환경 세제로 완벽히 케어합니다.',
    mainImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: [
      '신축 아파트, 신축 오피스텔 분진과 독성 물질 제거가 필요한 분',
      '기존 거주자의 흔적, 기름때, 곰팡이가 남아 있는 주택으로 이사하는 분',
      '영유아 또는 호흡기 질환이 있는 가족이 함께 입주하는 고객',
      '전문 장비로 보이지 않는 서랍장 안쪽, 몰딩 틈새까지 정밀 청소를 원하는 분'
    ],
    scopeList: [
      {
        title: '현관 및 전실',
        items: ['신발장 내부 선반 탈거 세척', '현관 바닥 타일 오염 및 틈새 줄눈 청소', '현관문 내외부 스티커/먼지 제거', '센서등 및 거울 광택 케어']
      },
      {
        title: '주방 (완전 분리 청소)',
        items: ['싱크대 상/하부장 선반 및 칼꽂이 탈거 세척', '가스레인지/인덕션 기름때 및 탄 자국 정밀 세척', '후드 필터 약품 세척 및 기름 흡착판 정비', '걸레받이 탈거 후 하부 시공 먼지 흡입']
      },
      {
        title: '욕실 및 화장실',
        items: ['천장 돔 환풍기 커버 탈거 및 내부 분진 제거', '타일 벽면 및 바닥 물때, 비누때, 곰팡이 고온 스팀 살균', '배수구 트랩 탈거 및 살균 세척', '수전 및 도기류 스케일 제거 및 유리막 코팅 광택']
      },
      {
        title: '방, 거실 및 창호',
        items: ['천장 몰딩, 걸레받이 풀 자국 및 도배풀 정밀 제거', '전등갓 탈거 후 날벌레 및 내부 먼지 청소', '스위치, 콘센트, 인터폰 미세 분진 제거', '창틀 및 방충망 먼지 특수 브러시 흡입']
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '현장 실측 및 오염 진단', desc: '자재별(원목, 대리석, 하이그로시 등) 특성을 파악하고 맞춤 전용 약품과 장비를 배정합니다.' },
      { step: '02', title: '탈거 및 분리 작업', desc: '서랍장, 배수구, 환풍기 커버, 전등갓, 후드필터, 에어컨 필터 등 탈거 가능한 모든 부품을 분리합니다.' },
      { step: '03', title: '정밀 청소 및 분진 흡입', desc: '산업용 헤파필터 진공청소기와 친환경 전용 세제로 구석구석 정밀 클리닝을 진행합니다.' },
      { step: '04', title: '고온 스팀 살균 소독', desc: '140도 고온 스팀기로 싱크대, 배수구, 변기, 욕실 타일을 철저하게 살균합니다.' },
      { step: '05', title: '고객 현장 검수 및 완료', desc: '고객님과 함께 공간 구석구석을 확인하고 미비점 즉각 보완 후 정식 인계합니다.' }
    ],
    faqs: [
      {
        question: '청소 시간은 대략 얼마나 소요되나요?',
        answer: '공급면적 24~34평 기준 평균 6~7시간 정도 소요되며, 현장 오염도와 분진 상태에 따라 전문 인력이 꼼꼼하게 작업하여 최상의 품질을 보장합니다.'
      },
      {
        question: '방문 견적 시 어떤 점을 직접 확인하시나요?',
        answer: '평수(공급면적) 외에도 창문 갯수, 샷시 노후도, 곰팡이 상태, 베란다 확장 여부, 빌트인 가전 내부 청소 여부, 시공 분진 상태를 직접 확인하여 당일 현장에서 추가금이 발생하는 불상사를 사전에 원천 방지합니다.'
      },
      {
        question: '친환경 약품을 사용하나요?',
        answer: '네, 링크클린은 인체에 무해한 친환경 생분해 세제와 전문 스팀기를 사용하여 영유아나 반려동물이 있는 가정에서도 안심할 수 있습니다.'
      }
    ]
  },
  'residential': {
    id: 'residential',
    name: '거주청소',
    tagline: '일상 속에 쌓인 묵은 때와 보이지 않는 세균까지, 가족의 건강을 되찾아드립니다.',
    description: '가구와 짐이 있는 상태에서 생활 오염, 주방 찌든 기름때, 화장실 곰팡이, 창틀 미세먼지를 안전하게 집중 케어하여 호텔 같은 쾌적함을 선사합니다.',
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: [
      '맞벌이, 육아 등으로 바빠 대청소를 미뤄두셨던 가정',
      '환절기 비염, 아토피 등으로 집안 대청소 및 살균이 시급한 고객',
      '부모님 댁이나 가족을 위한 특별한 주거 공간 클린 케어 선물',
      '주방 기름때나 욕실 물때를 개인이 지우기 힘들어 전문가 손길이 필요한 분'
    ],
    scopeList: [
      {
        title: '거실 및 침실 공간',
        items: ['가구 표면 및 상단 묵은 먼지 정전기 클리닝', '바닥 마루 맞춤 세정제 도포 및 오염수 흡입', '창틀 먼지 및 방충망 케어', '실내 공기 살균 피톤치드 분사']
      },
      {
        title: '주방 생활 오염 집중 케어',
        items: ['가스렌지 화구 및 삼발이 분리 세척', '상하부장 도어 손때 및 기름막 제거', '주방 벽면 타일 유증기 얼룩 제거', '배수구 악취 원인 슬러지 제거 및 살균']
      },
      {
        title: '욕실 및 베란다',
        items: ['샤워부스 물때 및 유리 백화현상 복원 세척', '실리콘 및 타일 틈새 곰팡이 박멸 케어', '세면대/변기 요석 및 찌든 오염 제거', '베란다 바닥 물청소 및 배수구 트랩 정비']
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '사전 보호 작업', desc: '고객님의 소중한 가구 및 물품을 안전하게 보호하고 작업 동선을 확보합니다.' },
      { step: '02', title: '구역별 오염 분리', desc: '주방 기름때, 욕실 물때, 창틀 먼지 등 구역별 특화된 세제와 도구를 준비합니다.' },
      { step: '03', title: '디테일 수작업 클리닝', desc: '가전 외관과 틈새까지 스크래치 없이 부드러운 극세사와 스팀으로 정밀 작업합니다.' },
      { step: '04', title: '탈취 및 살균 마무리', desc: '친환경 피톤치드 연무 소독으로 집안 전체의 냄새와 유해 세균을 잡습니다.' }
    ],
    faqs: [
      {
        question: '집에 짐이 많은데 거주청소가 가능한가요?',
        answer: '네, 거주청소는 짐이 있는 상태에서 진행되며 사전 방문 견적 시 가구 배치와 짐 이동 범위를 확인하여 안전하게 진행합니다.'
      },
      {
        question: '청소 중 귀중품은 어떻게 보관해야 하나요?',
        answer: '현금, 귀금속, 중요 서류 등은 사전에 고객님께서 별도 보관해주시면 보다 안전하고 원활하게 작업이 진행됩니다.'
      }
    ]
  },
  'commercial': {
    id: 'commercial',
    name: '상가청소',
    tagline: '고객이 문을 열고 들어서는 첫인상, 매출을 올리는 청결한 매장을 완성합니다.',
    description: '카페, 식당, 헤어샵, 피트니스, 학원 등 고객 접객 공간의 바닥 왁스 코팅, 유리창 투명도 복원, 주방 후드 유지관리 및 오픈 전 클리닝을 제공합니다.',
    mainImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: [
      '신규 매장 인테리어 공사 후 그랜드 오픈을 앞둔 대표님',
      '바닥 찌든 때 제거 및 데코타일/에폭시 왁스 코팅이 필요한 매장',
      '대형 쇼윈도우 유리창과 어닝, 간판 주변을 투명하게 정비하고 싶은 매장',
      '위생 점검 대비 및 고객 만족도를 극대화하고 싶은 프랜차이즈 및 요식업체'
    ],
    scopeList: [
      {
        title: '홀 및 쇼윈도우',
        items: ['대형 통유리창 물때 및 양면 스퀴지 작업', '출입문 손잡이, 금속 프레임 광택 복원', '테이블, 의자 및 진열대 미세 오염 딥클리닝', '바닥 기계 세척(돌돌이) 및 고급 수지 왁스 코팅']
      },
      {
        title: '주방 및 조리공간 (외식업)',
        items: ['업소용 대형 후드 및 닥트 기름 슬러지 약품 박리', '튀김기, 그리들, 가스렌지 화구 탄 오염 제거', '바닥 트렌치 배수구 기름찌꺼기 세척 및 소독', '벽면 SUS 스테인리스 광택제 도포']
      },
      {
        title: '고객 편의시설',
        items: ['매장 내 화장실 요석 제거 및 위생 향기 케어', '대기석 및 카운터 포스기 주변 위생 클리닝', '에어컨 필터 및 송풍구 분진 세척']
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '상업 공간 현장 진단', desc: '업종 특성과 동선, 바닥 재질(타일, 에폭시, 원목)에 따른 전용 공법을 수립합니다.' },
      { step: '02', title: '영업 시간 외 맞춤 시공', desc: '야간 또는 이른 새벽 시간대를 협의하여 영업에 지장 없이 신속하게 작업합니다.' },
      { step: '03', title: '전문 장비 바닥 박리', desc: '고회전 바닥 청소기로 묵은 왁스와 기름때를 박리하고 잔여물을 완벽 흡입합니다.' },
      { step: '04', title: '2중 코팅 및 검수', desc: '내구성이 뛰어난 프리미엄 코팅제를 2회 도포 건조하여 매장의 품격을 높입니다.' }
    ],
    faqs: [
      {
        question: '영업이 끝난 야간이나 오픈 전 새벽 시간에도 작업이 가능한가요?',
        answer: '네, 상가 고객님의 영업 스케줄을 최우선으로 고려하여 심야 작업 및 새벽 시간대 예약 시공을 지원합니다.'
      },
      {
        question: '정기 관리 계약도 가능한가요?',
        answer: '방문 견적 후 주 1회, 격주, 월 1회 등 매장 규모에 맞춘 정기 관리 프로그램을 합리적인 견적으로 설계해드립니다.'
      }
    ]
  },
  'office': {
    id: 'office',
    name: '사무실청소',
    tagline: '직원의 업무 몰입도와 건강을 지키는 쾌적하고 청결한 비즈니스 환경을 만듭니다.',
    description: '오피스 사옥 이전, 리모델링 준공 청소, 바닥 카페트 세척, 유리 파티션 클리닝, 탕비실 및 회의실 위생 관리를 전담합니다.',
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: [
      '사무실 이전 및 인테리어 공사 후 입주 청소가 필요한 기업',
      '공용 카페트 얼룩, 진드기, 미세먼지 습식 세척이 필요한 오피스',
      '유리 파티션 지문, 회의실 화이트보드, 탕비실 악취를 해결하고 싶은 곳',
      '정기적인 오피스 방역과 쾌적한 사내 복지 환경을 조성하고 싶은 경영진'
    ],
    scopeList: [
      {
        title: '업무 공간 및 회의실',
        items: ['개인 책상 및 모니터/키보드 미세 먼지 건식 케어', '회의실 대형 테이블 및 프리젠테이션 기기 클리닝', '유리 파티션 손자국 제거 및 정전기 방지 처리', '바닥 왁스 코팅 또는 타일 세정']
      },
      {
        title: '카페트 및 패브릭',
        items: ['타일 카페트 고압 분사 린스 습식 세척', '커피, 음료수 얼룩 특수 용제 추출 작업', '진드기 구제 및 피톤치드 멸균']
      },
      {
        title: '탕비실 및 공용 편의구역',
        items: ['싱크대 배수구 물때 및 냉장고 외관 세척', '정수기 주변 및 전자레인지 내부 기름때 제거', '분리수거대 세척 및 소독']
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '기업 현장 방문 견적', desc: '사무공간 평수, 파티션 소재, 바닥 마감재를 점검하고 보안 준수 사항을 확인합니다.' },
      { step: '02', title: '주말/공휴일 일정 조율', desc: '업무 방해를 최소화하기 위해 주말 및 휴일 시공 플랜을 수립합니다.' },
      { step: '03', title: '구역별 전문 장비 가동', desc: '대형 산업용 진공 집진기 및 카페트 세척기를 투입하여 무결점 시공을 진행합니다.' },
      { step: '04', title: '최종 보고서 및 세금계산서 발급', desc: '담당자 현장 확인 후 전자세금계산서 발행 및 작업 보고서를 전달합니다.' }
    ],
    faqs: [
      {
        question: '세금계산서 발행 및 법인 카드 결제가 가능한가요?',
        answer: '네, 모든 서비스는 법인 카드 결제 및 전자세금계산서 발행이 100% 가능합니다.'
      },
      {
        question: '사무실 보안 규정이 엄격한데 괜찮을까요?',
        answer: '링크클린의 모든 작업원은 철저한 신원 보증과 보안 서약서를 제출하며 작업 시 사내 보안 규정을 엄격히 준수합니다.'
      }
    ]
  },
  'partial': {
    id: 'partial',
    name: '부분청소',
    tagline: '원하는 구역만 콕 찝어 집중 케어, 주방·욕실·창틀 맞춤 부분 클리닝 솔루션을 드립니다.',
    description: '전체 청소가 부담스러우시거나 관리가 시급한 주방 기름때, 욕실 물때 및 곰팡이, 베란다 및 창틀 묵은 때 등 필요한 공간만 선택하여 합리적인 견적으로 진행합니다.',
    mainImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    recommendedFor: [
      '전체 청소 대신 주방 또는 화장실만 집중 청소하고 싶은 분',
      '베란다 벽면과 결로 곰팡이가 심해 특수 약품 처리가 필요한 가정',
      '뿌옇게 변한 아파트 외부 이중창과 창틀 찌든 먼지만 깨끗하게 복원하고 싶은 고객',
      '원룸이나 특정 공간의 묵은 오염만 합리적인 비용으로 해결하고 싶은 분'
    ],
    scopeList: [
      {
        title: '주방 및 욕실 집중 케어',
        items: ['주방 후드 및 싱크대 단독 정밀 세척', '욕실 2개실 고온 스팀 곰팡이 박멸 단독 코스', '배수구 살균 세척 및 수전 물때 복원']
      },
      {
        title: '특수 창문 및 창틀 클리닝',
        items: ['자석식 특수 외창 청소 장비로 내부에서 외창 양면 세척', '창틀 레일 묵은 흑먼지 및 찌든 오염 제거', '선명한 조망권 복원']
      },
      {
        title: '곰팡이/결로 특수 복구',
        items: ['곰팡이 뿌리까지 사멸시키는 친환경 중화 약품 침투', '항균 및 항곰팡이 억제 코팅제 도포', '베란다 타일 고압 세척']
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '상태 사진 및 현장 상담', desc: '고객님이 필요로 하는 부위를 정확히 파악하여 필요한 범위만 견적을 산출합니다.' },
      { step: '02', title: '특수 약품 및 도구 준비', desc: '외창 장비, 곰팡이 박리제, 고압 스팀기 등 전문 특수 장비를 준비합니다.' },
      { step: '03', title: '선택 구역 정밀 시공', desc: '해당 부위의 오염 원인을 근본적으로 제거하고 2차 오염을 방지합니다.' }
    ],
    faqs: [
      {
        question: '화장실 하나만 청소해도 방문해주시나요?',
        answer: '네, 링크클린은 필요한 구역만 선택 가능한 맞춤 부분 청소 서비스를 제공하고 있으니 부담 없이 방문 견적을 신청해주세요.'
      },
      {
        question: '부분 청소 시에도 전문 고온 스팀 장비를 사용하나요?',
        answer: '네, 주방 및 욕실 부분 청소 시에도 본사 정규팀의 고온 스팀기와 친환경 약품이 동일하게 투입되어 최상의 살균 효과를 보장합니다.'
      }
    ]
  },
  'trash': {
    id: 'trash',
    name: '쓰레기집청소',
    tagline: '혼자서 해결하기 힘든 방치된 공간, 100% 비밀보장과 신속한 특수 정리를 약속합니다.',
    description: '대량의 생활 폐기물 수거 및 분리 배출, 악취 제거를 위한 특수 탈취 소독, 찌든 오염과 해충 방제까지 원스톱으로 깨끗한 일상의 공간으로 되돌려드립니다.',
    mainImage: '/images/trash_house_before.jpg',
    recommendedFor: [
      '바쁜 일상이나 개인 사정으로 쓰레기 배출이 누적되어 엄두가 안 나는 분',
      '이사를 앞두고 집안 내 방치된 대량의 쓰레기와 폐기물 정리가 시급한 고객',
      '이웃 눈치 없이 신속하고 조용한 비대면 및 100% 비밀보장 정리를 원하는 분',
      '쓰레기 배출 후 남은 찌든 오염, 악취 탈취, 해충 방제 소독까지 원스톱 해결이 필요한 분'
    ],
    scopeList: [
      {
        title: '비밀보장 및 폐기물 분리 배출',
        items: [
          '불투명 마대 자루 사용 및 조용한 수거로 완벽한 이웃 비밀보장',
          '재활용품, 일반 쓰레기, 대형 폐기물 법적 규정 맞춤 분리 배출',
          '중요 서류, 귀중품, 통장 등 고객 확인 필요 물품 사전 안전 분류'
        ]
      },
      {
        title: '특수 딥클린 및 바닥 복원',
        items: [
          '바닥 찌든 얼룩, 유기물 침착 오염 전용 약품 박리 세척',
          '주방 부패 음식물 잔여물 및 싱크대 묵은 때 완전 제거',
          '욕실 타일 곰팡이 및 변기/세면대 고온 스팀 박멸'
        ]
      },
      {
        title: '악취 중화 및 안심 방역 소독',
        items: [
          '전문 오존 탈취기 및 피톤치드 연무 분사로 실내 악취 분자 분해',
          '해충(바퀴벌레, 초파리 등) 유인 방제 약품 도포 및 멸균 방역',
          '청소 후 즉시 쾌적한 생활이 가능한 실내 공기 환경 조성'
        ]
      }
    ],
    workImages: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
    ],
    processSteps: [
      { step: '01', title: '비대면 안심 상담 및 견적', desc: '사진 접수 또는 방문을 통해 프라이버시를 철저히 지키며 폐기물 양과 작업 범위를 산출합니다.' },
      { step: '02', title: '분류 및 불투명 포장 반출', desc: '중요 물품을 별도 선별 보관하고, 불투명 밀폐 자루로 외부 노출 없이 조용히 반출합니다.' },
      { step: '03', title: '특수 세척 및 바닥 복원', desc: '고온 스팀과 전문 살균 약품으로 방치된 오염과 찌든 때를 구석구석 깨끗이 세척합니다.' },
      { step: '04', title: '오존 탈취 및 방역 멸균', desc: '공기 중 악취와 미세 세균을 박멸하는 오존 탈취 및 피톤치드 방역으로 마무리합니다.' }
    ],
    faqs: [
      {
        question: '이웃들이 모르게 조용히 청소할 수 있나요? (비밀보장)',
        answer: '네, 100% 비밀보장 원칙을 철저히 지킵니다. 불투명 마대 자루를 사용하여 내용물이 보이지 않도록 밀봉 반출하며, 주변 이웃에게 피해나 의심이 가지 않도록 신속하고 조용하게 진행합니다.'
      },
      {
        question: '청소 중 중요한 물건이나 귀중품을 찾아주실 수 있나요?',
        answer: '작업 전 고객님께서 찾으시는 물품 목록(귀금속, 통장, 서류, 사진 등)을 알려주시면 작업 중 발견 즉시 별도 안심 보관함에 모아 고객님께 직접 전달해 드립니다.'
      },
      {
        question: '비대면으로 진행하고 싶은데 가능한가요?',
        answer: '네, 도어락 비밀번호나 스마트키를 공유해주시면 작업 전/중/후 사진을 실시간 메신저로 공유해 드리며 비대면으로 완벽하게 마무리해 드립니다.'
      }
    ]
  }
};

// Aliases for compatibility
SERVICE_DETAILS['special'] = SERVICE_DETAILS['partial'];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-1',
    title: '[제주시 연동] 34평 아파트 주방 아일랜드 후드 찌든 기름때 및 필터 완벽 분해 세척',
    location: '제주시 연동',
    category: '주방',
    representativeImage: '/images/kitchen_hood_after.jpg?v=2',
    beforeImage: '/images/kitchen_hood_before.jpg?v=2',
    afterImage: '/images/kitchen_hood_after.jpg?v=2',
    description: '제주시 연동 34평 아파트 입주 현장입니다. 흡입구와 원형 필터망에 찌들어 있던 끈적한 조리 기름때를 친환경 유지방 분해제와 고온 고압 스팀으로 완전 박리하여 신품 수준의 스테인리스 광택을 복원했습니다.',
    createdAt: '2026-09-02'
  },
  {
    id: 'p-2',
    title: '[제주시 노형동] 원룸·오피스텔 욕실 방치 쓰레기 수거 및 도기·타일 살균 딥클린',
    location: '제주시 노형동',
    category: '욕실',
    representativeImage: '/images/bathroom_after.jpg?v=2',
    beforeImage: '/images/bathroom_before.jpg?v=2',
    afterImage: '/images/bathroom_after.jpg?v=2',
    description: '제주시 노형동 소재 오피스텔 욕실입니다. 바닥에 방치되었던 생활 쓰레기와 빈 용기를 깔끔하게 수거하고, 변기 내부 찌든 때와 타일 줄눈 물때를 친환경 세정제 및 고온 스팀으로 완벽 살균 세척했습니다.',
    createdAt: '2026-08-28'
  },
  {
    id: 'p-3',
    title: '[제주시 애월읍] 48평 전원주택 거실 통창문 및 창틀 묵은 흑먼지 딥클린',
    location: '제주시 애월읍',
    category: '창틀',
    representativeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: '제주시 애월읍 해안가 주택으로 바닷바람과 모래로 수년간 굳어있던 샷시 레일의 흑먼지를 특수 진공 노즐로 흡입하고 고온 스팀과 실리콘 전용 세척포로 순백색을 되찾았습니다.',
    createdAt: '2026-08-25'
  },
  {
    id: 'p-4',
    title: '[제주시 이도이동] 벤처타운 공유오피스 라운지 및 카페트 묵은 오염 세척',
    location: '제주시 이도이동',
    category: '상가',
    representativeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: '제주시 이도이동 60평 오피스 공간입니다. 커피와 음료 얼룩으로 변색된 타일 카페트를 산업용 추출 세척기로 완벽하게 복원하고 실내 피톤치드 방역을 마쳤습니다.',
    createdAt: '2026-08-20'
  },
  {
    id: 'p-5',
    title: '[서귀포시 중문동] 아파트 안방 베란다 결로 곰팡이 박멸 및 코팅',
    location: '서귀포시 중문동',
    category: '베란다',
    representativeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: '서귀포시 중문동 아파트 현장입니다. 겨울철 결로와 습기로 탄성코트 벽면에 번진 검은 곰팡이를 전용 살균 중화제로 말끔히 없애고 곰팡이 재발 방지 항균 코팅을 진행했습니다.',
    createdAt: '2026-08-15'
  },
  {
    id: 'p-6',
    title: '[제주시 외도동] 32평 아파트 거실 원목마루 오염 박리 및 천연 왁스 코팅',
    location: '제주시 외도동',
    category: '거실',
    representativeImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    description: '제주시 외도동 32평형 세대입니다. 마루 표면의 생활 묵은 때를 목재 전용 중성 세제로 세척하고 친환경 목재 보호 왁스를 2회 도포하여 은은한 고급 광택을 살렸습니다.',
    createdAt: '2026-08-10'
  },
  {
    id: 'p-7',
    title: '[제주시 아라동] 원룸 생활 폐기물·배달 용기 전량 수거 및 멸균 바닥 청소',
    location: '제주시 아라동',
    category: '쓰레기집',
    representativeImage: '/images/trash_house_after.jpg?v=2',
    beforeImage: '/images/trash_house_before.jpg?v=2',
    afterImage: '/images/trash_house_after.jpg?v=2',
    description: '제주시 아라동 대학가 원룸 현장입니다. 방 안 가득 쌓여 있던 배달 음식 용기와 생활 쓰레기를 100% 비밀보장 비대면으로 완벽 반출하고, 찌든 바닥 얼룩 및 냄새를 스팀 살균 소독으로 쾌적하게 복원했습니다.',
    createdAt: '2026-08-05'
  },
  {
    id: 'p-8',
    title: '[서귀포시 서호동] 혁신도시 신축 아파트 입주청소 시공분진·도배풀 완벽 제거',
    location: '서귀포시 서호동',
    category: '거실',
    representativeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: '서귀포시 서호동 혁신도시 신축 아파트 입주 현장입니다. 몰딩과 걸레받이, 전등갓, 수납장 서랍 안쪽까지 깊숙이 침투해 있던 미세 시공 분진과 도배풀 가루를 전용 집진기로 3회 이상 완벽 흡입 및 닦아냈습니다.',
    createdAt: '2026-08-01'
  },
  {
    id: 'p-9',
    title: '[서귀포시 안덕면] 오션뷰 베이커리 카페 오픈 전 주방 닥트 및 타일 위생 세척',
    location: '서귀포시 안덕면',
    category: '상가',
    representativeImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: '서귀포시 안덕면 카페 오픈 현장입니다. 주방 배기 닥트와 오븐 주변 조리대 기름때를 전용 케미컬로 분해하고, 홀 바닥 미끄럼 방지 논슬립 세척을 완료했습니다.',
    createdAt: '2026-07-28'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: '김*현 고객님',
    serviceType: '입주·이사청소',
    rating: 5,
    content: '타 업체에서 사진만 보더니 현장에서 추가금을 20만원이나 불렀던 안 좋은 기억이 있어서, 이번엔 직접 방문해서 견적을 내주는 링크클린을 선택했습니다. 오셔서 샷시와 베란다 구조를 꼼꼼히 확인하고 제시해주신 견적 그대로 단 1원의 추가금도 없이 끝났습니다! 걸레받이 아래 먼지까지 싹 청소해주셔서 정말 감동했습니다.',
    photos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'],
    date: '2026-09-03',
    isVisible: true
  },
  {
    id: 'rev-2',
    author: '이*우 고객님',
    serviceType: '사무실청소',
    rating: 5,
    content: '스타트업 사옥 이전하면서 직원들이 바로 일할 수 있게 주말 청소를 요청드렸습니다. 예약할 때 원하는 날짜와 시간을 제가 직접 선택할 수 있어 편리했고, 유리 파티션 지문 하나 없이 번쩍거리게 닦아주셨네요. 세금계산서 발행과 사후 피드백까지 기업 담당자 입장에서 100점 만점에 100점입니다.',
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'],
    date: '2026-08-29',
    isVisible: true
  },
  {
    id: 'rev-3',
    author: '박*진 고객님',
    serviceType: '거주청소',
    rating: 5,
    content: '아이들이 어려서 집안 청소가 막막했는데 주방 후드 기름때와 화장실 곰팡이를 마법처럼 없애주셨어요. 독한 락스 냄새가 전혀 안 나고 은은한 피톤치드 향이 나서 신기했습니다. 친절하신 팀장님 덕분에 너무 기분 좋은 하루가 되었습니다. 정기 청소도 맡길 예정입니다.',
    photos: [],
    date: '2026-08-22',
    isVisible: true
  },
  {
    id: 'rev-4',
    author: '최*민 대표님',
    serviceType: '상가청소',
    rating: 5,
    content: '베이커리 카페 오픈 준비하면서 바닥 타일과 주방 닥트 청소를 맡겼습니다. 오픈 일정이 촉박했는데 약속 시간 정확히 지켜주시고, 방문 견적 때 지적해주신 오염 포인트를 집중적으로 깨끗하게 해주셨어요. 손님들이 매장 청결하다고 칭찬 많이 하십니다.',
    photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'],
    date: '2026-08-16',
    isVisible: true
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    reservation_id: 'LC-20260908-1002',
    user_id: 'user-customer-1',
    customer_name: '최영길',
    phone: '010-5000-0000',
    email: 'customer@example.com',
    service_type: 'move-in',
    visit_date: '2026-09-08',
    visit_time: '10:00',
    address: '서귀포시 호근동 23',
    address_detail: '101동 102호',
    property_type: '아파트',
    area: '34평',
    customer_message: '신축 입주인데 주방과 욕실 시공 분진이 많습니다. 꼼꼼한 확인 부탁드립니다.',
    uploaded_images: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'CONFIRMED',
    admin_memo: '고객 통화 완료.',
    created_at: '2026-09-05 14:20',
    updated_at: '2026-09-05 15:30'
  },
  {
    reservation_id: 'LC-20260909-1405',
    user_id: 'guest',
    customer_name: '이수민',
    phone: '010-9876-5432',
    email: 'sumin.lee@sample.com',
    service_type: 'residential',
    visit_date: '2026-09-09',
    visit_time: '14:00',
    address: '제주시 아라동 00',
    address_detail: '402동 701호',
    property_type: '아파트',
    area: '28평',
    customer_message: '주방 후드 기름때와 베란다 곰팡이 집중 상담 원합니다.',
    uploaded_images: [],
    status: 'CONFIRMING',
    admin_memo: '1차 견적 대략 안내 완료, 방문 전 30분 전 전화 연락 예정.',
    created_at: '2026-09-06 09:10',
    updated_at: '2026-09-06 10:00'
  },
  {
    reservation_id: 'LC-20260910-1108',
    user_id: 'guest',
    customer_name: '박준혁',
    phone: '010-4567-8901',
    email: 'junhyuk@business.com',
    service_type: 'office',
    visit_date: '2026-09-10',
    visit_time: '11:00',
    address: '제주시 외도동 152',
    address_detail: '빌딩 2층',
    property_type: '사무실',
    area: '75평',
    customer_message: '사무실 정기 카페트 세척 및 주말 왁스 코팅 견적 요청합니다.',
    uploaded_images: [],
    status: 'NEW',
    admin_memo: '',
    created_at: '2026-09-06 12:45',
    updated_at: '2026-09-06 12:45'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: '링크클린 관리자',
    phone: '064-763-4545',
    email: 'linkdole@naver.com',
    role: 'admin',
    created_at: '2026-01-01'
  },
  {
    id: 'user-customer-1',
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'customer@example.com',
    role: 'customer',
    created_at: '2026-09-01'
  }
];
