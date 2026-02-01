
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';

const GUIDES = ["입주 청소 견적 문의", "에어컨 살균 세척 주기", "사무실 정기 관리 상담"];

// Base64 Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceConsultant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({user: '', ai: ''});
  const [history, setHistory] = useState<string[]>([]);
  
  const audioContextsRef = useRef<{input: AudioContext, output: AudioContext} | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const currentAiTextRef = useRef('');
  const currentUserTextRef = useRef('');

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
      audioContextsRef.current = null;
    }
    // Accessing current property for Set operations
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Correctly sending data after session promise resolution
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextsRef.current?.output;
              if (ctx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                // Fix: Access .current property on sourcesRef for Set.add
                sourcesRef.current.add(source);
              }
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            if (message.serverContent?.inputTranscription) {
              currentUserTextRef.current += message.serverContent.inputTranscription.text;
              setTranscription(prev => ({ ...prev, user: currentUserTextRef.current }));
            }
            if (message.serverContent?.outputTranscription) {
              currentAiTextRef.current += message.serverContent.outputTranscription.text;
              setTranscription(prev => ({ ...prev, ai: currentAiTextRef.current }));
            }
            if (message.serverContent?.turnComplete) {
              // Copy ref values to local variables before resetting
              const u = currentUserTextRef.current;
              const a = currentAiTextRef.current;
              if (u || a) setHistory(prev => [...prev, u ? `Q: ${u}` : '', a ? `A: ${a}` : ''].filter(Boolean));
              currentUserTextRef.current = '';
              currentAiTextRef.current = '';
              setTranscription({ user: '', ai: '' });
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: '당신은 제주도 프리미엄 청소 서비스 "링크클린"의 시니어 컨설턴트 "코어(Kore)"입니다. 매우 정중하고 신뢰감 있는 목소리로 고객의 질문에 답하며, 제주의 환경적 특징을 고려한 전문적인 조언을 제공하세요.',
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  return (
    <section id="AI 음성 상담" className="py-24 md:py-40 bg-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 space-y-10">
            <div>
              <span className="text-purple-custom font-black tracking-[0.4em] uppercase text-xs md:text-sm block mb-6">Omni-Channel Voice</span>
              <h2 className="text-4xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                목소리로 마주하는<br />
                <span className="text-purple-custom underline decoration-purple-100 underline-offset-8">진심어린 상담</span>
              </h2>
              <p className="mt-8 text-gray-500 font-medium text-lg leading-relaxed">
                전화 연결의 번거로움 없이, 링크클린의 AI 시니어 컨설턴트와 실시간 음성으로 대화하세요. 견적부터 케어 팁까지 모든 것이 가능합니다.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">상담 가능 주제</p>
              <div className="flex flex-wrap gap-2">
                {GUIDES.map(g => (
                  <div key={g} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                    {g}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={isActive ? stopSession : startSession}
              disabled={isConnecting}
              className={`w-full md:w-auto px-12 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${isActive ? 'bg-red-50 text-red-600 border border-red-100 shadow-red-100' : 'bg-purple-custom text-white shadow-purple-200'}`}
            >
              {isConnecting ? <Loader2 className="animate-spin" /> : isActive ? <MicOff /> : <Mic />}
              {isConnecting ? '연결 중...' : isActive ? '상담 종료하기' : '보이스 상담 시작'}
            </button>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-14 border border-gray-100 relative overflow-hidden h-[500px] flex flex-col">
              {/* Visualizer Animation */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 flex gap-1 px-4">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-purple-custom animate-pulse" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2">
                {history.length === 0 && !transcription.user && !transcription.ai && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <MessageSquare size={48} className="mb-4" />
                    <p className="font-bold">대화 내용이 이곳에 실시간으로 기록됩니다.</p>
                  </div>
                )}
                {history.map((h, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-sm font-bold ${h.startsWith('Q:') ? 'bg-sky-50 text-sky-deep ml-8' : 'bg-purple-50 text-purple-custom mr-8'}`}>
                    {h}
                  </div>
                ))}
                {transcription.user && (
                  <div className="p-4 bg-sky-100 text-sky-deep rounded-2xl text-sm font-black ml-8 animate-pulse italic">
                    {transcription.user}...
                  </div>
                )}
                {transcription.ai && (
                  <div className="p-4 bg-purple-100 text-purple-custom rounded-2xl text-sm font-black mr-8 animate-pulse italic">
                    {transcription.ai}...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  {isActive ? 'Live Consulting Active' : 'System Standby'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VoiceConsultant;
