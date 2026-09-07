import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, User as UserIcon, Shield, Menu, X, LogIn, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, currentUser, logout, goToReservationWithService } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'about', label: '회사소개' },
    { id: 'services', label: '서비스' },
    { id: 'portfolio', label: '청소사례' },
    { id: 'review', label: '고객후기' },
    { id: 'event', label: '🎁 이벤트' },
  ] as const;

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all">
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
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'services' && currentView === 'service-detail');
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
              className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 cursor-pointer flex items-center gap-2"
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
              className="px-3.5 py-1.5 rounded-full bg-[#38BDF8] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-200/50"
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
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
              {currentUser ? (
                <>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">로그인 계정</p>
                      <p className="text-sm font-bold text-slate-900">{currentUser.name} 님</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        관리자
                      </span>
                    )}
                  </div>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-950 text-white flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-indigo-300" />
                      관리자 대시보드
                    </button>
                  )}
                  <button
                    onClick={() => handleNavClick('mypage')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    마이페이지 (내 예약 확인)
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold text-center hover:bg-slate-50"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold text-center hover:bg-slate-200"
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
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
              >
                <Calendar className="w-5 h-5" />
                방문 견적 예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
