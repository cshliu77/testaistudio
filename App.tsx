import React, { useState } from 'react';
import { GenerateState } from './types';
import { generateSocialPost } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultDisplay from './components/ResultDisplay';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<GenerateState>({
    isLoading: false,
    error: null,
    result: null,
    statusMessage: '',
  });

  const handleGenerate = async (input: string) => {
    setState({ isLoading: true, error: null, result: null, statusMessage: '準備開始...' });
    try {
      const result = await generateSocialPost(input, (status) => {
        setState(prev => ({ ...prev, statusMessage: status }));
      });
      setState({ isLoading: false, error: null, result, statusMessage: '' });
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || "發生未知錯誤", 
        result: null,
        statusMessage: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-lg text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
                  ViralPost AI
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">社群行銷神器</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500">
                Powered by Gemini 2.0
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            把無聊文字變成
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">
              瘋傳的爆紅貼文
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            不需要懂文案技巧。只要輸入您的想法，AI 就能為您生成具備「流量密碼」的專業社群貼文與<span className="font-bold text-brand-600">吸睛配圖</span>。
          </p>
        </div>

        {/* Input Area */}
        <InputSection 
          onGenerate={handleGenerate} 
          isLoading={state.isLoading} 
          statusMessage={state.statusMessage}
        />

        {/* Error Message */}
        {state.error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{state.error}</p>
          </div>
        )}

        {/* Result Area */}
        {state.result && (
          <ResultDisplay post={state.result} />
        )}

      </main>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-8">
        <p>© {new Date().getFullYear()} ViralPost AI. Make your content shine.</p>
      </footer>
    </div>
  );
};

export default App;
