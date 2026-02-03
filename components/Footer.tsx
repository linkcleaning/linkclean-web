import React from 'react';
import { Instagram, Facebook, Mail, MapPin, PhoneCall, ArrowUpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-50 pt-24 pb-12 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          
          {/* 브랜드 섹션 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl">L</div>
              <span className="text-3xl font-black tracking-tighter text-gray-900">LINK CLEAN</span>
            </div>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed mb-10 font-medium">
              청소 전문가들이 제안하는 제주 라이프 케어 브랜드. 
              단순한 오염 제거를 넘어 삶의 질을 높이는 프리미엄 클린서비스를 제공합니다.
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 hover:bg-white hover:shadow-xl transition-all group">
                  <Icon size={22} className="group-hover:rotate-6 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* CUSTOMER CENTER (지점 정보 한 줄씩 정렬) */}
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-2 text-gray-900">CUSTOMER CENTER</h2>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-bold text-purple-600 min-w-[80px]">📍 제주지점</span>
              <span>제주특별자치도 제주시 도령북로 8 제일상가 2층</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-bold text-purple-600 min-w-[80px]">📍 서귀포지점</span>
              <span>제주특별자치도 서귀포시 서호호근로 86-6</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 mt-4">
              <span className="font-bold text-purple-600 min-w-[80px]">📞 전화번호</span>
              <span className="text-lg font-bold text-gray-900">064-763-4545</span>
            </div>
          </div>

          {/* LEGAL INFO */}
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-900">LEGAL INFO</h2>
            <div className="space-y-3 text-sm text-gray-500 font-medium">
              <p>상호: 링크클린 (LinkClean)</p>
              <p>대표: 한승우</p>
              <p>사업자등록번호: 687-54-00154</p>
              <p className="text-purple-600 font-bold mt-4">영업시간: 08:00 - 18:00 (연중무휴)</p>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-400 font-medium">© 2025 LinkClean Jeju. All rights reserved.</p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-sm font-bold text-gray-900 hover:text-purple-600 transition-colors"
          >
            BACK TO TOP
            <ArrowUpCircle size={24} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
