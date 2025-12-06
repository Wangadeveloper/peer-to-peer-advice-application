import React, { useState } from 'react';
import { LayoutGrid, Plus, Filter, Search } from 'lucide-react';
import { Category, Post } from './types';
import { CATEGORIES, INITIAL_POSTS } from './constants';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePostCreated = (newPost: Post) => {
    // Prepend new post
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === Category.ALL || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutGrid className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                BizNexus
              </span>
            </div>
            
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search stories, advice..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-300 rounded-full text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Share Story</span>
            </button>
          </div>
        </div>
        
        {/* Category Filter Scrollbar */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 py-3 overflow-x-auto no-scrollbar scroll-smooth">
               <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
               {CATEGORIES.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat as Category)}
                   className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                     activeCategory === cat 
                       ? 'bg-slate-900 text-white' 
                       : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {activeCategory === Category.ALL ? 'Community Feed' : `${activeCategory} Stories`}
          </h1>
          <p className="text-slate-500">
            Peer-to-peer insights to help your enterprise thrive.
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={handlePostClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-slate-400 w-8 h-8" />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No stories found</h3>
             <p className="text-slate-500 max-w-xs mx-auto mt-2">
               Try selecting a different category or be the first to share in {activeCategory}.
             </p>
          </div>
        )}
      </main>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      
      <PostDetailModal 
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

    </div>
  );
};

export default App;