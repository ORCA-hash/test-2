
import React from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Users, Settings, LogOut, Hexagon, FolderOpen, PieChart, MessageSquareText, Receipt, Calendar as CalendarIcon, Briefcase, Rocket, ThumbsUp, BookOpen } from 'lucide-react';
import { NavigationItem, UserProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationItem;
  setActiveTab: (tab: NavigationItem) => void;
  userProfile: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userProfile, onLogout }) => {
  
  const isClient = userProfile.role === 'client';

  const agencyGroups = [
    {
      label: "Workspace",
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'tasks', label: 'Projects', icon: CheckSquare },
        { id: 'messages', label: 'Inbox', icon: MessageSquareText },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
      ]
    },
    {
      label: "Client Management",
      items: [
        { id: 'clients', label: 'CRM', icon: Users },
        { id: 'approvals', label: 'Approvals', icon: ThumbsUp },
        { id: 'ads', label: 'Ad Campaigns', icon: BarChart2 },
        { id: 'reports', label: 'Intelligence', icon: PieChart },
        { id: 'assets', label: 'Assets Library', icon: FolderOpen },
      ]
    },
    {
      label: "Operations",
      items: [
        { id: 'invoices', label: 'Billing & Finance', icon: Receipt },
        { id: 'team', label: 'Workforce', icon: Briefcase },
        { id: 'settings', label: 'Admin Settings', icon: Settings },
      ]
    }
  ];

  const clientGroups = [
    {
      label: "Start Here",
      items: [
        { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
        { id: 'onboarding', label: 'Onboarding', icon: Rocket },
      ]
    },
    {
      label: "Collaboration",
      items: [
        { id: 'messages', label: 'Messages & Calls', icon: MessageSquareText },
        { id: 'approvals', label: 'Approve Ads', icon: ThumbsUp },
        { id: 'tasks', label: 'Requests & Tasks', icon: CheckSquare },
        { id: 'assets', label: 'Files & Assets', icon: FolderOpen },
      ]
    },
    {
      label: "Results & Growth",
      items: [
        { id: 'reports', label: 'Reports', icon: PieChart },
        { id: 'invoices', label: 'Billing & Docs', icon: Receipt },
        { id: 'resources', label: 'Resource Library', icon: BookOpen },
        { id: 'settings', label: 'Profile', icon: Settings },
      ]
    }
  ];

  const menuGroups = isClient ? clientGroups : agencyGroups;

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full fixed left-0 top-0 border-r border-slate-800 z-50 font-sans">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0f172a]">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-900/50">
            <Hexagon className="text-white w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col overflow-hidden">
             <span className="text-white font-bold tracking-tight text-sm truncate">{userProfile.agencyName.toUpperCase()}</span>
             {isClient && <span className="text-[10px] text-indigo-400 uppercase font-bold">Client Portal</span>}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{group.label}</h3>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavigationItem)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group relative ${
                    activeTab === item.id
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r"></div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
        <div className="flex items-center gap-3 mb-4 px-2">
            <img src={userProfile.avatarUrl} className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{userProfile.userName}</span>
                <span className="text-[10px] text-slate-500 capitalize">{userProfile.role.replace('_', ' ')}</span>
            </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors group"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
