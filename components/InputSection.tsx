import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
  statusMessage?: string;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading, statusMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          輸入您的原始內容
        </h2>
        <p className="text-brand-100 text-sm mt-1 opacity-90">
          貼上任何文章、筆記或想法，AI 將為您施展行銷魔法並產生配圖。
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <textarea
          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none text-slate-700 placeholder:text-slate-400 text-lg leading-relaxed"
          placeholder="例如：我們的新咖啡店下週開幕，所有飲品買一送一，地點在台北車站附近..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        ></textarea>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            {text.length} 字數
          </span>
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0
              ${!text.trim() || isLoading 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-brand-500 to-indigo-600 hover:shadow-brand-500/30'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {statusMessage || '思考中...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                生成爆文與配圖
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;
