
import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Image, Video, MessageSquare, ChevronRight, Edit3 } from 'lucide-react';
import { ApprovalItem } from '../types';

const Approvals: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>([
    { 
        id: '1', 
        title: 'Summer Sale - Carousel V1', 
        type: 'Creative', 
        contentUrl: 'https://picsum.photos/seed/approve1/600/400', 
        status: 'Pending', 
        version: 1, 
        dateSubmitted: '2023-10-25' 
    },
    { 
        id: '2', 
        title: 'Retargeting Ad Copy - Q4', 
        type: 'Copy', 
        contentText: "Headline: Don't miss out on 20% OFF.\nPrimary Text: Our biggest sale of the year is finally here. Shop the collection before it's gone.", 
        status: 'Changes Requested', 
        version: 2, 
        dateSubmitted: '2023-10-24',
        feedback: "Can we make the headline more urgent? Use 'Last Chance'"
    },
    { 
        id: '3', 
        title: 'Brand Story Video', 
        type: 'Video', 
        contentUrl: '', // Simulated video
        status: 'Approved', 
        version: 3, 
        dateSubmitted: '2023-10-20' 
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleStatusChange = (status: 'Approved' | 'Changes Requested') => {
    if (!selectedItem) return;
    
    if (status === 'Changes Requested' && !isRejecting) {
        setIsRejecting(true);
        return;
    }

    const updatedItems = items.map(item => 
        item.id === selectedItem.id 
        ? { ...item, status: status, feedback: status === 'Changes Requested' ? feedbackText : undefined }
        : item
    );
    setItems(updatedItems);
    setSelectedItem(null);
    setIsRejecting(false);
    setFeedbackText('');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'Changes Requested': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
        {/* List Sidebar */}
        <div className="w-96 border-r border-slate-200 bg-white flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900">Approvals</h1>
                <p className="text-slate-500 text-sm mt-1">Review and approve campaign assets.</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {items.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedItem?.id === item.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>{item.status}</span>
                            <span className="text-xs text-slate-400">{item.dateSubmitted}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            {item.type === 'Creative' && <Image className="w-3 h-3" />}
                            {item.type === 'Copy' && <FileText className="w-3 h-3" />}
                            {item.type === 'Video' && <Video className="w-3 h-3" />}
                            <span>Version {item.version}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center bg-slate-50/50">
            {selectedItem ? (
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                         <h2 className="font-bold text-lg text-slate-900">{selectedItem.title}</h2>
                         <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-6 h-6" /></button>
                    </div>

                    <div className="p-8 bg-slate-100 min-h-[400px] flex items-center justify-center">
                        {selectedItem.type === 'Creative' && (
                            <img src={selectedItem.contentUrl} alt="Ad Creative" className="max-w-full max-h-[500px] rounded shadow-sm" />
                        )}
                        {selectedItem.type === 'Copy' && (
                            <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">
                                {selectedItem.contentText}
                            </div>
                        )}
                        {selectedItem.type === 'Video' && (
                            <div className="bg-slate-900 w-full aspect-video rounded flex items-center justify-center text-white">
                                <Video className="w-16 h-16 opacity-50" />
                            </div>
                        )}
                    </div>

                    {selectedItem.status !== 'Approved' && (
                        <div className="p-6 bg-white border-t border-slate-100">
                            {isRejecting ? (
                                <div className="space-y-4 animate-fade-in">
                                    <label className="block text-sm font-bold text-slate-700">What needs to be changed?</label>
                                    <textarea 
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" 
                                        rows={3}
                                        placeholder="e.g. The logo is too small, please resize..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsRejecting(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold text-sm">Cancel</button>
                                        <button onClick={() => handleStatusChange('Changes Requested')} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm">Submit Request</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button onClick={() => handleStatusChange('Changes Requested')} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                                        <Edit3 className="w-4 h-4" /> Request Changes
                                    </button>
                                    <button onClick={() => handleStatusChange('Approved')} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Approve for Launch
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {selectedItem.status === 'Approved' && (
                        <div className="p-6 bg-emerald-50 border-t border-emerald-100 text-center">
                            <p className="text-emerald-800 font-bold flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Approved on {selectedItem.dateSubmitted}
                            </p>
                            <p className="text-emerald-600 text-xs mt-1">This asset has been queued for launch.</p>
                        </div>
                    )}
                    {selectedItem.status === 'Changes Requested' && !isRejecting && (
                         <div className="p-6 bg-red-50 border-t border-red-100">
                            <p className="text-red-800 font-bold flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4" /> Your Feedback:</p>
                            <p className="text-red-700 text-sm italic">"{selectedItem.feedback}"</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h2 className="text-xl font-bold text-slate-600">Select an item to review</h2>
                    <p>Approve pending creatives to move campaigns forward.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Approvals;
