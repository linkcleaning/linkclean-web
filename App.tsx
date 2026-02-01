
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutCompany from './components/AboutCompany';
import QuoteAI from './components/QuoteAI';
import SpaceVisualizer from './components/SpaceVisualizer';
import VideoVisualizer from './components/VideoVisualizer';
import Footer from './components/Footer';
import { Phone, MessageCircle, Instagram, Layout } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <AboutCompany />
        <SpaceVisualizer />
        <VideoVisualizer />
        <QuoteAI />
        
        {/* Floating Contact Bar - Side Right */}
        <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4 items-center scale-90 md:scale-100">
          
          {/* Phone Call - Priority Action */}
          <div className="animate-float relative group" style={{ animationDelay: '1.2s' }}>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[11px] md:text-xs font-black rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-2xl flex items-center gap-2 border border-white/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              전화 바로 하기
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-slate-900"></div>
            </div>
            
            <a 
              href="tel:064-763-4545" 
              className="w-11 h-11 md:w-14 md:h-14 bg-purple-custom rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform group ring-4 ring-transparent hover:ring-purple-custom/20"
              aria-label="Direct Phone Call"
            >
              <Phone size={22} className="group-hover:rotate-12 transition-transform md:size-7 fill-white/10" />
            </a>
          </div>

          {/* KakaoTalk */}
          <div className="animate-float relative group" style={{ animationDelay: '0s' }}>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-kakao text-[#3A1D1D] text-[11px] md:text-xs font-black rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-2xl flex items-center gap-2 border border-black/5">
              카카오톡 상담
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-kakao"></div>
            </div>
            <a 
              href="https://pf.kakao.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-11 h-11 md:w-14 md:h-14 bg-kakao rounded-xl md:rounded-2xl flex items-center justify-center text-[#3A1D1D] shadow-xl hover:scale-110 transition-transform group"
              aria-label="KakaoTalk"
            >
              <MessageCircle size={24} className="fill-[#3A1D1D] group-hover:rotate-12 transition-transform md:size-7" />
            </a>
          </div>
          
          {/* Instagram */}
          <div className="animate-float relative group" style={{ animationDelay: '0.4s' }}>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#fd5949] to-[#d6249f] text-white text-[11px] md:text-xs font-black rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-2xl flex items-center gap-2 border border-white/10">
              인스타그램
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-[#d6249f]"></div>
            </div>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-11 h-11 md:w-14 md:h-14 insta-gradient rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform group"
              aria-label="Instagram"
            >
              <Instagram size={24} className="group-hover:rotate-12 transition-transform md:size-7" />
            </a>
          </div>

          {/* Naver Blog */}
          <div className="animate-float relative group" style={{ animationDelay: '0.8s' }}>
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-naver text-white text-[11px] md:text-xs font-black rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-2xl flex items-center gap-2 border border-white/10">
              네이버 블로그
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-naver"></div>
            </div>
            <a 
              href="https://blog.naver.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-11 h-11 md:w-14 md:h-14 bg-naver rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform group"
              aria-label="Naver Blog"
            >
              <Layout size={24} className="group-hover:rotate-12 transition-transform md:size-7" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
