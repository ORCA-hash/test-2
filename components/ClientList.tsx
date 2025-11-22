
import React, { useState } from 'react';
import { Mail, MoreVertical, TrendingUp, DollarSign, Calendar, Search, Filter, Building, Plus, ArrowLeft, Globe, MapPin, Phone } from 'lucide-react';
import { Client, NavigationItem } from '../types';

interface ClientListProps {
  clients: Client[];
  addClient: (client: Client) => void;
  setActiveTab: (tab: NavigationItem) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, addClient, setActiveTab }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientContact, setNewClientContact] = useState('');

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddClient = () => {
    if (!newClientName) return;
    const newClient: Client = {
        id: Date.now().toString(),
        name: newClientName,
        email: newClientEmail,
        contact: newClientContact || 'Admin',
        status: 'Onboarding',
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(newClientName)}&background=random`,
        spend: 0,
        campaigns: 0,
        lastContact: 'Just now',
        health: 100,
        industry: 'General',
        location: 'Unknown',
        onboardingProgress: 0
    };
    addClient(newClient);
    setIsAddModalOpen(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientContact('');
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  if (selectedClient) {
     return (
        <div className="p-8 h-full overflow-y-auto bg-slate-50/50 font-sans animate-fade-in">
           <button onClick={() => setSelectedClient(null)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
           </button>
           
           {/* Client Header */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div className="flex items-center gap-6">
                    <img src={selectedClient.img} alt="" className="w-24 h-24 rounded-xl object-cover border border-slate-100 shadow-sm" />
                    <div>
                       <h1 className="text-3xl font-bold text-slate-900">{selectedClient.name}</h1>
                       <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                          <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {selectedClient.industry}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedClient.location}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50">Edit Profile</button>
                    <button onClick={() => setActiveTab('tasks')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm">Create Task</button>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-slate-100">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Lifetime Spend</label>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${selectedClient.spend.toLocaleString()}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Active Campaigns</label>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedClient.campaigns}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Health Score</label>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-2xl font-bold ${getHealthColor(selectedClient.health)}`}>{selectedClient.health}%</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Contact</label>
                    <div className="flex flex-col mt-1">
                       <span className="font-medium text-slate-900">{selectedClient.contact}</span>
                       <span className="text-sm text-slate-500">{selectedClient.email}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Recent Activity Mock */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                 <div className="space-y-4">
                    {[1,2,3].map((i) => (
                       <div key={i} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Calendar className="w-4 h-4" /></div>
                          <div>
                             <p className="text-sm font-medium text-slate-900">Meeting scheduled with {selectedClient.contact}</p>
                             <p className="text-xs text-slate-500 mt-1">2 days ago</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-bold text-slate-800 mb-4">Internal Notes</h3>
                 <textarea className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Add a note..." />
                 <button className="mt-2 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Save Note</button>
              </div>
           </div>
        </div>
     )
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 font-sans relative">
      <div className="px-8 py-6 flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-slate-900">Client CRM</h1>
           <p className="text-slate-500 text-sm mt-1">Manage relationships and account health.</p>
         </div>
         <div className="flex gap-3">
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
               />
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-md flex items-center gap-2">
               <Plus className="w-4 h-4" /> Add Client
            </button>
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Spend</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={client.img} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-sm" />
                      <div>
                        <span className="block font-bold text-slate-900 text-sm">{client.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Building className="w-3 h-3" /> {client.industry}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-slate-800">{client.contact}</div>
                    <div className="text-xs text-slate-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      client.status === 'Onboarding' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-medium text-slate-700">${client.spend.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                     <div className={`font-bold ${getHealthColor(client.health)}`}>{client.health}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
         <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fade-in-up">
               <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Client</h2>
               <div className="space-y-4">
                  <input type="text" placeholder="Company Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                  <input type="text" placeholder="Primary Contact Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newClientContact} onChange={e => setNewClientContact(e.target.value)} />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} />
                  <div className="flex gap-3 pt-2">
                     <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
                     <button onClick={handleAddClient} className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Create Client</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ClientList;
