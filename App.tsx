
import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import NotificationToast from './components/NotificationToast';
import AuthLogin from './components/AuthLogin';
import { NavigationItem, Task, TaskStatus, Priority, Asset, Conversation, UserProfile, Invoice, TeamMember, Notification, AuthState, Client } from './types';
import { Loader2 } from 'lucide-react';

// Lazy Load Components to fix Lag
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const TaskBoard = React.lazy(() => import('./components/TaskBoard'));
const AdCenter = React.lazy(() => import('./components/AdCenter'));
const ClientList = React.lazy(() => import('./components/ClientList'));
const AssetsLibrary = React.lazy(() => import('./components/AssetsLibrary'));
const Reports = React.lazy(() => import('./components/Reports'));
const Messages = React.lazy(() => import('./components/Messages'));
const Settings = React.lazy(() => import('./components/Settings'));
const Invoices = React.lazy(() => import('./components/Invoices'));
const CalendarView = React.lazy(() => import('./components/CalendarView'));
const Team = React.lazy(() => import('./components/Team'));
const Onboarding = React.lazy(() => import('./components/Onboarding'));
const Approvals = React.lazy(() => import('./components/Approvals'));
const Resources = React.lazy(() => import('./components/Resources'));

const App: React.FC = () => {
  // --- Auth State with Persistence ---
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('nexus_auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const [activeTab, setActiveTab] = useState<NavigationItem>('dashboard');
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    setNotification({ id, type, message });
  };

  const handleLogin = (user: UserProfile) => {
    const authState = { isAuthenticated: true, user };
    setAuth(authState);
    localStorage.setItem('nexus_auth', JSON.stringify(authState));
    showNotification('success', `Welcome back, ${user.userName.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem('nexus_auth');
    setActiveTab('dashboard');
  };

  // --- Global State ---
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: "Acme Corp", contact: "Sarah Miller", email: "sarah@acme.com", status: "Active", img: "https://picsum.photos/200?random=1", spend: 12400, campaigns: 4, lastContact: '2 days ago', health: 92, industry: 'Retail', location: 'New York, USA', onboardingProgress: 100 },
    { id: '2', name: "TechStart Inc", contact: "Mike Ross", email: "m.ross@techstart.io", status: "Onboarding", img: "https://picsum.photos/200?random=2", spend: 0, campaigns: 0, lastContact: 'Yesterday', health: 100, industry: 'SaaS', location: 'San Francisco, USA', onboardingProgress: 40 },
    { id: '3', name: "FashionNova", contact: "Jessica Lee", email: "jess@fashionnova.com", status: "Active", img: "https://picsum.photos/200?random=3", spend: 45200, campaigns: 12, lastContact: '1 week ago', health: 78, industry: 'E-commerce', location: 'Los Angeles, USA', onboardingProgress: 100 },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review Q3 Strategy', description: 'Finalize budget allocation for upcoming quarter.', status: TaskStatus.IN_PROGRESS, assignee: 'Mike Ross', priority: Priority.HIGH, dueDate: new Date().toISOString(), clientName: 'TechStart Inc', comments: [] },
    { id: '2', title: 'FB Ad Creatives', description: 'Design 3 variations for the summer sale.', status: TaskStatus.TODO, assignee: 'Jessica Lee', priority: Priority.MEDIUM, dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), clientName: 'Acme Corp', comments: [
        { id: 'c1', author: 'Sarah Miller (Client)', text: 'Can we use the blue brand color?', timestamp: new Date().toISOString(), isClient: true },
        { id: 'c2', author: 'You (Agency)', text: 'Sure, updating the palette now.', timestamp: new Date().toISOString(), isClient: false }
    ] },
    { id: '3', title: 'Setup Google Conversion Tracking', description: 'Ensure pixels are firing correctly on checkout.', status: TaskStatus.DONE, assignee: 'Tech Team', priority: Priority.HIGH, dueDate: new Date().toISOString(), clientName: 'EcoFoods', comments: [] },
  ]);

  const [assets] = useState<Asset[]>([
     { id: '1', name: 'Summer_Campaign_Banner_v2.jpg', type: 'image', url: 'https://picsum.photos/id/20/800/600', size: '2.4 MB', dimension: '1920x1080', uploadDate: new Date(Date.now() - 100000000).toISOString(), clientName: 'Acme Corp', uploadedBy: 'Alex Mitchell' },
     { id: '2', name: 'Product_Demo_Final_Cut.mp4', type: 'video', url: '', size: '145 MB', uploadDate: new Date(Date.now() - 200000000).toISOString(), clientName: 'TechStart Inc', uploadedBy: 'Sarah Johnson' },
     { id: '3', name: 'Q3_Brand_Guidelines.pdf', type: 'document', url: '', size: '4.2 MB', uploadDate: new Date(Date.now() - 300000000).toISOString(), clientName: 'FashionNova', uploadedBy: 'Alex Mitchell' },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    { 
      id: 'c1', 
      clientName: 'Sarah Miller (Acme Corp)', 
      avatar: 'https://picsum.photos/200?random=1', 
      lastMessage: 'Looks great, lets launch!', 
      unreadCount: 2, 
      isOnline: true,
      sharedFiles: [],
      messages: [
        { id: 'm1', sender: 'them', text: 'Hi Alex, have you seen the latest draft?', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'm2', sender: 'me', text: 'Yes, reviewing it now.', timestamp: new Date(Date.now() - 3500000).toISOString() },
        { id: 'm4', sender: 'them', text: 'Looks great, lets launch!', timestamp: new Date().toISOString() },
      ]
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: 'INV-3021', 
      clientName: 'Acme Corp', 
      items: [{ description: 'Q3 Retainer', amount: 4500 }],
      totalAmount: 4500, 
      status: 'Paid', 
      dateIssued: new Date(Date.now() - 86400000 * 10).toISOString(), 
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString() 
    },
    { 
      id: 'INV-3022', 
      clientName: 'TechStart Inc', 
      items: [{ description: 'Ad Spend Management', amount: 1200 }],
      totalAmount: 1200, 
      status: 'Pending', 
      dateIssued: new Date(Date.now() - 86400000 * 2).toISOString(), 
      dueDate: new Date(Date.now() + 86400000 * 12).toISOString() 
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alex Mitchell', role: 'Owner / Admin', email: 'alex@nexusagency.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Mitchell&background=6366f1&color=fff', activeTasks: 3 },
    { id: '2', name: 'Sarah Johnson', role: 'Creative Director', email: 'sarah.j@nexusagency.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff', activeTasks: 5 },
  ]);

  // --- Filtering Logic based on Role ---
  const isClient = auth.user?.role === 'client';
  const userCompany = auth.user?.companyName;

  const visibleTasks = isClient 
    ? tasks.filter(t => t.clientName === userCompany)
    : tasks;

  const visibleAssets = isClient
    ? assets.filter(a => a.clientName === userCompany)
    : assets;
  
  const visibleInvoices = isClient
    ? invoices.filter(i => i.clientName === userCompany)
    : invoices;

  const addClient = (client: Client) => {
    setClients([...clients, client]);
    showNotification('success', `Client ${client.name} added successfully.`);
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    showNotification('success', 'Task created successfully.');
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    showNotification('success', `Invoice ${invoice.id} generated.`);
  };

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
    showNotification('success', `${member.name} invited to the team.`);
  };

  const renderContent = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-full bg-slate-50">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      }>
        {(() => {
          switch (activeTab) {
            case 'dashboard':
              return <Dashboard tasks={visibleTasks} userProfile={auth.user!} setActiveTab={setActiveTab} isClient={isClient} />;
            case 'onboarding':
              return <Onboarding />;
            case 'messages':
              return <Messages conversations={conversations} setConversations={setConversations} />;
            case 'tasks':
              return <TaskBoard tasks={visibleTasks} setTasks={setTasks} clients={clients} addTask={addTask} isClient={isClient} />;
            case 'ads':
              return isClient ? <Reports isClient={true} userProfile={auth.user!} /> : <AdCenter />;
            case 'reports':
              return <Reports isClient={isClient} userProfile={auth.user!} />;
            case 'clients':
              return <ClientList clients={clients} addClient={addClient} setActiveTab={setActiveTab} />;
            case 'assets':
              return <AssetsLibrary assets={visibleAssets} />;
            case 'settings':
              return <Settings userProfile={auth.user!} setUserProfile={(p) => {
                  setAuth({...auth, user: p as UserProfile});
                  localStorage.setItem('nexus_auth', JSON.stringify({...auth, user: p}));
              }} />;
            case 'invoices':
              return <Invoices invoices={visibleInvoices} addInvoice={addInvoice} clients={clients} isClient={isClient} />;
            case 'calendar':
              return <CalendarView tasks={visibleTasks} addTask={addTask} />;
            case 'team':
              return <Team members={teamMembers} addMember={addTeamMember} />;
            case 'approvals':
              return <Approvals />;
            case 'resources':
              return <Resources />;
            default:
              return <Dashboard tasks={visibleTasks} userProfile={auth.user!} setActiveTab={setActiveTab} isClient={isClient} />;
          }
        })()}
      </Suspense>
    );
  };

  if (!auth.isAuthenticated) {
    return (
      <React.Fragment>
        <AuthLogin onLogin={handleLogin} />
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      </React.Fragment>
    );
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={auth.user!}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 h-full overflow-hidden relative">
        {renderContent()}
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      </main>
    </div>
  );
};

export default App;
