
import React, { useState } from 'react';
import { Plus, Download, DollarSign, Clock, AlertTriangle, Filter, Eye, Printer, Share2, MoreHorizontal, X, FileText, CheckCircle } from 'lucide-react';
import { Invoice, InvoiceStatus, Client } from '../types';

interface InvoicesProps {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  clients: Client[];
  isClient: boolean;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, addInvoice, clients, isClient }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'documents'>('invoices');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'All'>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Create Form State
  const [newClient, setNewClient] = useState(clients[0]?.name || '');
  const [newItems, setNewItems] = useState([{ description: 'Monthly Services', amount: 2500 }]);
  const [newDueDate, setNewDueDate] = useState('');

  const filteredInvoices = invoices.filter(inv => filterStatus === 'All' || inv.status === filterStatus);

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const outstanding = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleCreateInvoice = () => {
    if (!newDueDate) return;
    const total = newItems.reduce((acc, item) => acc + item.amount, 0);
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      clientName: newClient,
      items: newItems,
      totalAmount: total,
      status: 'Draft',
      dateIssued: new Date().toISOString(),
      dueDate: new Date(newDueDate).toISOString(),
      taxRate: 0.1 
    };
    addInvoice(newInvoice);
    setIsCreateModalOpen(false);
    setNewItems([{ description: 'Monthly Services', amount: 2500 }]);
    setNewDueDate('');
  };

  const getStatusStyles = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-100';
      case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50 custom-scrollbar relative">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">{isClient ? 'Billing & Documents' : 'Billing & Invoices'}</h1>
           <p className="text-slate-500 mt-1">Manage payments and legal agreements.</p>
        </div>
        {!isClient && activeTab === 'invoices' && (
            <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-slate-200 mb-8">
         <button 
           onClick={() => setActiveTab('invoices')}
           className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
         >
            Invoices
         </button>
         <button 
           onClick={() => setActiveTab('documents')}
           className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'documents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
         >
            Documents & Contracts
         </button>
      </div>

      {activeTab === 'invoices' ? (
        <>
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5"><DollarSign className="w-24 h-24" /></div>
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Paid to Date</span>
                <div className="text-3xl font-bold text-slate-900 mt-2">${totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5"><Clock className="w-24 h-24" /></div>
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Outstanding</span>
                <div className="text-3xl font-bold text-slate-900 mt-2">${outstanding.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5"><AlertTriangle className="w-24 h-24" /></div>
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Overdue</span>
                <div className="text-3xl font-bold text-slate-900 mt-2">${overdue.toLocaleString()}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
                <div className="flex space-x-2">
                    {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status as InvoiceStatus | 'All')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterStatus === status ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {status}
                    </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Filter className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
                </div>
                </div>

                <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                    <th className="px-6 py-4 font-semibold">Invoice ID</th>
                    {!isClient && <th className="px-6 py-4 font-semibold">Client</th>}
                    <th className="px-6 py-4 font-semibold">Date Issued</th>
                    <th className="px-6 py-4 font-semibold">Due Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">{inv.id}</td>
                        {!isClient && <td className="px-6 py-4"><div className="font-medium text-slate-900">{inv.clientName}</div></td>}
                        <td className="px-6 py-4 text-slate-500">{new Date(inv.dateIssued).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(inv.status)}`}>{inv.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {inv.status !== 'Paid' && <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded">Pay</button>}
                            <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Eye className="w-4 h-4" /></button>
                            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"><Download className="w-4 h-4" /></button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Service Agreements & Contracts</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-600"><FileText className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold text-slate-900">Master Service Agreement (MSA)</p>
                            <p className="text-xs text-slate-500">Signed on Oct 12, 2023</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-4 py-2 hover:bg-indigo-50 rounded-lg">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-600"><FileText className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold text-slate-900">Q4 Scope of Work</p>
                            <p className="text-xs text-slate-500">Signed on Nov 01, 2023</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-4 py-2 hover:bg-indigo-50 rounded-lg">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-slate-800 text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <span className="font-mono text-sm opacity-80">PREVIEW: {selectedInvoice.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded text-slate-900 font-bold bg-white`}>{selectedInvoice.status}</span>
               </div>
               <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-100 p-8">
               <div className="bg-white max-w-2xl mx-auto shadow-lg p-12 flex flex-col min-h-[600px]">
                  <div className="flex justify-between mb-12">
                     <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h2>
                        <p className="text-slate-500 mt-1 font-mono">#{selectedInvoice.id}</p>
                     </div>
                     <div className="text-right">
                        <h3 className="text-xl font-bold text-slate-900">NEXUS</h3>
                        <p className="text-sm text-slate-500">billing@nexus.agency</p>
                     </div>
                  </div>
                  {/* Details omitted for brevity, but included in visual structure */}
                  <div className="border-b border-slate-200 pb-4 mb-4">
                    <div className="flex justify-between text-sm font-bold text-slate-600 uppercase">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>
                  </div>
                  {selectedInvoice.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 text-sm">
                          <span>{item.description}</span>
                          <span className="font-mono">${item.amount.toLocaleString()}</span>
                      </div>
                  ))}
                  <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>

                  {selectedInvoice.status !== 'Paid' && (
                      <div className="mt-8">
                          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors">
                              Pay Now (${selectedInvoice.totalAmount.toLocaleString()})
                          </button>
                      </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal - Slide Over */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-fade-in-left">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Draft Invoice</h2>
                    <button onClick={() => setIsCreateModalOpen(false)}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
                        <select 
                        className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                        value={newClient}
                        onChange={e => setNewClient(e.target.value)}
                        >
                        {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Line Items</label>
                        {newItems.map((item, i) => (
                        <div key={i} className="flex gap-2 mb-3">
                            <input 
                                className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => {
                                    const updated = [...newItems];
                                    updated[i].description = e.target.value;
                                    setNewItems(updated);
                                }}
                            />
                            <div className="relative w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input 
                                    className="w-full pl-6 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                                    placeholder="0.00"
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => {
                                        const updated = [...newItems];
                                        updated[i].amount = parseFloat(e.target.value) || 0;
                                        setNewItems(updated);
                                    }}
                                />
                            </div>
                        </div>
                        ))}
                        <button onClick={() => setNewItems([...newItems, {description: '', amount: 0}])} className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 mt-2"><Plus className="w-3 h-3" /> ADD ITEM</button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                        <input type="date" className="w-full px-3 py-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-sm">Discard</button>
                    <button onClick={handleCreateInvoice} className="flex-1 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm shadow-md">Generate Invoice</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
