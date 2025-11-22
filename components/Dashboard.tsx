
import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, CheckCircle, Clock, Plus, MoreHorizontal, Filter, Zap, Users, ArrowRight, BarChart, Rocket, FileText, MessageSquareText, Receipt, Calendar, Upload, ThumbsUp } from 'lucide-react';
import { Task, TaskStatus, UserProfile, NavigationItem } from '../types';

interface DashboardProps {
  tasks: Task[];
  userProfile: UserProfile;
  setActiveTab: (tab: NavigationItem) => void;
  isClient: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, userProfile, setActiveTab, isClient }) => {
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE).length;
  const highPriority = tasks.filter(t => t.priority === 'HIGH' && t.status !== TaskStatus.DONE).length;
  
  // Agency View Metrics
  const agencyMetrics = [
    { label: 'Monthly Revenue', value: '$42,450', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Retainers', value: '14', change: '+2', isPositive: true, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Deliverables', value: pendingTasks.toString(), change: '-3', isPositive: true, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Efficiency Score', value: '94/100', change: '+1.2%', isPositive: true, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  if (isClient) {
    // "Start Here" Dashboard for Clients (Premium A-Z Layout)
    return (
        <div className="p-10 space-y-10 bg-white min-h-full font-sans">
            {/* Header */}
            <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-8">
                <div className="flex items-center gap-6">
                    <img src={userProfile.avatarUrl} className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-sm" alt="Profile" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome, {userProfile.userName.split(' ')[0]}</h1>
                        <p className="text-slate-500 mt-2 text-lg">Acme Corp • E-commerce Strategy</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <div className="bg-slate-50 rounded-lg p-4 min-w-[200px] text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Onboarding</p>
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-2xl font-bold text-indigo-600">80%</span>
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button onClick={() => setActiveTab('approvals')} className="group p-8 bg-indigo-50 hover:bg-indigo-600 hover:shadow-xl hover:-translate-y-1 rounded-2xl text-left transition-all duration-300 border border-indigo-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ThumbsUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-900 group-hover:text-white mb-1">Approve Ads</h3>
                        <p className="text-sm text-indigo-600/70 group-hover:text-indigo-100">3 Pending Review</p>
                    </button>

                    <button onClick={() => setActiveTab('assets')} className="group p-8 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg rounded-2xl text-left transition-all duration-300">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Upload File</h3>
                        <p className="text-sm text-slate-500">Send assets to team.</p>
                    </button>

                    <button onClick={() => setActiveTab('messages')} className="group p-8 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg rounded-2xl text-left transition-all duration-300">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MessageSquareText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Messages</h3>
                        <p className="text-sm text-slate-500">Chat with agency.</p>
                    </button>

                    <button onClick={() => setActiveTab('resources')} className="group p-8 bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg rounded-2xl text-left transition-all duration-300">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Rocket className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Resources</h3>
                        <p className="text-sm text-slate-500">Training & Scripts.</p>
                    </button>
                </div>
            </div>

            {/* Bottom Section: Performance & Meeting */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                {/* Performance Snapshot */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Performance Snapshot</h3>
                            <p className="text-sm text-slate-500">Last 7 Days vs Previous Period</p>
                        </div>
                        <button onClick={() => setActiveTab('reports')} className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">Full Report <ArrowRight className="w-4 h-4"/></button>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spend</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">$1,204</p>
                            <span className="text-xs text-emerald-600 font-bold flex justify-center mt-1"><ArrowUpRight className="w-3 h-3"/> 12%</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">42</p>
                            <span className="text-xs text-emerald-600 font-bold flex justify-center mt-1"><ArrowUpRight className="w-3 h-3"/> 8%</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CPL</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">$28.50</p>
                            <span className="text-xs text-emerald-600 font-bold flex justify-center mt-1"><ArrowDownRight className="w-3 h-3"/> 5%</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CTR</p>
                            <p className="text-2xl font-bold text-blue-600 mt-2">2.1%</p>
                            <span className="text-xs text-slate-400 font-bold flex justify-center mt-1">--</span>
                        </div>
                    </div>
                </div>

                {/* Next Meeting Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-6">Next Strategy Call</h3>
                    <div className="flex-1 flex flex-col items-center justify-center bg-indigo-50/50 rounded-xl border border-indigo-100 p-6 mb-4">
                        <Calendar className="w-10 h-10 text-indigo-600 mb-3" />
                        <p className="text-lg font-bold text-slate-900">Thursday, Oct 26</p>
                        <p className="text-indigo-600 font-medium">2:00 PM EST</p>
                    </div>
                    <button className="w-full py-3 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Reschedule</button>
                </div>
            </div>
        </div>
    );
  }

  // Agency View (Original Command Center)
  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-full animate-fade-in font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, {userProfile.userName}. System status is nominal.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setActiveTab('tasks')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-md"
            >
                <Plus className="w-4 h-4" /> Create Task
            </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agencyMetrics.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.isPositive ? (
                <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> {stat.change}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" /> Live Activity Feed
                </h2>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="p-5 flex items-start space-x-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <div className="relative">
                        <img 
                        src={`https://picsum.photos/40/40?random=${i + 10}`} 
                        alt="User" 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {['Sarah Miller', 'Mike Ross', 'System Alert', 'Jessica Lee', 'Tom Green'][i]}
                        </p>
                        <span className="text-xs text-slate-400 font-mono">
                            {['12:04 PM', '11:45 AM', '11:30 AM', '10:15 AM', '09:00 AM'][i]}
                        </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                        {['Approved the Q3 ad budget proposal.', 'Uploaded new creative assets for review.', 'Campaign "Summer Sale" reached 10k impressions.', 'Commented on the homepage redesign task.', 'Paid Invoice #INV-3021'][i]}
                        </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        {/* Priority Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Urgent Actions</h2>
              </div>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">{highPriority} Tasks</span>
            </div>
            <div className="p-2">
              {tasks.filter(t => t.priority === 'HIGH' && t.status !== TaskStatus.DONE).slice(0, 3).map(task => (
                <div key={task.id} onClick={() => setActiveTab('tasks')} className="p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group border border-transparent hover:border-slate-200 mb-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{task.clientName}</span>
                    <span className="text-[10px] font-mono text-red-500 font-medium">Due Today</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                     <img src={`https://ui-avatars.com/api/?name=${task.assignee}&background=random`} className="w-5 h-5 rounded-full" alt=""/>
                     <span className="text-xs text-slate-500">{task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
