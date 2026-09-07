import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Phone, Mail, Clock, ShieldCheck, Award, ExternalLink, Instagram, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setCurrentView, goToServiceDetail, goToReservationWithService } = useApp();

  return (
    <footer className="bg-[#0A1D37] text-slate-400 pt-16 pb-24 lg:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="dark" size="md" showBadge={false} />
              <span className="px-2.5 py-0.5 bg-[#38BDF8]/20 text-[#38BDF8] rounded-full text-[10px] font-extrabold border border-[#38BDF8]/30">
                TRUSTED BY 5,000+
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              <strong className="text-white">“청소는 꼼꼼하게, 견적은 정확하게.”</strong><br />
              링크클린은 공간의 상태를 직접 눈으로 확인하고 과도한 추가금 없는 정직하고 투명한 맞춤 청소 솔루션을 약속드립니다.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>영업배상책임보험 가입</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#38BDF8]" />
                <span>친환경 세제 시공</span>
              </div>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">청소 서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => goToServiceDetail('move-in')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  입주·이사청소
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToServiceDetail('residential')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  거주청소
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToServiceDetail('commercial')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  상가청소
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToServiceDetail('office')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  사무실청소
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToServiceDetail('partial')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  부분청소
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToServiceDetail('trash')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  쓰레기집청소
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  회사소개
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('portfolio')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Before & After 청소사례
                </button>
              </li>
              <li>
                <a
                  href="https://blog.naver.com/linkcleaning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                >
                  공식 네이버 블로그
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                >
                  카카오톡 1:1 상담
                  <ExternalLink className="w-3 h-3 text-amber-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/linkcleaning/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium"
                >
                  공식 인스타그램
                  <ExternalLink className="w-3 h-3 text-pink-400" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('event')}
                  className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1 font-bold"
                >
                  <span>🎁 청소 마스터 선물 이벤트</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">준비중</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('review')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  실제 고객 생생후기
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToReservationWithService('move-in')}
                  className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                >
                  방문 견적 예약 신청
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('mypage')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  예약 내역 조회 (마이페이지)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Center */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">고객센터</h4>
            <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-400" />
              064-763-4545
            </div>
            <div className="text-xs space-y-1 text-slate-400">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                평일/주말 08:30 ~ 20:00 (연중무휴)
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                contact@linkclean.co.kr
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => goToReservationWithService('move-in')}
                className="w-full py-2.5 px-4 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white text-xs font-bold transition-all text-center shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                24시간 온라인 방문견적 접수
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <p className="font-medium text-slate-400">
              링크클린 | 대표이사: 한승우 | 사업자등록번호: 687-54-00154
            </p>
            <p className="text-slate-400">
              제주도 제주시 도령북길 8 제일상가 2층
            </p>
            <p className="text-slate-400">
              제주도 서귀포시 서호호근로 86-6
            </p>
            <p className="text-slate-400">
              개인정보책임관리자: 안심클린팀 (linkdole@naver.com)
            </p>
          </div>
          <div className="text-slate-400 self-start md:self-auto">
            © 2016 LINKCLEAN Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
