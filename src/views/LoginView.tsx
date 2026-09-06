import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, LogIn, KeyRound, UserPlus, HelpCircle, Shield, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const LoginView: React.FC = () => {
  const { login, setCurrentView } = useApp();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modals for ID / PW recovery
  const [showFindIdModal, setShowFindIdModal] = useState(false);
  const [showFindPwModal, setShowFindPwModal] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setError('아이디 또는 이메일을 입력해주세요.');
      return;
    }

    const success = login(emailOrId, password);
    if (success) {
      if (emailOrId.trim().toLowerCase().includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('mypage');
      }
    } else {
      setError('로그인 정보가 일치하지 않습니다.');
    }
  };

  const handleQuickCustomerLogin = () => {
    setEmailOrId('customer@example.com');
    setPassword('user1234');
    login('customer@example.com', 'user1234');
    setCurrentView('mypage');
  };

  const handleQuickAdminLogin = () => {
    setEmailOrId('admin@linkclean.co.kr');
    setPassword('admin1234');
    login('admin@linkclean.co.kr', 'admin1234');
    setCurrentView('admin');
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo variant="light" size="lg" showBadge={true} />
          <p className="text-xs text-slate-500 font-medium">
            믿을 수 있는 전문 청소, 링크클린에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons for easy review */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#38BDF8]" />
            체험용 빠른 1클릭 로그인
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomerLogin}
              className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#38BDF8] hover:bg-blue-50/40 text-[11px] font-bold text-slate-700 transition-colors text-center cursor-pointer shadow-2xs"
            >
              👤 일반 고객 로그인
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="py-2 px-2.5 rounded-xl bg-[#0A1D37] hover:bg-[#132742] text-[11px] font-bold text-[#38BDF8] transition-colors text-center cursor-pointer shadow-2xs"
            >
              🛡️ 관리자 로그인
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              아이디 또는 이메일
            </label>
            <input
              type="text"
              required
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="아이디 또는 이메일 입력"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            id="login-submit-btn"
          >
            <LogIn className="w-4 h-4" />
            로그인
          </button>
        </form>

        {/* Footer Sub Links */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => {
              setRecoveryMessage(null);
              setShowFindIdModal(true);
            }}
            className="hover:text-[#0A1D37] cursor-pointer"
          >
            아이디 찾기
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => {
              setRecoveryMessage(null);
              setShowFindPwModal(true);
            }}
            className="hover:text-[#0A1D37] cursor-pointer"
          >
            비밀번호 찾기
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setCurrentView('register')}
            className="font-bold text-[#38BDF8] hover:underline cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>

      {/* Find ID Modal */}
      {showFindIdModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#0A1D37]">아이디 찾기</h3>
            <p className="text-xs text-slate-500">
              가입 시 등록하신 휴대폰 번호를 입력해주세요.
            </p>
            <input
              type="tel"
              value={recoveryPhone}
              onChange={(e) => setRecoveryPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#38BDF8] outline-none"
            />
            {recoveryMessage && (
              <p className="text-xs text-[#0A1D37] font-semibold bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                {recoveryMessage}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFindIdModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => setRecoveryMessage('고객님의 가입 아이디는 customer@example.com 입니다.')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#38BDF8] text-white hover:bg-[#0EA5E9] cursor-pointer"
              >
                아이디 확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find Password Modal */}
      {showFindPwModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#0A1D37]">비밀번호 찾기</h3>
            <p className="text-xs text-slate-500">
              가입하신 이메일 또는 아이디를 입력하시면 임시 번호를 안내드립니다.
            </p>
            <input
              type="text"
              placeholder="가입 이메일 / 아이디"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#38BDF8] outline-none"
            />
            {recoveryMessage && (
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                {recoveryMessage}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFindPwModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => setRecoveryMessage('임시 비밀번호가 등록된 휴대폰 문자로 발송되었습니다.')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#38BDF8] text-white hover:bg-[#0EA5E9] cursor-pointer"
              >
                비밀번호 재설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
