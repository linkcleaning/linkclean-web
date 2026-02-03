import React from 'react';
import { Instagram, Facebook, Mail, ArrowUpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-200 pt-24 pb-12"> {/* 배경색을 진하게 하여 본문과 분리 */}
      <div className="container mx-auto px-4 md:px-8 text-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black mb-6">LINK CLEAN</h1>
            <p className="max-w-md mb-10 font-medium text-gray-600">
              제주 프리미엄 클린서비스. 단순한 오염 제거를 넘어 삶의 질을 높입니다.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="font-bold uppercase mb-2">Customer Center</h2>
            {/* 제주지점 한 줄 정렬 */}
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-purple-600 min-w-[80px]">📍 제주지점</span>
              <span>제주특별자치도 제주시 도령북로 8 제일상가 2층</span>
            </div>
            {/* 서귀포지점 한 줄 정렬 */}
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-purple-600 min-w-[80px]">📍 서귀포지점</span>
              <span>제주특별자치도 서귀포시 서호호근로 86-6</span>
            </div>
            {/* 전화번호 한 줄 정렬 */}
            <div className="flex items-center gap-3 text-sm mt-4 border-t border-gray-300 pt-4">
              <span className="font-bold text-purple-600 min-w-[80px]">📞 전화번호</span>
              <span className="text-xl font-bold">064-763-4545</span>
            </div>
          </div>

          <div>
            <h2 className="font-bold uppercase mb-6">Legal Info</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>상호: 링크클린 (LinkClean)</p>
              <p>대표: 한승우</p>
              <p>사업자등록번호: 687-54-00154</p>
              <p className="text-purple-600 font-bold mt-4">영업시간: 08:00 - 18:00 (연중무휴)</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-300 flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 LinkClean Jeju. All rights reserved.</p>
          <button onClick={scrollToTop} className="flex items-center gap-2 font-bold hover:text-purple-600 transition-colors">
            BACK TO TOP <ArrowUpCircle size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
