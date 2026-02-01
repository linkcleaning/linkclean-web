
import React from 'react';
import { Phone, ExternalLink, Layout, Sparkles, Video } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden bg-black">
      {/* Cinematic Background with Premium Treatment */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay z-10"></div>
        
        {/* Film Grain / Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=90&w=2400" 
          alt="Luxury Architecture" 
          className="w-full h-full object-cover animate-subtle-zoom opacity-80"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-30">
        <div className="max-w-5xl">
          {/* Brand Tagline */}
          <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="h-[1px] w-8 bg-purple-custom"></div>
            <span className="text-purple-custom font-black tracking-[0.5em] text-[10px] md:text-xs uppercase">
              Jeju's Premium Space Curation
            </span>
          </div>

          {/* Main Typography */}
          <div className="space-y-2 mb-10">
            <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black leading-[0.85] tracking-tighter text-white animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              완벽을 넘어선<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                순수의 미학
              </span>
            </h1>
          </div>

          {/* Elegant Subtitle */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            <p className="text-lg md:text-3xl text-gray-300 leading-tight font-light tracking-tight mb-12 border-l-2 border-purple-custom/30 pl-6">
              링크클린은 보이지 않는 먼지 너머,<br />
              <span className="text-white font-medium">공간이 지닌 본연의 가치와 숨결</span>을<br /> 
              가장 정결한 상태로 복원하는 예술가입니다.
            </p>
          </div>

          {/* Quick Access to Visual Tools */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <button 
              onClick={() => scrollToSection('공간 시각화')}
              className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-full text-xs font-black text-white flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-purple-custom" />
              Visual Intelligence
            </button>
            <button 
              onClick={() => scrollToSection('AI 시네마')}
              className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-full text-xs font-black text-white flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
            >
              <Video size={14} className="text-purple-custom" />
              AI Cinema Preview
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600">
            <a 
              href="tel:064-763-4545"
              className="group relative bg-white text-black px-12 py-6 rounded-none font-black text-xl hover:bg-purple-custom hover:text-white transition-all duration-500 flex items-center justify-center gap-4 active:scale-95"
            >
              <Phone size={22} className="group-hover:rotate-12 transition-transform" />
              <span>실시간 전화 상담</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white group-hover:border-purple-custom transition-colors"></div>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 30s ease-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default Hero;
