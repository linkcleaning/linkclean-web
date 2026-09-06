import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, UserPlus, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { register, setCurrentView } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreedTerms) {
      setError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    const success = register({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password
    });

    if (success) {
      setCurrentView('mypage');
    } else {
      setError('이미 가입된 이메일 또는 아이디입니다.');
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-7">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            SIGN UP
          </span>
          <h1 className="text-2xl font-extrabold text-[#0A1D37] tracking-tight">
            링크클린 회원가입
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            회원가입 후 간편하게 실시간 방문 견적과 내역을 확인하세요.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              휴대폰 번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              이메일 (아이디) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 비밀번호"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            />
          </div>

          {/* Privacy Consent */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#38BDF8] rounded focus:ring-[#38BDF8]"
              />
              <span className="text-xs text-slate-500 leading-tight">
                [필수] 방문 견적 상담 및 서비스 제공을 위한{' '}
                <span className="text-[#0A1D37] font-bold underline">
                  개인정보 수집 및 이용
                </span>
                에 동의합니다.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            id="register-submit-btn"
          >
            <UserPlus className="w-4 h-4" />
            회원가입 완료
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="font-bold text-[#38BDF8] hover:underline cursor-pointer"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};
