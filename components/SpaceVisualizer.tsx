
import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Sparkles, Key, AlertCircle, Search } from 'lucide-react';
import { generateCleanImage } from '../services/gemini';

const PRESETS = [
  { id: 'jeju', label: '제주 미니멀', prompt: 'Jeju island modern luxury house with volcanic stone walls and ocean view' },
  { id: 'luxury', label: '하이엔드 거실', prompt: 'Ultra-luxury penthouse living room with floor-to-ceiling windows and marble finish' },
  { id: 'kitchen', label: '시그니처 주방', prompt: 'Professional minimalist kitchen with high-end appliances and indirect lighting' }
];

const SpaceVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    alert("Visual Intelligence 엔진용 API 키 설정이 완료되었습니다.");
  };

  const handleGenerate = async (overridePrompt?: string) => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      if (confirm("고해상도 시각화(Visual Intelligence)를 위해 유료 API 키 설정이 필요합니다.")) {
        await handleOpenKeySelector();
      }
      return;
    }

    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await generateCleanImage(finalPrompt, aspectRatio);
      if (result) {
        setGeneratedImage(result);
      } else {
        alert("이미지 생성 중 오류가 발생했습니다.");
      }
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
    <section id="공간 시각화" className="py-20 md:py-40 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          {/* Text Content Area */}
          <div className="lg:col-span-5 space-y-8 md:space-y-10">
            <div>
              <span className="text-purple-custom font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm block mb-4 md:mb-6 flex items-center gap-2">
                <Sparkles size={14} className="animate-pulse" /> Visual Intelligence 3.0
              </span>
              <h2 className="text-3xl md:text-7xl font-black text-gray-900 leading-[1.2] md:leading-[1.1] tracking-tighter">
                가장 정결한<br />
                <span className="text-purple-custom italic">공간의 미학</span>을<br />미리 만나보세요.
              </h2>
              <p className="mt-4 md:mt-8 text-gray-500 font-medium text-sm md:text-lg leading-relaxed">
                Gemini 3 Pro 엔진이 <b>Google Search Grounding</b>을 통해 당신의 공간을 분석하고, 완벽한 청결이 구현된 이상적인 상태를 초고해상도로 렌더링합니다.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {PRESETS.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { setPrompt(p.prompt); handleGenerate(p.prompt); }}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 hover:bg-purple-custom hover:text-white rounded-full text-[10px] md:text-xs font-bold transition-all border border-gray-100"
                  >
                    #{p.label}
                  </button>
                ))}
              </div>

              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="어떤 공간이 깨끗해지길 원하시나요? (예: 제주의 돌담이 보이는 고즈넉한 침실)"
                className="w-full p-5 md:p-6 bg-gray-50 rounded-[24px] md:rounded-[32px] border border-gray-100 focus:outline-none focus:border-purple-custom transition-all text-gray-800 font-medium min-h-[120px] md:min-h-[160px] resize-none text-sm md:text-base shadow-inner"
              />

              <div className="bg-purple-custom/5 border border-purple-custom/10 rounded-2xl p-4 flex gap-3 items-start">
                <Search size={18} className="text-purple-custom shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-xs text-gray-600 font-medium">실시간 웹 검색 기능을 활성화하여 최신 인테리어 및 건축 트렌드를 시각화에 반영합니다.</p>
              </div>

              <div className="flex flex-row gap-3">
                <button 
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !prompt.trim()}
                  className={`
                    flex-[5] relative group py-4 md:py-7 rounded-[20px] md:rounded-[28px] font-black text-base md:text-xl 
                    flex items-center justify-center gap-2 md:gap-3 transition-all duration-300
                    active:scale-95 disabled:grayscale disabled:opacity-50
                    ${!prompt.trim() || isGenerating 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-gradient-to-r from-purple-custom via-purple-dark to-purple-custom bg-[length:200%_auto] hover:bg-right text-white shadow-xl shadow-purple-200'
                    }
                  `}
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Sparkles size={18} className="md:size-6" />
                  )}
                  <span className="relative z-10">지능형 렌더링 시작</span>
                </button>
                
                <button 
                  onClick={handleOpenKeySelector}
                  title="API 키 설정"
                  className="flex-1 py-4 md:py-7 bg-white text-gray-400 rounded-[20px] md:rounded-[28px] font-black flex items-center justify-center hover:bg-gray-50 border border-gray-100 transition-all active:scale-90 shadow-sm"
                >
                  <Key size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel Area */}
          <div className="lg:col-span-7 relative w-full">
            <div className={`w-full bg-gray-50 rounded-[32px] md:rounded-[48px] overflow-hidden border border-gray-100 shadow-2xl flex items-center justify-center relative ${aspectRatio === "1:1" ? "aspect-square" : aspectRatio === "16:9" ? "aspect-video" : "aspect-[9/16]"}`}>
              {generatedImage ? (
                <img src={generatedImage} alt="AI Created Space" className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-custom mx-auto shadow-md">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-gray-400 font-bold text-xs md:text-sm">지능형 시각 분석 결과가 이곳에 표시됩니다.</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                  <div className="relative mb-6">
                    <Loader2 size={48} className="text-purple-custom animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-custom rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-gray-900 mb-1">Visual Analysis...</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">공간의 정결함과 건축적 요소를 계산 중입니다.</p>
                  
                  {/* Neural Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#8E24AA_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SpaceVisualizer;
