
import React from 'react';
import { Instagram, Facebook, Mail, MapPin, PhoneCall, ArrowUpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-50 pt-24 pb-12 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-custom rounded-xl flex items-center justify-center text-white font-black text-xl">L</div>
              <span className="text-3xl font-black tracking-tighter text-gray-900">LINK CLEAN</span>
            </div>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed mb-10 font-medium">
              청소 전문가들이 제안하는 제주 라이프 케어 브랜드. 
              단순한 오염 제거를 넘어 삶의 질을 높이는 프리미엄 클린서비스를 제공합니다.
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-custom hover:border-purple-custom hover:bg-white hover:shadow-xl transition-all group">
                  <Icon size={22} className="group-hover:rotate-6 transition-transform" />
                </a>
              ))}
            </div>
          </div>

         <div className="flex flex-col gap-4"> {/* 지점 정보 컨테이너 */}
  
  <h2 className="text-sm font-bold tracking-widest uppercase mb-2">CUSTOMER CENTER</h2>

  {/* 제주지점 한 줄 정렬 */}
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <span className="font-bold text-purple-600 min-w-[70px]">📍 제주지점</span>
    <span>제주특별자치도 제주시 도령북로 8 제일상가 2층</span>
  </div>

  {/* 서귀포지점 한 줄 정렬 */}
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <span className="font-bold text-purple-600 min-w-[70px]">📍 서귀포지점</span>
    <span>제주특별자치도 서귀포시 서호호근로 86-6</span>
  </div>

  {/* 연락처 및 이메일 */}
  <div className="mt-2 space-y-2 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <span className="font-bold text-purple-600 min-w-[70px]">📞 전화번호</span>
      <span className="font-semibold">064-763-4545</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-bold text-purple-600 min-w-[70px]">✉️ 이메일</span>
      <a href="mailto:linkdole@naver.com" className="hover:underline">linkdole@naver.com</a>
    </div>
  </div>

</div>
</div>

          <div>
            <h4 className="font-black text-gray-900 mb-8 uppercase tracking-[0.2em] text-sm">Legal Info</h4>
            <div className="text-gray-500 text-sm font-medium leading-[2] space-y-3">
              <p>상호: 링크클린 (LinkClean)</p>
              <p>대표: 한승우</p>
              <p>사업자등록번호: 687-54-00154</p>
              <p>청소 전문가 자격 인증 보유</p>
              <p className="pt-4 text-purple-custom font-bold">영업시간: 08:00 - 18:00 (연중무휴)</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 font-medium text-sm">
          <p>© 2025 LinkClean Jeju. Premium Life Solution Specialist.</p>
          <button onClick={scrollToTop} className="flex items-center gap-2 hover:text-purple-custom transition-colors group">
            BACK TO TOP
            <ArrowUpCircle size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
