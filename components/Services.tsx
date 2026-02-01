
import React from 'react';
import { SERVICES, ICONS } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="서비스 안내" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-purple-custom font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 md:mb-4">Masterpiece Quality</span>
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tight">청소 서비스 라인업</h2>
          <div className="h-1.5 w-16 bg-purple-custom mx-auto mt-6 rounded-full shadow-lg shadow-purple-200"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {SERVICES.map((service) => (
            <div key={service.id} className="group bg-white rounded-[32px] md:rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100 hover:-translate-y-2 active:scale-[0.98]">
              <div className="h-52 md:h-64 relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-purple-custom p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                  {ICONS[service.icon as keyof typeof ICONS]}
                </div>
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-custom transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-medium">{service.description}</p>
                <button className="mt-auto text-purple-custom font-black flex items-center gap-2 group-hover:translate-x-2 transition-all uppercase text-[10px] md:text-sm tracking-widest">
                  View Detail
                  <span className="text-lg md:text-xl">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-custom opacity-40 -skew-x-12 translate-x-1/2"></div>
    </section>
  );
};

export default Services;
