import React, { useState, useRef } from 'react';
import { X, Upload, Video, Type, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { Post, Category } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side validation for demo
      if (file.size > 20 * 1024 * 1024) {
        setError("File is too large for this demo (Max 20MB).");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAnalyzing(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (activeTab === 'text' && !content.trim()) throw new Error("Please write your story.");
      if (activeTab === 'video' && !selectedFile) throw new Error("Please upload a video file.");

      // Call Gemini Service
      const analysis = await analyzeContent(
        activeTab === 'text' ? content : title, // For video, we pass title as context text if content is empty
        selectedFile
      );

      if (!analysis.isBusinessRelated) {
        throw new Error("Our AI moderator determined this content is not sufficiently related to business operations. Please share content related to running an enterprise.");
      }

      const newPost: Post = {
        id: crypto.randomUUID(),
        type: activeTab,
        title: title,
        content: activeTab === 'text' ? content : URL.createObjectURL(selectedFile!), // Use ObjectURL for local preview
        author: 'You (Business Owner)', // Hardcoded for demo
        category: analysis.category,
        timestamp: Date.now(),
        summary: analysis.summary
      };

      onPostCreated(newPost);
      handleClose();

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedFile(null);
    setError(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
        
        {/* Header - Fixed */}
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white shrink-0">
          <h2 className="text-xl font-bold">Share Your Story</h2>
          <button onClick={handleClose} className="hover:bg-indigo-700 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('text')}
              >
                <Type size={16} /> Write Advice
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab('video')}
              >
                <Video size={16} /> Upload Video
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How I reduced waste in my bakery..." 
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder:text-slate-400"
                />
              </div>

              {activeTab === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Story</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Share your operational tips, success stories, or challenges..."
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none placeholder:text-slate-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Video File</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${selectedFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="video/*" 
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / (1024*1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-700">Click to upload video</p>
                        <p className="text-xs text-slate-400">MP4, WebM (Max 20MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-700">
                      <span className="font-bold">Note:</span> All uploads are analyzed by AI to ensure they are business-related and to automatically categorize them.
                  </p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                disabled={isAnalyzing}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'}`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing Content...
                  </>
                ) : (
                  'Post to Community'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;