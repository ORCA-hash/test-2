
import React, { useState } from 'react';
import { CheckCircle, Play, Upload, Shield, Check, FileText, CreditCard, PenTool, AlertCircle } from 'lucide-react';
import { OnboardingStep } from '../types';

const Onboarding: React.FC = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: '1', title: 'Welcome Video', description: 'A quick 30s intro from our founder.', completed: true, type: 'video' },
    { id: '2', title: 'Business Intake', description: 'Target audience, offer, and goals.', completed: false, type: 'form' },
    { id: '3', title: 'Legal & Contracts', description: 'Sign the service agreement.', completed: false, type: 'legal' },
    { id: '4', title: 'Payment Setup', description: 'Secure your billing method.', completed: false, type: 'payment' },
    { id: '5', title: 'Asset Upload', description: 'Logos, images, and brand kit.', completed: false, type: 'upload' },
    { id: '6', title: 'Account Access', description: 'Connect Facebook & Google Ads.', completed: false, type: 'access' },
  ]);

  const toggleComplete = (id: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const timeline = [
      { day: 'Day 1-3', label: 'Setup', active: true },
      { day: 'Day 4-7', label: 'Ad Prep', active: false },
      { day: 'Day 7-10', label: 'Launch', active: false },
  ];

  return (
    <div className="p-10 h-full overflow-y-auto bg-slate-50/50 font-sans custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Let's Get Started</h1>
            <p className="text-slate-500">Complete these steps to launch your campaigns.</p>
        </div>

        {/* Visual Timeline */}
        <div className="flex justify-center mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded"></div>
            <div className="flex justify-between w-full max-w-lg">
                {timeline.map((t, i) => (
                    <div key={i} className="flex flex-col items-center bg-slate-50 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 ${t.active ? 'bg-indigo-600 border-white text-white shadow-lg' : 'bg-slate-200 border-white text-slate-500'}`}>
                            {i + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-2 uppercase">{t.label}</span>
                        <span className="text-[10px] text-slate-500">{t.day}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {steps.map((step, index) => (
                    <div 
                        key={step.id} 
                        className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${step.completed ? 'border-emerald-200' : 'border-slate-200'}`}
                    >
                        <div className="p-6 flex items-start gap-4">
                            <div className="flex-shrink-0 pt-1">
                                {step.completed ? (
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-500 font-bold">
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold mb-1 ${step.completed ? 'text-emerald-900' : 'text-slate-900'}`}>{step.title}</h3>
                                <p className="text-slate-500 text-sm mb-6">{step.description}</p>

                                {/* Content based on type */}
                                <div className="bg-slate-50 rounded-lg border border-slate-100 p-6">
                                    {step.type === 'video' && (
                                        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white relative group cursor-pointer hover:bg-slate-800 transition-colors">
                                            <Play className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform" />
                                            <span className="absolute bottom-4 left-4 font-bold">Watch Welcome Message (0:45)</span>
                                        </div>
                                    )}

                                    {step.type === 'form' && (
                                        <div className="space-y-4">
                                            <input type="text" placeholder="What is your main offer?" className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <input type="text" placeholder="Who is your target audience?" className="w-full p-3 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                                            <button onClick={() => toggleComplete(step.id)} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800">Save Answers</button>
                                        </div>
                                    )}

                                    {step.type === 'legal' && (
                                        <div className="border border-slate-200 bg-white p-4 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-50 p-2 rounded text-indigo-600"><PenTool className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">Service Agreement.pdf</p>
                                                    <p className="text-xs text-slate-500">Awaiting Signature</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded">Sign Now</button>
                                        </div>
                                    )}

                                    {step.type === 'payment' && (
                                        <div className="border border-slate-200 bg-white p-4 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-emerald-50 p-2 rounded text-emerald-600"><CreditCard className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">Setup Auto-Pay</p>
                                                    <p className="text-xs text-slate-500">Secure Stripe Checkout</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded">Add Card</button>
                                        </div>
                                    )}

                                    {step.type === 'upload' && (
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-600">Click to upload Logo & Brand Guidelines</p>
                                        </div>
                                    )}

                                    {step.type === 'access' && (
                                        <div className="flex flex-col gap-3">
                                            <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                                                <span className="font-bold text-slate-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Facebook Business Manager</span>
                                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Connect</span>
                                            </button>
                                            <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-red-500 transition-colors">
                                                <span className="font-bold text-slate-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Google Ads Account</span>
                                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Connect</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {step.type !== 'form' && (
                                <button 
                                    onClick={() => toggleComplete(step.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${step.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                                >
                                    {step.completed ? 'Completed' : 'Mark Complete'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Client Responsibility Sidebar */}
            <div className="space-y-6">
                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-300" /> What We Expect
                    </h3>
                    <ul className="space-y-3 text-sm text-indigo-100">
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-indigo-400" />
                            <span><strong>Quick Replies:</strong> Please respond to approval requests within 24 hours.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-indigo-400" />
                            <span><strong>Lead Follow-up:</strong> Call leads within 15 mins of notification.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-indigo-400" />
                            <span><strong>Approvals:</strong> Review ad copy and creatives on Thursdays.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-slate-500 mb-4">Stuck on a step? Book a quick onboarding support call.</p>
                    <button className="w-full py-2 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50">Book 15-min Call</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
