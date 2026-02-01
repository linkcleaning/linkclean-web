
import React from 'react';
import { Star, Quote, CheckCircle, Phone } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section id="이용 후기" className="py-20 md:py-40 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-32">
          <span className="text-purple-custom font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm block mb-4 md:mb-6">The Verified Voices</span>
          {/* '우리가 만드는 변화' 문구 삭제됨 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="relative group">
              <div className="relative bg-white border border-gray-100 p-7 md:p-16 rounded-[32px] md:rounded-[48px] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 md:mb-10">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-purple-custom text-purple-custom md:size-5" />
                    ))}
                  </div>
                  <Quote size={24} className="text-gray-100 md:size-10" />
                </div>

                <p className="text-base md:text-3xl font-medium leading-relaxed mb-8 md:mb-12 text-gray-800 tracking-tight flex-1">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4 md:gap-6 pt-6 md:pt-10 border-t border-gray-50">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-50 rounded-[18px] md:rounded-[28px] flex items-center justify-center font-black text-lg md:text-2xl text-purple-custom">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-black text-sm md:text-xl text-gray-900">{t.author} 고객님</span>
                      <CheckCircle size={14} className="text-sky-deep" />
                    </div>
                    <div className="text-gray-400 text-[9px] md:text-xs font-bold uppercase tracking-widest">{t.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-40 p-8 md:p-20 bg-slate-900 rounded-[32px] md:rounded-[60px] text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl md:text-5xl font-black text-white mb-8 md:mb-12 leading-tight">맞이할 준비가 되었나요?</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5">
              <button className="w-full sm:w-[240px] py-4 md:py-5 bg-white text-gray-900 rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl">
                지금 바로 예약 문의
              </button>
              
              <a 
                href="tel:064-763-4545"
                className="w-full sm:w-[240px] py-4 md:py-5 bg-purple-custom text-white rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                <Phone size={18} className="md:size-5" />
                전화 바로 하기
              </a>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
             <img src="https://images.unsplash.com/photo-1603614486387-276f74fcbe2a?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Background" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
