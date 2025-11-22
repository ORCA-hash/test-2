
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Phone, Video, Info, CheckCheck, Paperclip, Mic, Smile, X, Video as VideoIcon, MicOff, VideoOff, PhoneOff, Calendar, AlertCircle, FileText, Download } from 'lucide-react';
import { Conversation, Message } from '../types';

interface MessagesProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

const Messages: React.FC<MessagesProps> = ({ conversations, setConversations }) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0].id);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Mock shared files if not present in type yet
  const sharedFiles = activeConv?.sharedFiles || [
      { id: 'f1', name: 'Contract_Signed.pdf', type: 'document', size: '2.4 MB', uploadDate: '2023-10-15', url: '#', clientName: '', uploadedBy: 'Admin' },
      { id: 'f2', name: 'Q3_Report_Final.pdf', type: 'document', size: '1.8 MB', uploadDate: '2023-10-10', url: '#', clientName: '', uploadedBy: 'Admin' },
      { id: 'f3', name: 'Logo_HighRes.png', type: 'image', size: '5.2 MB', uploadDate: '2023-09-01', url: '#', clientName: '', uploadedBy: 'Client' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConv) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    const updatedConvs = conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputText,
          unreadCount: 0
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: "Got it! Thanks for sending that over.",
        timestamp: new Date().toISOString()
      };
      
      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, reply],
            lastMessage: reply.text
          };
        }
        return c;
      }));
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full bg-white font-sans overflow-hidden relative">
      {/* 1. Left Sidebar: Conversation List (Hidden on mobile if needed) */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors border-b border-slate-100 ${
                activeConvId === conv.id 
                  ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' 
                  : 'hover:bg-slate-100 border-l-4 border-l-transparent'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                {conv.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${activeConvId === conv.id ? 'text-slate-900' : 'text-slate-700'}`}>{conv.clientName}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {conv.messages.length > 0 ? formatTime(conv.messages[conv.messages.length-1].timestamp) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <p className={`text-xs truncate max-w-[140px] ${conv.unreadCount > 0 ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                     {isTyping && activeConvId === conv.id ? <span className="text-indigo-500">Typing...</span> : conv.lastMessage}
                   </p>
                   {conv.unreadCount > 0 && (
                     <div className="min-w-[18px] h-[18px] bg-indigo-600 rounded-full flex items-center justify-center px-1">
                       <span className="text-[10px] font-bold text-white">{conv.unreadCount}</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Middle Area: Active Chat */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-white relative min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white z-10 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <img src={activeConv.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  {activeConv.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
               </div>
               <div>
                 <h3 className="font-bold text-slate-900 text-base">{activeConv.clientName}</h3>
                 <span className="text-xs text-slate-500 flex items-center gap-1.5">
                   {activeConv.isOnline ? 'Active Now' : 'Away'}
                 </span>
               </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
               <button onClick={() => alert("Redirect to Calendly...")} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Book a Call
               </button>
               <button className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">
                  <AlertCircle className="w-3.5 h-3.5" /> Request Revision
               </button>
               <div className="w-px h-6 bg-slate-200 mx-1"></div>
               <button onClick={() => setIsVideoCallOpen(true)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg"><Video className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
            {activeConv.messages.map((msg, idx) => (
              <div key={msg.id} className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                      msg.sender === 'me' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 px-1 select-none">
                    <span className="text-[11px] text-slate-400 font-medium">{formatTime(msg.timestamp)}</span>
                    {msg.sender === 'me' && (
                       <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div className="flex justify-start w-full animate-fade-in">
                 <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-slate-200">
             <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
               <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Paperclip className="w-5 h-5" />
               </button>
               <textarea 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                 }}
                 placeholder="Type your message..."
                 className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 py-2 text-sm outline-none resize-none max-h-32 custom-scrollbar"
                 rows={1}
                 style={{ minHeight: '40px' }}
               />
               <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Mic className="w-5 h-5" />
               </button>
               <button 
                 onClick={handleSendMessage}
                 disabled={!inputText.trim()}
                 className={`p-2 rounded-lg transition-all ${
                    inputText.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                 }`}
               >
                 <Send className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col text-slate-400 bg-slate-50/50">
          <Info className="w-10 h-10 text-slate-300 mb-4" />
          <p>Select a conversation to start chatting.</p>
        </div>
      )}

      {/* 3. Right Sidebar: Files & Info */}
      <div className="w-72 border-l border-slate-200 bg-slate-50 hidden xl:flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900">Shared Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sharedFiles.map((file) => (
                  <div key={file.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 group hover:border-indigo-300 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.size}</p>
                      </div>
                      <button className="text-slate-400 hover:text-indigo-600"><Download className="w-4 h-4" /></button>
                  </div>
              ))}
              <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:bg-white hover:text-indigo-600 transition-colors mt-2">
                  + Upload New File
              </button>
          </div>
          <div className="p-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase">Voice Note</h3>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer hover:bg-red-600"><Mic className="w-4 h-4" /></div>
                      <span className="text-xs font-medium text-slate-500">Tap to record</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Video Call Overlay */}
      {isVideoCallOpen && activeConv && (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center animate-fade-in">
           <div className="absolute top-4 right-4">
             <button onClick={() => setIsVideoCallOpen(false)} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20">
                <X className="w-6 h-6" />
             </button>
           </div>
           
           <div className="flex flex-col items-center mb-12">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-6 relative">
                 <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{activeConv.clientName}</h2>
              <p className="text-indigo-300 animate-pulse">Connecting...</p>
           </div>

           <div className="flex gap-6">
              <button className="p-4 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"><MicOff className="w-6 h-6" /></button>
              <button className="p-4 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"><VideoOff className="w-6 h-6" /></button>
              <button onClick={() => setIsVideoCallOpen(false)} className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"><PhoneOff className="w-8 h-8" /></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
