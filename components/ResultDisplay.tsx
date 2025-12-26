import React, { useState } from 'react';
import { SocialPost } from '../types';
import { Copy, CheckCircle, Share2, Flame, MousePointerClick, Download, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface ResultDisplayProps {
  post: SocialPost;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const fullContent = `${post.headline}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(t => `#${t}`).join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (post.imageUrl) {
      const link = document.createElement('a');
      link.href = post.imageUrl;
      link.download = `viralpost-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          <span className="font-bold text-lg">生成結果</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
        >
          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? '已複製' : '一鍵複製'}
        </button>
      </div>

      <div className="p-8 space-y-6">
        {/* Headline Section */}
        <div className="relative group">
          <div className="absolute -left-3 top-1 text-rose-500 opacity-20 group-hover:opacity-100 transition-opacity">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight pl-4 border-l-4 border-rose-500">
            {post.headline}
          </h3>
          <p className="text-xs text-rose-500 font-bold mt-2 pl-4 uppercase tracking-wider">
            ★ 吸睛標題 (Clickbait Headline)
          </p>
        </div>

        {/* Image Section */}
        {post.imageUrl ? (
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
            <img 
              src={post.imageUrl} 
              alt="Generated visual for social media" 
              className="w-full h-auto object-cover aspect-square bg-slate-100"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
               <button 
                onClick={handleDownloadImage}
                className="bg-white text-slate-800 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
               >
                 <Download className="w-4 h-4" />
                 下載圖片
               </button>
            </div>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              AI Generated
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center text-center h-64">
             {post.imageError ? (
               <>
                 <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                 <p className="text-slate-700 font-medium">圖片生成失敗</p>
                 <p className="text-slate-500 text-sm mt-1 max-w-sm">{post.imageError}</p>
               </>
             ) : (
               <div className="animate-pulse flex flex-col items-center">
                 <div className="w-10 h-10 bg-slate-200 rounded-full mb-3"></div>
                 <div className="h-4 bg-slate-200 rounded w-32"></div>
               </div>
             )}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Body Section */}
        <div className="prose prose-slate max-w-none">
          <div className="whitespace-pre-line text-lg text-slate-700 leading-relaxed">
            {post.body}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-brand-50 rounded-xl p-4 border border-brand-100 flex items-start gap-3">
          <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-800 uppercase mb-1">Call to Action</p>
            <p className="text-brand-900 font-medium">{post.cta}</p>
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.hashtags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium hover:bg-slate-200 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
