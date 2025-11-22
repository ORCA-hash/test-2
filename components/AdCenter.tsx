
import React, { useState } from 'react';
import { Facebook, Chrome, Sparkles, Zap, Copy, Check, AlertTriangle, Lightbulb, Target, LayoutTemplate, MoreHorizontal, Loader2, Link as LinkIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generateAdCopy, analyzeCampaignPerformance, generateMarketingStrategy } from '../services/geminiService';
import { GeneratedAdCopy, CampaignMetric, GeneratedStrategy } from '../types';

const mockData: CampaignMetric[] = [
  { date: 'Mon', clicks: 400, spend: 240, impressions: 12000, conversions: 20, revenue: 1200, platform: 'Facebook' },
  { date: 'Tue', clicks: 300, spend: 139, impressions: 8000, conversions: 15, revenue: 750, platform: 'Facebook' },
  { date: 'Wed', clicks: 550, spend: 480, impressions: 15000, conversions: 28, revenue: 2400, platform: 'Facebook' },
  { date: 'Thu', clicks: 480, spend: 390, impressions: 14000, conversions: 24, revenue: 1800, platform: 'Facebook' },
  { date: 'Fri', clicks: 600, spend: 520, impressions: 18000, conversions: 35, revenue: 3100, platform: 'Facebook' },
  { date: 'Sat', clicks: 700, spend: 600, impressions: 21000, conversions: 45, revenue: 3800, platform: 'Facebook' },
  { date: 'Sun', clicks: 750, spend: 650, impressions: 23000, conversions: 50, revenue: 4200, platform: 'Facebook' },
  { date: 'Mon', clicks: 320, spend: 300, impressions: 9000, conversions: 12, revenue: 1100, platform: 'Google' },
  { date: 'Tue', clicks: 450, spend: 410, impressions: 11000, conversions: 18, revenue: 1600, platform: 'Google' },
  { date: 'Wed', clicks: 420, spend: 380, impressions: 10500, conversions: 16, revenue: 1500, platform: 'Google' },
  { date: 'Thu', clicks: 500, spend: 460, impressions: 13000, conversions: 22, revenue: 2100, platform: 'Google' },
  { date: 'Fri', clicks: 580, spend: 540, impressions: 16000, conversions: 26, revenue: 2800, platform: 'Google' },
  { date: 'Sat', clicks: 620, spend: 600, impressions: 17000, conversions: 30, revenue: 3200, platform: 'Google' },
  { date: 'Sun', clicks: 690, spend: 680, impressions: 19000, conversions: 38, revenue: 3900, platform: 'Google' },
];

const AdCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'performance' | 'create' | 'strategy'>('connect');
  const [fbConnected, setFbConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<'Facebook' | 'Google'>('Facebook');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedAdCopy | null>(null);
  const [generatedStrategy, setGeneratedStrategy] = useState<GeneratedStrategy | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleConnect = (platform: 'fb' | 'google') => {
    setIsConnecting(true);
    // Simulate popup and delay
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const popup = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
    
    if(popup) {
        popup.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;height:100%;font-family:sans-serif;background:#f3f4f6;">
            <div style="text-align:center;">
                <h2>Connecting to ${platform === 'fb' ? 'Meta' : 'Google'}...</h2>
                <div style="width:40px;height:40px;border:4px solid #ddd;border-top:4px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:20px auto;"></div>
                <p>Please wait while we authorize your account.</p>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </div>
        </body></html>`);
        
        setTimeout(() => {
            popup.close();
            setIsConnecting(false);
            if (platform === 'fb') setFbConnected(true);
            else setGoogleConnected(true);
        }, 2500);
    } else {
        setIsConnecting(false);
        alert("Pop-up blocked. Please allow pop-ups to connect accounts.");
    }
  };

  const handleGenerate = async () => {
    if (!productName || !description) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      const result = await generateAdCopy(productName, description, platform, tone);
      setGeneratedResult(result);
    } catch (e) {
      alert("Failed to generate ad copy. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!productName || !description) return;
    setIsGenerating(true);
    setGeneratedStrategy(null);
    try {
      const result = await generateMarketingStrategy(productName, description);
      setGeneratedStrategy(result);
    } catch (e) {
       alert("Failed to generate strategy. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const summary = `Total Spend: $5,800. Avg CPC: $1.2. CTR on Facebook: 2.1%. CTR on Google: 3.5%. 
    Trend: Increasing spend on weekends yields 20% higher ROAS on Facebook but flat on Google.`;
    try {
      const insight = await analyzeCampaignPerformance(summary);
      setAnalysis(insight);
    } catch (e) {
      setAnalysis("Could not analyze data at this time.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderConnections = () => (
    <div className="max-w-4xl mx-auto mt-8">
       {isConnecting && (
           <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm">
               <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center animate-fade-in-up">
                   <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                   <h3 className="text-lg font-bold text-slate-900">Authorizing...</h3>
                   <p className="text-slate-500 text-sm">Please complete the flow in the popup window.</p>
               </div>
           </div>
       )}
       <div className="grid md:grid-cols-2 gap-8">
            <div className={`bg-white p-8 rounded-xl shadow-sm border transition-all ${fbConnected ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center">
                        <Facebook className="w-8 h-8 text-blue-600 fill-current" />
                    </div>
                    {fbConnected && <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Connected</div>}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Meta Ads Manager</h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">Sync campaigns, ad sets, and creatives from Facebook & Instagram.</p>
                <button 
                onClick={() => handleConnect('fb')}
                disabled={fbConnected}
                className={`w-full py-2.5 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${fbConnected ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}
                >
                {fbConnected ? 'Sync Active' : 'Connect Account'}
                </button>
            </div>

            <div className={`bg-white p-8 rounded-xl shadow-sm border transition-all ${googleConnected ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center">
                        <Chrome className="w-8 h-8 text-red-500" /> 
                    </div>
                    {googleConnected && <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Connected</div>}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Google Ads</h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">Manage Search, Display, and YouTube campaigns directly.</p>
                <button 
                onClick={() => handleConnect('google')}
                disabled={googleConnected}
                className={`w-full py-2.5 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${googleConnected ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'}`}
                >
                {googleConnected ? 'Sync Active' : 'Connect Account'}
                </button>
            </div>
       </div>
    </div>
  );

  const renderGenerator = () => (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
           <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Sparkles className="w-5 h-5" /></div>
           <h3 className="text-lg font-bold text-slate-900">Creative Studio</h3>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Target Platform</label>
            <div className="grid grid-cols-2 gap-3">
               {['Facebook', 'Google'].map((p) => (
                 <button 
                   key={p}
                   onClick={() => setPlatform(p as any)}
                   className={`py-2.5 text-sm font-medium rounded-lg border transition-all ${platform === p ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   {p}
                 </button>
               ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Product Name</label>
            <input 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. EcoFriendly Water Bottle"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Value Proposition</label>
            <textarea 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe key features, benefits, and target audience..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tone</label>
            <select 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Professional</option>
              <option>Playful</option>
              <option>Urgent (FOMO)</option>
              <option>Empathetic</option>
              <option>Luxury</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !productName}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/30 mt-4"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> Generate Magic Copy</>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 bg-slate-100 p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[500px]">
        {generatedResult ? (
          <div className="w-full max-w-lg animate-fade-in-up">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 font-bold">Live Preview</h3>
                <div className="flex gap-2">
                    <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-medium text-slate-600 hover:text-indigo-600">Mobile</button>
                    <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-medium text-slate-600 hover:text-indigo-600">Desktop</button>
                </div>
             </div>
             
             <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                {/* Mock Ad Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                   <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-3 flex items-center justify-center text-white font-bold">N</div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">Nexus Agency</div>
                            <div className="text-xs text-slate-500">Sponsored</div>
                        </div>
                   </div>
                   <MoreHorizontal className="text-slate-400 w-5 h-5" />
                </div>
                
                <div className="p-4">
                   <p className="text-sm text-slate-800 whitespace-pre-wrap mb-4 leading-relaxed">{generatedResult.primaryText}</p>
                   <div className="bg-slate-100 aspect-video rounded-lg flex items-center justify-center text-slate-400 mb-4 border border-slate-200 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-slate-200 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <span className="font-medium flex items-center gap-2"><LayoutTemplate className="w-5 h-5" /> Visual Asset Placeholder</span>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
                     <div>
                       <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">nexus.agency</p>
                       <h4 className="font-bold text-slate-900 text-lg">{generatedResult.headline}</h4>
                     </div>
                     <button className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold rounded transition-colors">
                       {generatedResult.callToAction}
                     </button>
                   </div>
                </div>
                
                {/* Ad Footer Reactions */}
                <div className="px-4 py-3 border-t border-slate-50 flex justify-between text-slate-500 text-sm">
                    <span>42 Likes</span>
                    <span>12 Comments</span>
                </div>
             </div>

             <div className="mt-8 flex justify-center gap-4">
               <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
                 <Copy className="w-4 h-4" /> Copy Text
               </button>
               <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
                 <Check className="w-4 h-4" /> Save to Library
               </button>
             </div>
          </div>
        ) : (
          <div className="text-center max-w-sm">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
                <Sparkles className="w-10 h-10 text-indigo-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Create?</h3>
             <p className="text-slate-500">Fill in the details on the left to let Gemini's advanced model write high-converting ad copy for you in seconds.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Cross-Channel Analytics</h3>
            <p className="text-slate-500 text-sm">Real-time performance tracking.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-all">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> AI Insights</>}
            </button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.filter((_, i) => i < 7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Clicks (FB)" />
              <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} name="Spend ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {analysis && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-xl animate-fade-in relative shadow-sm">
          <div className="absolute top-6 right-6 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
            Strategic Analysis
          </h4>
          <div className="text-indigo-900/80 text-sm leading-relaxed whitespace-pre-line font-medium">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col bg-slate-50/50 font-sans">
      <div className="px-8 py-6 border-b border-slate-200 bg-white">
         <h1 className="text-2xl font-bold text-slate-900">Ad Manager</h1>
         <div className="flex space-x-8 mt-6">
           {['connect', 'performance', 'create'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3 text-sm font-bold capitalize transition-all relative ${
                 activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
               }`}
             >
               {tab === 'create' ? 'Creative Studio' : tab}
               {activeTab === tab && (
                 <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
               )}
             </button>
           ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'connect' && renderConnections()}
        {activeTab === 'performance' && (fbConnected || googleConnected ? renderPerformance() : (
            <div className="h-full flex flex-col items-center justify-center pb-20">
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm max-w-md">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Sources Offline</h3>
                    <p className="text-slate-500 mb-6">Please connect at least one ad platform to view performance metrics.</p>
                    <button onClick={() => setActiveTab('connect')} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">Connect Platforms</button>
                </div>
            </div>
        ))}
        {activeTab === 'create' && renderGenerator()}
      </div>
    </div>
  );
};

export default AdCenter;
