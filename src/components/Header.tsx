import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Calendar, User as UserIcon, Shield, Menu, X, LogIn, LogOut, 
  ChevronDown, ChevronRight, Home, Building2, Briefcase, Trash2, Wrench, 
  Star, Image as ImageIcon, ExternalLink, MessageCircle, Instagram, BookOpen, Clock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ServiceType } from '../types';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, currentUser, logout, goToServiceDetail, goToReservationWithService } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dropdown states for Desktop
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'quickLinks' | null>(null);
  
  // Mobile accordion states
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileQuickLinksOpen, setMobileQuickLinksOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'about', label: '회사소개' },
    { id: 'portfolio', label: '청소사례' },
    { id: 'review', label: '고객후기' },
    { id: 'event', label: '🎁 이벤트' },
  ] as const;

  // 6 Specialty Cleaning Services
  const cleaningServices: { id: ServiceType; title: string; desc: string; icon: any; badge?: string }[] = [
    { id: 'move-in', title: '입주·이사청소', desc: '신축 분진 & 이전 세입자 흔적 완벽 제거', icon: Home, badge: '인기' },
    { id: 'residential', title: '거주청소', desc: '생활 찌든때, 묵은 곰팡이 대청소', icon: Sparkles },
    { id: 'commercial', title: '상가청소', desc: '매장, 식당, 카페 오픈 전/후 맞춤 위생', icon: Building2 },
    { id: 'office', title: '사무실청소', desc: '바닥 왁스 코팅 & 쾌적한 오피스 케어', icon: Briefcase },
    { id: 'partial', title: '부분청소', desc: '주방 기름때, 욕실 곰팡이, 창틀 집중', icon: Wrench },
    { id: 'trash', title: '쓰레기집청소', desc: '100% 비밀보장, 특수소독 & 공간복원', icon: Trash2, badge: '특수' },
  ];

  // Quick Links
  const quickLinks = [
    {
      type: 'internal',
      label: 'Before & After 시공사례',
      desc: '실제 청소 전/후 비교 갤러리',
      icon: ImageIcon,
      action: () => setCurrentView('portfolio'),
    },
    {
      type: 'internal',
      label: '고객 리얼 생생후기',
      desc: '평점 4.9점 솔직 리뷰 확인',
      icon: Star,
      action: () => setCurrentView('review'),
    },
    {
      type: 'internal',
      label: '청소 팁 & 매거진',
      desc: '제주 맞춤 청소 노하우 & 이벤트 소식',
      icon: Sparkles,
      action: () => {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('cleaning-tips-board')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    },
    {
      type: 'internal',
      label: '회사소개 (브랜드 철학)',
      desc: '현장 실측 & 불합리 추가금 0원',
      icon: Shield,
      action: () => setCurrentView('about'),
    },
    {
      type: 'internal',
      label: '방문 견적 예약 신청',
      desc: '1분 간편 온라인 예약',
      icon: Calendar,
      action: () => goToReservationWithService('move-in'),
      highlight: true,
    },
    {
      type: 'internal',
      label: '예약 내역 조회 (마이페이지)',
      desc: '신청한 예약 일정 및 진행상황',
      icon: Clock,
      action: () => setCurrentView('mypage'),
    },
    {
      type: 'external',
      label: '공식 네이버 블로그',
      desc: '1,000+ 시공 일지 & 꿀팁',
      icon: BookOpen,
      href: 'https://blog.naver.com/linkcleaning',
      color: 'text-emerald-600',
    },
    {
      type: 'external',
      label: '카카오톡 1:1 상담',
      desc: '실시간 사진 전송 & 빠른 상담',
      icon: MessageCircle,
      href: 'https://pf.kakao.com/_xfxdrxmM?from=qr',
      color: 'text-amber-500',
    },
    {
      type: 'external',
      label: '공식 인스타그램',
      desc: '@linkcleaning 현장 릴스',
      icon: Instagram,
      href: 'https://www.instagram.com/linkcleaning/',
      color: 'text-pink-600',
    },
  ];

  const handleNavClick = (viewId: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleServiceClick = (serviceId: ServiceType) => {
    goToServiceDetail(serviceId);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all shadow-2xs" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="group focus:outline-none cursor-pointer"
            id="header-logo-btn"
          >
            <BrandLogo variant="light" size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#38BDF8] font-bold border-b-2 border-[#38BDF8]'
                      : 'text-[#0F172A] hover:text-[#38BDF8]'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* [청소서비스 ▾] Dropdown Menu next to Event */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`flex items-center gap-1 py-1 transition-colors cursor-pointer ${
                  activeDropdown === 'services' || currentView === 'services' || currentView === 'service-detail'
                    ? 'text-[#38BDF8] font-bold border-b-2 border-[#38BDF8]'
                    : 'text-[#0F172A] hover:text-[#38BDF8]'
                }`}
                id="nav-dropdown-services-btn"
                aria-expanded={activeDropdown === 'services'}
              >
                <span>청소서비스</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-[#38BDF8]' : 'text-slate-400'}`} />
              </button>

              {/* Services Dropdown Panel */}
              {activeDropdown === 'services' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                      <span className="text-xs font-bold text-[#0A1D37]">맞춤 청소 서비스 6종</span>
                    </div>
                    <button
                      onClick={() => handleNavClick('services')}
                      className="text-[11px] font-semibold text-[#38BDF8] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      전체보기 <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {cleaningServices.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => handleServiceClick(svc.id)}
                        className="p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                              <svc.icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-[#0A1D37] group-hover:text-[#38BDF8] transition-colors">
                              {svc.title}
                            </span>
                          </div>
                          {svc.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              svc.badge === '인기' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {svc.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 pl-8.5">
                          {svc.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 px-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">현장 실측 후 정직한 견적을 안내합니다.</span>
                    <button
                      onClick={() => {
                        goToReservationWithService('move-in');
                        setActiveDropdown(null);
                      }}
                      className="text-xs font-bold text-[#38BDF8] hover:text-[#0EA5E9] cursor-pointer"
                    >
                      견적 신청 →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* [바로가기 ▾] Dropdown Menu next to Cleaning Services */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'quickLinks' ? null : 'quickLinks')}
                className={`flex items-center gap-1 py-1 transition-colors cursor-pointer ${
                  activeDropdown === 'quickLinks'
                    ? 'text-[#38BDF8] font-bold border-b-2 border-[#38BDF8]'
                    : 'text-[#0F172A] hover:text-[#38BDF8]'
                }`}
                id="nav-dropdown-quicklinks-btn"
                aria-expanded={activeDropdown === 'quickLinks'}
              >
                <span>바로가기</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'quickLinks' ? 'rotate-180 text-[#38BDF8]' : 'text-slate-400'}`} />
              </button>

              {/* Quick Links Dropdown Panel */}
              {activeDropdown === 'quickLinks' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[340px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-[#0A1D37]">링크클린 바로가기</span>
                  </div>

                  <div className="space-y-1">
                    {quickLinks.map((item, index) => {
                      if (item.type === 'internal') {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              item.action?.();
                              setActiveDropdown(null);
                            }}
                            className={`w-full p-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group ${
                              item.highlight 
                                ? 'bg-blue-50/70 hover:bg-blue-100/70 text-[#0A1D37]' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                item.highlight ? 'bg-[#38BDF8] text-white' : 'bg-slate-100 text-slate-600 group-hover:text-[#38BDF8]'
                              }`}>
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className={`text-xs font-bold ${item.highlight ? 'text-[#38BDF8]' : 'text-slate-800'}`}>
                                  {item.label}
                                </div>
                                <div className="text-[10px] text-slate-400">{item.desc}</div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#38BDF8]" />
                          </button>
                        );
                      }

                      return (
                        <a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveDropdown(null)}
                          className="w-full p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 ${item.color || 'text-slate-600'}`}>
                              <item.icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                <span>{item.label}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                              </div>
                              <div className="text-[10px] text-slate-400">{item.desc}</div>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action buttons on Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-[#0A1D37] text-white shadow-sm'
                        : 'bg-slate-100 text-[#0A1D37] hover:bg-slate-200'
                    }`}
                    id="header-admin-portal-btn"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
                    관리자
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('mypage')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'mypage'
                      ? 'bg-[#0A1D37] text-white'
                      : 'bg-slate-100 text-[#0F172A] hover:bg-slate-200'
                  }`}
                  id="header-mypage-btn"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                  {currentUser.name} 님
                </button>
                <button
                  onClick={logout}
                  title="로그아웃"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  id="header-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:text-[#38BDF8] transition-colors cursor-pointer"
                  id="header-login-btn"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  로그인
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-[#0A1D37] transition-colors cursor-pointer"
                  id="header-register-btn"
                >
                  회원가입
                </button>
              </div>
            )}

            {/* Crucial CTA Button: [ 방문 견적 예약하기 ] */}
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-blue-200/50 hover:shadow-blue-300/60 cursor-pointer flex items-center gap-2 active:scale-95"
              id="header-cta-reserve-btn"
            >
              <Calendar className="w-3.5 h-3.5" />
              방문 견적 예약하기
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="px-3.5 py-1.5 rounded-full bg-[#38BDF8] text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
              id="header-mobile-quick-reserve-btn"
            >
              <Calendar className="w-3.5 h-3.5" />
              예약하기
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="메뉴 열기"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {/* Standard Nav Items */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}

            {/* Mobile Accordion: 청소서비스 (이벤트 옆/아래) */}
            <div className="pt-1">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                  mobileServicesOpen ? 'bg-blue-50 text-[#38BDF8]' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>청소서비스 (6종)</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-3 pr-1 py-1.5 space-y-1 bg-slate-50/80 rounded-xl mt-1 border border-slate-200/70">
                  {cleaningServices.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => handleServiceClick(svc.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:text-[#38BDF8] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svc.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{svc.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{svc.badge ? `[${svc.badge}]` : '상세보기'}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavClick('services')}
                    className="w-full text-center py-2 text-xs font-bold text-[#38BDF8] hover:underline"
                  >
                    청소서비스 전체 모아보기 →
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Accordion: 바로가기 (이벤트 옆/아래) */}
            <div className="pt-1">
              <button
                onClick={() => setMobileQuickLinksOpen(!mobileQuickLinksOpen)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                  mobileQuickLinksOpen ? 'bg-blue-50 text-[#38BDF8]' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#38BDF8]" />
                  <span>바로가기</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileQuickLinksOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} />
              </button>

              {mobileQuickLinksOpen && (
                <div className="pl-3 pr-1 py-1.5 space-y-1 bg-slate-50/80 rounded-xl mt-1 border border-slate-200/70">
                  {quickLinks.map((item, idx) => {
                    if (item.type === 'internal') {
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            item.action?.();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:text-[#38BDF8] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </button>
                      );
                    }
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:text-[#38BDF8] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-3.5 h-3.5 ${item.color || 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-300" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auth & CTA Section */}
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
              {currentUser ? (
                <>
                  <div className="px-3.5 py-2 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">로그인 계정</p>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name} 님</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        관리자
                      </span>
                    )}
                  </div>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-950 text-white flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-300" />
                      관리자 대시보드
                    </button>
                  )}
                  <button
                    onClick={() => handleNavClick('mypage')}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    마이페이지 (내 예약 확인)
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold text-center hover:bg-slate-50"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold text-center hover:bg-slate-200"
                  >
                    회원가입
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  goToReservationWithService('move-in');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-3 rounded-xl bg-[#38BDF8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-400/20 active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                방문 견적 예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

