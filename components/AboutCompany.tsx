import React from 'react';
import { ShieldCheck, Award, Zap, Waves, ArrowRight, Sparkles, CheckCircle2, Quote, Microscope, Heart } from 'lucide-react';

const AboutCompany: React.FC = () => {
  return (
    <div id="회사 소개">
      {/* Section 1: Philosophy Intro */}
      <section className="py-24 md:py-40 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-32">
            <div className="flex-1 relative group">
              <div className="relative z-10 rounded-[40px] md:rounded-[80px] overflow-hidden shadow-2xl aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200" 
                  alt="Detail Cleaning" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-6 md:-right-12 bg-purple-custom text-white p-8 md:p-12 rounded-[40px] shadow-2xl z-20 animate-float">
                <p className="text-4xl md:text-6xl font-black mb-2 italic">100%</p>
                <p className="text-xs md:text-sm font-bold tracking-widest uppercase opacity-80">Direct Management</p>
              </div>
            </div>

            <div className="flex-1 space-y-10 md:space-y-14">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-custom/5 rounded-full border border-purple-custom/10">
                  <Sparkles size={14} className="text-purple-custom" />
                  <span className="text-purple-custom font-black tracking-[0.2em] uppercase text-[10px] md:text-xs">The Brand Philosophy</span>
                </div>
                <h2 className="text-4xl md:text-8xl font-black text-gray-900 leading-[1.05] tracking-tighter">
                  단순한 청소가 아닌,<br />
                  <span className="text-purple-custom italic">공간의 가치</span>를<br />
                  복원하는 예술
                </h2>
              </div>
              
              <p className="text-gray-500 text-lg md:text-2xl leading-relaxed font-medium">
                링크클린은 먼지를 닦아내는 행위를 넘어, 고객의 삶이 머무는 공간의 본질적 가치를 다시 찾습니다. 제주의 자연환경을 이해하고, 거주자의 건강까지 고려하는 정밀한 케어 솔루션을 제안합니다.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-custom">
                    <Microscope size={20} />
                  </div>
                  <span className="font-bold text-gray-800">오염 정밀 분석</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-custom">
                    <Heart size={20} />
                  </div>
                  <span className="font-bold text-gray-800">친환경 안심 공법</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Section 3: Core Strengths (Grid) */}
      <section className="py-24 md:py-40 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h4 className="text-purple-custom font-black tracking-[0.4em] uppercase text-xs mb-4">Core Strengths</h4>
            <h2 className="text-3xl md:text-7xl font-black text-gray-900 tracking-tighter">링크클린이 약속하는 4대 원칙</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fix: Moved size prop directly to the icon components to resolve cloneElement typing error */}
            {[
              { icon: <ShieldCheck size={32} />, title: "본사 책임제", desc: "하청이나 용역 없이, 본사 정직원 마스터가 모든 현장을 직접 지휘합니다." },
              { icon: <Award size={32} />, title: "전문 기술팀", desc: "국가 공인 세탁/청소 자격증을 보유한 베테랑들로 구성된 전문 팀이 방문합니다." },
              { icon: <Zap size={32} />, title: "하이엔드 장비", desc: "독일 카처 고압 세척기, 미국 컬럼비아 연마기 등 세계 최고의 장비만을 운용합니다." },
              { icon: <Waves size={32} />, title: "환경 최적화", desc: "제주 특유의 곰팡이와 염분 고착 현상을 완벽하게 해결하는 전용 솔루션을 보유합니다." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group border border-gray-100 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-purple-custom group-hover:bg-purple-custom group-hover:text-white transition-all transform group-hover:rotate-6">
                  {item.icon}
                </div>
                <h5 className="text-xl font-black text-gray-900 mb-4">{item.title}</h5>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Call to Action (The Real Experience) */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="bg-purple-custom rounded-[40px] md:rounded-[80px] p-8 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 space-y-8 max-w-2xl">
              <h2 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                당신의 공간에<br />
                <span className="text-sky-custom italic">새로운 생명력</span>을<br />
                불어넣을 준비가 되셨나요?
              </h2>
              <div className="flex flex-wrap gap-4">
                {["입주청소", "이사청소", "준공청소", "쓰레기집청소", "유품정리"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex flex-col gap-4 w-full lg:w-auto">
              <a 
                href="https://blog.naver.com/linkcleaning" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-purple-custom px-10 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                포트폴리오 구경
                <ArrowRight size={22} />
              </a>
              <p className="text-white/60 text-center text-sm font-medium">제주 전 지역 방문 견적 상담 진행</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutCompany;
