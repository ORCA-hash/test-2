
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, DollarSign, Target, MousePointer, Zap, CheckCircle, ChevronDown, Play, Calendar, Download, AlertTriangle, ArrowUpRight, ArrowDownRight, ExternalLink, MessageSquare, RefreshCw, Save, Edit3, Loader2 } from 'lucide-react';
import { UserProfile, ReportData, WeeklyReport } from '../types';
import { getReportData, updateWeeklyReport, triggerDataSync, generatePDF } from '../services/reportService';

interface ReportsProps {
    isClient: boolean;
    userProfile?: UserProfile; // Optional for now to keep compatibility, but we use it for permission
}

const Reports: React.FC<ReportsProps> = ({ isClient, userProfile }) => {
  const [dateRange, setDateRange] = useState<number>(30);
  const [graphMetric, setGraphMetric] = useState<'conversions' | 'cpl' | 'spend' | 'ctr'>('conversions');
  
  // State for Data
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Admin Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedReport, setEditedReport] = useState<WeeklyReport | null>(null);

  const isAdmin = userProfile?.role === 'agency_admin';

  // --- Fetch Data on Mount or Date Change ---
  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
        const result = await getReportData('client_1', dateRange);
        setData(result);
        setEditedReport(result.weeklyReport);
    } catch (error) {
        console.error("Failed to load report data", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
        await triggerDataSync('client_1');
        await loadData(); // Reload data after sync
    } finally {
        setIsSyncing(false);
    }
  };

  const handleExport = async () => {
      setIsExporting(true);
      await generatePDF(data!);
      setIsExporting(false);
      alert("Executive Report PDF downloaded.");
  };

  const handleSaveReport = async () => {
      if (!editedReport) return;
      setIsSaving(true);
      await updateWeeklyReport('client_1', editedReport);
      setData(prev => prev ? { ...prev, weeklyReport: editedReport } : null);
      setIsSaving(false);
      setIsEditing(false);
  };

  // Text Area Helper for Admin Mode
  const AdminTextArea = ({ 
    value, 
    onChange, 
    label 
  }: { value: string[], onChange: (val: string[]) => void, label: string }) => (
    <div className="w-full">
        <textarea 
            className="w-full p-3 border-2 border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[120px]"
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
            placeholder={`Enter ${label} (one per line)...`}
        />
        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Editing {label} - One item per line</p>
    </div>
  );

  if (isLoading || !data) {
      return (
          <div className="h-full flex items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                  <h3 className="text-slate-900 font-bold">Loading Report Data...</h3>
                  <p className="text-slate-500 text-sm">Aggregating metrics from Ad Platforms.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 font-sans custom-scrollbar">
      {/* 🔹 TOP BAR (Control Room Header) */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Mission Control</h1>
            <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></div> 
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    {isSyncing ? 'Syncing with Ad Platforms...' : 'Live Data • Real-time'}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {/* Admin: Sync Button */}
            {isAdmin && (
                <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Force Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            )}

            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm hover:border-indigo-300 transition-colors">
                <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(Number(e.target.value))}
                    className="text-sm font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                </select>
            </div>
            
            {/* Admin: Edit Toggle */}
            {isAdmin && !isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <Edit3 className="w-4 h-4 text-indigo-600" /> Edit Report
                </button>
            )}

            {isAdmin && isEditing && (
                <button 
                    onClick={handleSaveReport}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
            )}

            <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {isExporting ? 'Generating...' : <><Download className="w-4 h-4" /> PDF</>}
            </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        
        {/* 🔹 SECTION 1: PERFORMANCE SNAPSHOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Leads */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leads</p>
                    <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{data.totals.leads.toLocaleString()}</h3>
                <p className="text-xs text-slate-500 mt-2">Total conversions</p>
            </div>

            {/* Card 2: CPL */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost Per Lead</p>
                    <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <ArrowDownRight className="w-3 h-3 mr-1" /> 8%
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">${data.totals.cpl.toFixed(2)}</h3>
                <p className="text-xs text-slate-500 mt-2">Avg. cost per acquisition</p>
            </div>

            {/* Card 3: Spend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spend</p>
                    <div className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> 24%
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">${data.totals.spend.toLocaleString()}</h3>
                <p className="text-xs text-slate-500 mt-2">Total budget used</p>
            </div>

            {/* Card 4: CTR */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CTR</p>
                    <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> 0.4%
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{data.totals.ctr.toFixed(2)}%</h3>
                <p className="text-xs text-slate-500 mt-2">Click-through rate</p>
            </div>
        </div>

        {/* 🔹 SECTION 2: THE MAIN GRAPH */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Trend Analysis</h2>
                    <p className="text-sm text-slate-500">Visualizing performance over time.</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-lg">
                    {[
                        { id: 'conversions', label: 'Leads' }, 
                        { id: 'cpl', label: 'CPL' }, 
                        { id: 'spend', label: 'Spend' }, 
                        { id: 'ctr', label: 'CTR' }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setGraphMetric(m.id as any)}
                            className={`px-6 py-2 text-xs font-bold rounded-md transition-all uppercase tracking-wide ${
                                graphMetric === m.id 
                                ? 'bg-white text-indigo-600 shadow-sm scale-105' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => graphMetric === 'spend' || graphMetric === 'cpl' ? `$${val}` : val}
                        />
                        <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                            formatter={(val: number) => [
                                graphMetric === 'spend' || graphMetric === 'cpl' ? `$${val.toFixed(2)}` : val.toFixed(2), 
                                graphMetric.toUpperCase()
                            ]}
                            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey={graphMetric} 
                            stroke="#4f46e5" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorMetric)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 🔹 SECTION 3: DAILY BREAKDOWN TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Daily Breakdown</h2>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View All History <ChevronDown className="w-3 h-3" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-100">Date</th>
                            <th className="px-6 py-4 border-b border-slate-100">Leads</th>
                            <th className="px-6 py-4 border-b border-slate-100">Spend</th>
                            <th className="px-6 py-4 border-b border-slate-100">CPL</th>
                            <th className="px-6 py-4 border-b border-slate-100">CTR</th>
                            <th className="px-6 py-4 border-b border-slate-100 w-1/3">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {data.dailyData.slice().reverse().slice(0, 7).map((day) => (
                            <tr key={day.date} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-700">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{day.conversions}</td>
                                <td className="px-6 py-4 text-slate-600">${day.spend.toLocaleString()}</td>
                                <td className="px-6 py-4 text-slate-600">${day.cpl.toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-600">{day.ctr.toFixed(2)}%</td>
                                <td className="px-6 py-4 text-slate-500 italic group-hover:text-slate-700 transition-colors">
                                    {day.notes ? (
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> {day.notes}</span>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 🔹 SECTION 4 & 5: STRATEGY & NEXT STEPS */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Strategy Grid */}
            <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
                {/* Wins */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle className="w-4 h-4" /></div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Wins</h3>
                    </div>
                    {isEditing && editedReport ? (
                        <AdminTextArea label="Wins" value={editedReport.wins} onChange={(val) => setEditedReport({...editedReport, wins: val})} />
                    ) : (
                        <ul className="space-y-4">
                            {data.weeklyReport.wins.map((item, i) => (
                                <li key={i} className="text-sm text-slate-600 leading-relaxed border-l-2 border-emerald-100 pl-3">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Problems */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600"><AlertTriangle className="w-4 h-4" /></div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Problems</h3>
                    </div>
                    {isEditing && editedReport ? (
                        <AdminTextArea label="Problems" value={editedReport.problems} onChange={(val) => setEditedReport({...editedReport, problems: val})} />
                    ) : (
                        <ul className="space-y-4">
                            {data.weeklyReport.problems.map((item, i) => (
                                <li key={i} className="text-sm text-slate-600 leading-relaxed border-l-2 border-amber-100 pl-3">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><Zap className="w-4 h-4" /></div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Actions Taken</h3>
                    </div>
                    {isEditing && editedReport ? (
                        <AdminTextArea label="Actions" value={editedReport.actions} onChange={(val) => setEditedReport({...editedReport, actions: val})} />
                    ) : (
                        <ul className="space-y-4">
                            {data.weeklyReport.actions.map((item, i) => (
                                <li key={i} className="text-sm text-slate-600 leading-relaxed border-l-2 border-blue-100 pl-3">{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Next Steps & Loom */}
            <div className="space-y-6">
                {/* Next Steps */}
                <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-24 h-24" /></div>
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400" /> Next Steps</h3>
                    
                    {isEditing && editedReport ? (
                        <div className="relative z-10">
                            <textarea 
                                className="w-full p-3 bg-slate-800 text-white rounded border border-slate-700 focus:border-indigo-500 outline-none text-sm min-h-[150px]"
                                value={editedReport.nextSteps.join('\n')}
                                onChange={(e) => setEditedReport({...editedReport, nextSteps: e.target.value.split('\n')})}
                            />
                        </div>
                    ) : (
                        <ul className="space-y-4 relative z-10">
                            {data.weeklyReport.nextSteps.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                {/* 🔹 SECTION 7: LOOM VIDEO */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer relative hover:shadow-md transition-all">
                     <div className="aspect-video bg-slate-100 relative">
                         <img src="https://picsum.photos/seed/loom_thumb/800/450" alt="Video Thumbnail" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                 <Play className="w-6 h-6 text-indigo-600 ml-1" />
                             </div>
                         </div>
                         <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">4:12</div>
                     </div>
                     <div className="p-4 flex justify-between items-center">
                         <div>
                            <h4 className="font-bold text-slate-900 text-sm">Weekly Summary Walkthrough</h4>
                            <p className="text-xs text-slate-500 mt-1">Recorded by Alex Mitchell</p>
                         </div>
                         <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">Watch Now</button>
                     </div>
                </div>
            </div>
        </div>

        {/* 🔹 SECTION 6: AD PREVIEW BLOCK */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Creative Performance</h2>
                <div className="flex gap-2">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Active: {data.ads.filter(a => a.status === 'Active').length}</span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Testing: {data.ads.filter(a => a.status === 'Testing').length}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.ads.map((ad) => (
                    <div key={ad.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                        <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-white">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${ad.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ad.status === 'Testing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                {ad.status}
                            </span>
                            <button className="text-slate-300 hover:text-indigo-600 transition-colors"><ExternalLink className="w-4 h-4" /></button>
                        </div>
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                             <img src={ad.thumbnailUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                 <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                                     <Play className="w-3 h-3" /> Preview
                                 </button>
                             </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1" title={ad.headline}>
                                {ad.headline}
                            </h4>
                            <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${ad.platform === 'Facebook' ? 'bg-blue-600' : ad.platform === 'TikTok' ? 'bg-black' : 'bg-red-500'}`}></span> {ad.platform} • {ad.type}
                            </p>
                            
                            <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Leads</p>
                                    <p className="text-lg font-bold text-slate-900">{ad.leads}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTR</p>
                                    <p className={`text-lg font-bold ${ad.ctr > 1.5 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {ad.ctr}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                             <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                 <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {ad.comments} comments
                             </span>
                             <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Spacer */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default Reports;
