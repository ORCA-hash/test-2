
import React, { useState } from 'react';
import { Mail, Shield, Activity, Plus, MoreHorizontal, X } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamProps {
  members: TeamMember[];
  addMember: (member: TeamMember) => void;
}

const Team: React.FC<TeamProps> = ({ members, addMember }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Creative Specialist');
  const [newEmail, setNewEmail] = useState('');

  const handleAddMember = () => {
    if (!newName || !newEmail) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newName,
      role: newRole,
      email: newEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`,
      activeTasks: 0
    };
    addMember(newMember);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Workforce</h1>
           <p className="text-slate-500 mt-1">Manage agency access and roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
               <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-50" />
               <div>
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{member.role}</span>
               </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</span>
                <span className="text-slate-700 font-medium">{member.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Workload</span>
                <span className="text-slate-900 font-bold">{member.activeTasks} tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal - Professional Centered */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-fade-in-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Invite Team Member</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                 <input type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Jane Doe" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                 <input type="email" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jane@nexusagency.com" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role</label>
                 <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option>Account Manager</option>
                    <option>Creative Specialist</option>
                    <option>Data Analyst</option>
                    <option>Media Buyer</option>
                 </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-200 font-medium text-sm">Cancel</button>
                <button onClick={handleAddMember} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-sm shadow-md">Send Invitation</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
