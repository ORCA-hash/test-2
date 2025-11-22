
import React, { useState } from 'react';
import { FileImage, FileText, Film, MoreVertical, Upload, Download, LayoutGrid, List, Search, X, Eye, File } from 'lucide-react';
import { Asset } from '../types';

interface AssetsLibraryProps {
  assets: Asset[];
}

const AssetsLibrary: React.FC<AssetsLibraryProps> = ({ assets }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => {
     const matchesType = filterType === 'all' || asset.type === filterType;
     const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesType && matchesSearch;
  });

  const getIcon = (type: Asset['type'], size: 'sm' | 'lg' = 'lg') => {
    const className = size === 'lg' ? "w-12 h-12" : "w-5 h-5";
    switch(type) {
      case 'image': return <FileImage className={`${className} text-indigo-500`} />;
      case 'video': return <Film className={`${className} text-red-500`} />;
      case 'document': return <FileText className={`${className} text-blue-500`} />;
      default: return <File className={`${className} text-slate-400`} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
         <div className="p-8 pb-4 bg-white border-b border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Assets Library</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage creative assets for all campaigns.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-4 justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none w-64 transition-all"
                     />
                  </div>
                  <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                     {['all', 'image', 'video', 'document'].map(type => (
                        <button
                           key={type}
                           onClick={() => setFilterType(type as any)}
                           className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><List className="w-4 h-4" /></button>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar bg-slate-50/50">
            {filteredAssets.length === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Search className="w-12 h-12 mb-2 opacity-20" />
                  <p>No assets found.</p>
               </div>
            ) : viewMode === 'grid' ? (
               <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {filteredAssets.map(asset => (
                     <div 
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)} 
                        className={`group relative bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all ${selectedAsset?.id === asset.id ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200'}`}
                     >
                        <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
                           {asset.type === 'image' ? <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" /> : <div className="transform group-hover:scale-110 transition-transform duration-300">{getIcon(asset.type, 'lg')}</div>}
                        </div>
                        <div className="p-3">
                           <h4 className="font-medium text-sm text-slate-900 truncate" title={asset.name}>{asset.name}</h4>
                           <p className="text-xs text-slate-500 mt-1">{asset.size}</p>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                        <tr>
                           <th className="px-6 py-3">Name</th>
                           <th className="px-6 py-3">Type</th>
                           <th className="px-6 py-3">Size</th>
                           <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {filteredAssets.map(asset => (
                           <tr key={asset.id} onClick={() => setSelectedAsset(asset)} className="hover:bg-slate-50 cursor-pointer">
                              <td className="px-6 py-3 flex items-center gap-3">
                                 {getIcon(asset.type, 'sm')}
                                 <span className="font-medium text-slate-900">{asset.name}</span>
                              </td>
                              <td className="px-6 py-3 capitalize text-slate-600">{asset.type}</td>
                              <td className="px-6 py-3 text-slate-600 font-mono">{asset.size}</td>
                              <td className="px-6 py-3 text-right"><MoreVertical className="w-4 h-4 text-slate-400" /></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>

      {/* Sidebar */}
      {selectedAsset && (
         <div className="w-80 bg-white border-l border-slate-200 h-full shadow-xl flex flex-col animate-fade-in-left z-20">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
               <span className="font-bold text-slate-800">File Details</span>
               <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
               <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden mb-6 border border-slate-200">
                  {selectedAsset.type === 'image' ? <img src={selectedAsset.url} alt="" className="w-full h-full object-cover" /> : <div className="scale-150">{getIcon(selectedAsset.type, 'lg')}</div>}
               </div>
               <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Filename</label><p className="text-sm font-medium text-slate-900 break-all">{selectedAsset.name}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Size</label><p className="text-sm text-slate-700">{selectedAsset.size}</p></div>
                  <div><label className="text-xs font-bold text-slate-400 uppercase">Uploaded By</label><p className="text-sm text-slate-700">{selectedAsset.uploadedBy}</p></div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
               <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800"><Download className="w-4 h-4" /> Download</button>
            </div>
         </div>
      )}
    </div>
  );
};

export default AssetsLibrary;
