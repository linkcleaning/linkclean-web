import React from 'react';
import { PhoneCall, MessageCircle, Instagram, BookOpen } from 'lucide-react';

interface FloatingMenuItem {
  id: string;
  type: 'tel' | 'link';
  href: string;
  icon: React.ReactNode;
  emoticon: string;
  title: string;
  description: string;
  badge?: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
}

export const FloatingQuickMenu: React.FC = () => {
  const menuItems: FloatingMenuItem[] = [
    {
      id: 'floating-phone-btn',
      type: 'tel',
      href: 'tel:064-763-4545',
      icon: <PhoneCall className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform group-hover:scale-110" />,
      emoticon: '📞',
      title: '전화 상담 문의',
      description: '064-763-4545 (연중무휴 08:30~20:00)',
      badge: '통화 연결',
      bgColor: 'bg-[#0A1D37] text-white hover:bg-slate-800',
      borderColor: 'border-slate-700/80',
      shadowColor: 'shadow-slate-900/30'
    },
    {
      id: 'floating-kakao-btn',
      type: 'link',
      href: 'https://pf.kakao.com/_xfxdrxmM?from=qr',
      icon: <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#371D1E] fill-[#371D1E] transition-transform group-hover:scale-110" />,
      emoticon: '💬',
      title: '카카오톡 1:1 상담',
      description: '실시간 사진 전송 & 빠른 채팅 상담',
      badge: '실시간 상담',
      bgColor: 'bg-[#FEE500] text-[#371D1E] hover:bg-[#FDD835]',
      borderColor: 'border-[#E8CE00]',
      shadowColor: 'shadow-yellow-500/20'
    },
    {
      id: 'floating-instagram-btn',
      type: 'link',
      href: 'https://www.instagram.com/linkcleaning/',
      icon: <Instagram className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform group-hover:scale-110" />,
      emoticon: '📷',
      title: '인스타그램 공식 채널',
      description: '@linkcleaning 청소 릴스 & 현장 스토리',
      badge: '공식 피드',
      bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-95',
      borderColor: 'border-rose-400/40',
      shadowColor: 'shadow-rose-500/25'
    },
    {
      id: 'floating-blog-btn',
      type: 'link',
      href: 'https://blog.naver.com/linkcleaning',
      icon: <BookOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform group-hover:scale-110" />,
      emoticon: '📝',
      title: '네이버 공식 블로그',
      description: '1,000+ 시공 전후 작업일지 & 청소 꿀팁',
      badge: '시공 사례',
      bgColor: 'bg-[#03C75A] text-white hover:bg-[#02b350]',
      borderColor: 'border-emerald-400/40',
      shadowColor: 'shadow-emerald-500/25'
    }
  ];

  return (
    <aside
      aria-label="빠른 문의 플로팅 메뉴"
      className="fixed right-4 sm:right-6 bottom-20 sm:bottom-6 z-40 flex flex-col gap-2.5 sm:gap-3 items-end select-none"
    >
      {menuItems.map((item) => (
        <a
          key={item.id}
          id={item.id}
          href={item.href}
          target={item.type === 'link' ? '_blank' : undefined}
          rel={item.type === 'link' ? 'noopener noreferrer' : undefined}
          title={`${item.title} - ${item.description}`}
          className="group relative flex items-center justify-end cursor-pointer"
        >
          {/* Tooltip on Hover (slides in to the left with description and emoticon) */}
          <div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50"
            role="tooltip"
          >
            <div className="bg-[#0A1D37]/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 whitespace-nowrap flex items-center gap-3">
              {/* Tooltip Emoticon Badge */}
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                <span>{item.emoticon}</span>
              </div>

              {/* Tooltip Content */}
              <div className="text-left pr-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#38BDF8] text-[#0A1D37] leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-normal mt-0.5 leading-tight">
                  {item.description}
                </p>
              </div>

              {/* Tail Arrow pointing to icon button */}
              <div
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0A1D37]/95 border-r border-t border-slate-700/80 rotate-45"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Main Floating Button */}
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border shadow-lg ${item.shadowColor} ${item.bgColor} ${item.borderColor} transition-all duration-200 group-hover:scale-108 active:scale-95`}
          >
            {item.icon}
          </div>
        </a>
      ))}
    </aside>
  );
};
