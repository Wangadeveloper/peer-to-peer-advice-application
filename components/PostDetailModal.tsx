import React from 'react';
import { X, Calendar, User, FileText, PlayCircle } from 'lucide-react';
import { Post } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  const isVideo = post.type === 'video';
  // Determine if content is a playable URL (http or blob)
  const isPlayableVideo = isVideo && (post.content.startsWith('http') || post.content.startsWith('blob:'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-5xl h-[92vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Sticky/Floating */}
        <div className="absolute top-4 right-4 z-20">
             <button 
            onClick={onClose}
            className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Container for Entire Modal Content */}
        {/* We make the whole modal content scrollable, rather than just the text part, 
            so the video scrolls away as you read down, which is better for reading on small screens. */}
        <div className="overflow-y-auto h-full w-full bg-white custom-scrollbar">
          
          {/* Hero / Media Section */}
          <div className="w-full bg-slate-950">
            {isVideo ? (
               <div className="w-full aspect-video max-h-[60vh] flex items-center justify-center bg-black">
                  {isPlayableVideo ? (
                    <video 
                      src={post.content} 
                      className="w-full h-full object-contain" 
                      controls 
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="text-center p-12">
                       <PlayCircle className="w-20 h-20 text-slate-600 mx-auto mb-6" />
                       <p className="text-slate-400 font-medium text-lg">Video preview unavailable</p>
                    </div>
                  )}
               </div>
            ) : (
               <div className="h-64 md:h-80 bg-gradient-to-r from-indigo-600 to-violet-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                  <FileText className="text-white/20 w-32 h-32" />
               </div>
            )}
          </div>

          {/* Content Body */}
          <div className="max-w-4xl mx-auto p-6 md:p-10 lg:p-12">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
               <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm">
                 {post.category}
               </span>
               <div className="flex items-center text-slate-500 text-base font-medium">
                  <Calendar size={18} className="mr-2" />
                  {new Date(post.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
               </div>
               <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
               <div className="flex items-center text-slate-500 text-base font-medium">
                  <User size={18} className="mr-2" />
                  {post.author}
               </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              {post.title}
            </h2>

            {/* AI Summary Section - Highlighted */}
            {post.summary && (
              <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-6 md:p-8 mb-10 shadow-sm">
                 <h3 className="text-indigo-900 text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                   ✨ AI Insight
                 </h3>
                 <p className="text-indigo-900/80 leading-relaxed text-xl md:text-2xl font-medium font-serif italic">
                   "{post.summary}"
                 </p>
              </div>
            )}

            {/* Main Content (Text) */}
            {!isVideo && (
              <div className="prose prose-lg md:prose-2xl max-w-none text-slate-700">
                <p className="whitespace-pre-wrap leading-loose">
                  {post.content}
                </p>
              </div>
            )}
            
            {/* Footer / Call to Action or extra padding */}
            <div className="mt-12 pt-8 border-t border-slate-200">
               <p className="text-slate-400 text-center text-sm">
                 Member of the BizNexus Community
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;