import React from 'react';
import { PlayCircle, FileText, User, Calendar } from 'lucide-react';
import { Post, Category } from '../types';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const isVideo = post.type === 'video';

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper for category color
  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.AGRICULTURE: return 'bg-green-100 text-green-800 border-green-200';
      case Category.RETAIL: return 'bg-blue-100 text-blue-800 border-blue-200';
      case Category.TECHNOLOGY: return 'bg-purple-100 text-purple-800 border-purple-200';
      case Category.HOSPITALITY: return 'bg-orange-100 text-orange-800 border-orange-200';
      case Category.MANUFACTURING: return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isPlayable = post.content.startsWith('http') || post.content.startsWith('blob:');

  return (
    <div 
      onClick={() => onClick(post)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group/card"
    >
      {/* Media Section */}
      <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden group">
        {isVideo ? (
          <>
            {isPlayable ? (
               <video 
                 src={post.content} 
                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 controls={false}
                 muted
                 playsInline
                 // We don't autoPlay here to keep the UI calm, user clicks to open details
               />
            ) : (
               <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                 <span className="text-slate-400 text-sm">Video Content</span>
               </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="w-14 h-14 text-white drop-shadow-md opacity-90" />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6 text-center border-b border-slate-100 relative">
             <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
             <p className="text-slate-500 line-clamp-4 italic relative z-10 group-hover/card:text-slate-700 transition-colors">
               "{post.content}"
             </p>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border shadow-sm ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs uppercase tracking-wide font-semibold">
            {isVideo ? <PlayCircle size={14} className="text-indigo-500" /> : <FileText size={14} className="text-indigo-500" />}
            <span>{isVideo ? 'Video Story' : 'Written Advice'}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover/card:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        
        {post.summary && (
            <div className="bg-indigo-50 p-3 rounded-lg mb-4 border border-indigo-100">
                <p className="text-xs text-indigo-800 font-medium mb-1 flex items-center gap-1">
                    ✨ AI Summary
                </p>
                <p className="text-sm text-indigo-700 line-clamp-3 leading-relaxed">
                    {post.summary}
                </p>
            </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={14} />
            </div>
            <span className="truncate max-w-[100px]">{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;