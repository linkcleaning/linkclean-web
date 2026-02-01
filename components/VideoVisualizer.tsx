
import React, { useState } from 'react';
import { Play, Video, Loader2, Sparkles, AlertCircle, Key, Film } from 'lucide-react';
import { generateCleaningVideo } from '../services/gemini';

const VideoVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    alert("AI Cinema 엔진용 API 키 설정이 완료되었습니다.");
  };

  const handleGenerate = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      if (confirm("AI Cinema(영상 생성) 서비스는 유료 API 키 설정이 필요합니다.")) {
        await handleOpenKeySelector();
      }
      return;
    }
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setLoadingMsg("청소 전문가 AI가 현장을 분석하고 있습니다...");
    try {
      const result = await generateCleaningVideo(prompt, (msg) => setLoadingMsg(msg));
      if (result) setVideoUrl(result);
      else alert("영상 생성 중 오류가 발생했습니다.");
    } catch (error: any) {
      if (error.message === "KEY_RESET") {
        alert("API 키 재설정이 필요합니다.");
        await handleOpenKeySelector();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="AI 시네마" className="py-24 md:py-40 bg-black text-white overflow-hidden relative">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6">
            <Film size={14} className="text-purple-custom" />
            <span className="text-white/60 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs">Veo 3.1 Cinema Engine</span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
            공간의 변화를<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-custom via-white to-sky-deep">영화처럼</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium text-sm md:text-lg">
            단순한 비포/애프터가 아닙니다. 링크클린의 마법이 펼쳐지는 순간을 시네마틱 영상으로 미리 체험해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Controls Panel */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[40px] md:rounded-[56px] flex flex-col order-2 lg:order-1 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="p-3 bg-purple-custom/20 rounded-2xl text-purple-custom">
                <Video size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-black">시네마틱 프롬프트</h3>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="장면을 묘사해보세요. (예: 아침 햇살이 비치는 거실이 맑고 투명하게 정화되는 과정)"
              className="w-full h-32 md:h-48 p-6 bg-white/5 rounded-3xl border border-white/10 focus:outline-none focus:ring-4 focus:ring-purple-custom/30 focus:border-purple-custom transition-all text-base md:text-lg font-medium resize-none mb-6 placeholder:text-white/20"
            />

            <div className="bg-purple-custom/10 border border-purple-custom/20 rounded-2xl p-4 flex gap-3 items-start mb-8">
              <AlertCircle size={18} className="text-purple-custom shrink-0" />
              <p className="text-[10px] md:text-sm text-gray-300 leading-relaxed font-medium">
                고품질 영상 렌더링을 위해 <b>약 2~3분이 소요</b>됩니다. 작업이 완료될 때까지 브라우저를 닫지 마세요.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`
                  w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95
                  ${!prompt.trim() || isGenerating 
                    ? 'bg-white/10 text-white/20' 
                    : 'bg-gradient-to-r from-purple-custom to-purple-dark text-white shadow-[0_0_30px_rgba(142,36,170,0.3)] hover:-translate-y-1'
                  }
                `}
              >
                {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                시네마 생성
              </button>
              <button onClick={handleOpenKeySelector} className="w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2">
                <Key size={14} /> Cinema Engine API Key 설정
              </button>
            </div>
          </div>

          {/* Video Display Panel */}
          <div className="lg:col-span-3 relative order-1 lg:order-2">
            <div className="w-full aspect-video bg-white/5 rounded-[40px] md:rounded-[56px] overflow-hidden border border-white/10 shadow-2xl relative flex items-center justify-center group bg-slate-900/50">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover animate-in fade-in duration-1000" 
                />
              ) : isGenerating ? (
                <div className="text-center p-8 flex flex-col items-center relative z-20">
                  <div className="mb-10 relative">
                    <Loader2 size={64} className="text-purple-custom animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <h4 className="text-xl md:text-3xl font-black mb-3 text-white tracking-tight animate-pulse">LinkClean Magic Rendering...</h4>
                  <p className="text-sm md:text-xl text-gray-400 font-medium italic">"{loadingMsg}"</p>
                  
                  {/* Progress Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-custom/10 blur-[100px] -z-10"></div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Play size={32} className="text-gray-500 fill-gray-500/20 ml-1" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-400 mb-2">당신만을 위한 공간 시네마</p>
                    <p className="text-sm text-gray-600 font-medium">상상하는 공간의 정결함을 영상으로 구현합니다.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoVisualizer;
