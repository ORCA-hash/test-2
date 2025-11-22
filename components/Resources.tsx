
import React from 'react';
import { PlayCircle, FileText, BookOpen, ExternalLink, Search } from 'lucide-react';
import { Resource } from '../types';

const Resources: React.FC = () => {
  const resources: Resource[] = [
    { id: '1', title: 'How to film high-converting UGC', category: 'Training', type: 'video', url: '#', thumbnail: 'https://picsum.photos/seed/res1/400/225' },
    { id: '2', title: 'Lead Follow-up Script (Phone)', category: 'Script', type: 'pdf', url: '#' },
    { id: '3', title: 'Understanding your Monthly Report', category: 'Guide', type: 'pdf', url: '#' },
    { id: '4', title: 'FAQ: Billing & Invoicing', category: 'FAQ', type: 'link', url: '#' },
    { id: '5', title: 'Holiday Campaign Checklist', category: 'Guide', type: 'pdf', url: '#' },
    { id: '6', title: 'Handling Objections 101', category: 'Training', type: 'video', url: '#', thumbnail: 'https://picsum.photos/seed/res2/400/225' },
  ];

  const getIcon = (type: Resource['type']) => {
      switch(type) {
          case 'video': return <PlayCircle className="w-8 h-8 text-white" />;
          case 'pdf': return <FileText className="w-8 h-8 text-slate-400" />;
          default: return <ExternalLink className="w-8 h-8 text-slate-400" />;
      }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50 font-sans">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Resource Library</h1>
                <p className="text-slate-500 mt-1">Training, scripts, and guides to help you grow.</p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search resources..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm" />
            </div>
        </div>

        <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Categories</h2>
            <div className="flex gap-3">
                {['All', 'Training', 'Scripts', 'Guides', 'FAQ'].map(cat => (
                    <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cat === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(res => (
                <div key={res.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden">
                        {res.thumbnail ? (
                            <>
                                <img src={res.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    {getIcon(res.type)}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                {getIcon(res.type)}
                            </div>
                        )}
                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">{res.category}</span>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{res.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                             <BookOpen className="w-3.5 h-3.5" />
                             <span>{res.type === 'video' ? '5 min watch' : 'PDF Document'}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Resources;
