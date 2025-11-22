
import React, { useState, useRef } from 'react';
import { Save, User, Building, Mail, Bell, Upload, Camera, Shield, Key, CreditCard } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, setUserProfile }) => {
  const [formData, setFormData] = useState(userProfile);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setUserProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, avatarUrl: url });
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-500 mb-8">Manage your account, security, and preferences.</p>

      <div className="max-w-4xl space-y-8">
        
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> Public Profile
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={formData.avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 group-hover:opacity-75 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
              <div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Change Avatar
                  </button>
                  <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size 800K</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input 
                    type="text" 
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" /> Security & Login
                </h2>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                   <div>
                       <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                       <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                   </div>
                   <button className="text-sm font-bold text-indigo-600 hover:underline">Enable</button>
               </div>
               <div className="flex justify-between items-center py-2">
                   <div>
                       <p className="text-sm font-bold text-slate-800">Change Password</p>
                       <p className="text-xs text-slate-500">Last changed 3 months ago.</p>
                   </div>
                   <button className="text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded">Update</button>
               </div>
            </div>
        </div>

        {/* Agency Settings (Only for Agency) */}
        {userProfile.role === 'agency_admin' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-500" /> Agency Details
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agency Name</label>
                <input 
                    type="text" 
                    value={formData.agencyName}
                    onChange={e => setFormData({...formData, agencyName: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                </div>
            </div>
            </div>
        )}

        <div className="flex justify-end pt-4 pb-8">
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
              isSaved ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSaved ? 'Changes Saved!' : 'Save Changes'}
            {!isSaved && <Save className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
