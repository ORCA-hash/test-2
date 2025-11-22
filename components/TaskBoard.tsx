
import React, { useState } from 'react';
import { Plus, Calendar, MessageSquare, User, Send, MoreHorizontal, Filter, Search, CheckCircle2, Circle, Clock, AlertCircle, X } from 'lucide-react';
import { Task, TaskStatus, Priority, Comment, Client } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  clients: Client[];
  addTask: (task: Task) => void;
  isClient: boolean;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, clients, addTask, isClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskClient, setNewTaskClient] = useState(clients[0]?.name || '');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);
  
  // Comment State
  const [newComment, setNewComment] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const columns = [
    { id: TaskStatus.TODO, label: 'To Do', icon: Circle },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress', icon: Clock },
    { id: TaskStatus.CLIENT_REVIEW, label: 'Review', icon: AlertCircle },
    { id: TaskStatus.DONE, label: 'Done', icon: CheckCircle2 },
  ];

  const handleCreateTask = () => {
    if (!newTaskTitle) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: TaskStatus.TODO,
      priority: newTaskPriority,
      assignee: newTaskAssignee || 'Unassigned',
      clientName: newTaskClient,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      comments: []
    };
    addTask(newTask);
    closeModal();
  };

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: isClient ? 'Client' : 'Agency',
      text: newComment,
      timestamp: new Date().toISOString(),
      isClient: isClient
    };

    const updatedTask = { 
      ...selectedTask, 
      comments: [...selectedTask.comments, comment] 
    };

    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    setNewComment('');
  };

  const openNewTaskModal = () => {
    setSelectedTask(null);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsModalOpen(true);
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setNewTaskTitle(task.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskAssignee('');
    setSelectedTask(null);
  };

  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'bg-red-50 text-red-600 border-red-100';
      case Priority.MEDIUM: return 'bg-amber-50 text-amber-600 border-amber-100';
      case Priority.LOW: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
    t.clientName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-50/50 font-sans relative">
      {/* Header Toolbar */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-slate-900">Projects & Issues</h1>
           <div className="h-6 w-px bg-slate-200"></div>
           <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
             <Search className="w-4 h-4 text-slate-400 mr-2" />
             <input 
               type="text" 
               placeholder="Filter..." 
               value={filterQuery}
               onChange={(e) => setFilterQuery(e.target.value)}
               className="bg-transparent border-none text-sm focus:ring-0 text-slate-700 placeholder-slate-400 w-full outline-none"
             />
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={openNewTaskModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
           >
            <Plus className="w-4 h-4" /> New Issue
           </button>
        </div>
      </div>

      {/* Kanban Area */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex h-full space-x-6 min-w-[1200px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col rounded-xl bg-slate-100/50 border border-slate-200/60">
              {/* Column Header */}
              <div className="p-3 flex justify-between items-center border-b border-slate-200/50 bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <col.icon className={`w-4 h-4 ${col.id === TaskStatus.DONE ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <h3 className="font-semibold text-slate-700 text-sm">{col.label}</h3>
                  <span className="text-xs font-medium text-slate-400 ml-1 px-1.5 py-0.5 bg-slate-200 rounded-full">
                    {filteredTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><Plus className="w-4 h-4" /></button>
              </div>
              
              {/* Cards Container */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                {filteredTasks.filter(t => t.status === col.id).map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => openTaskDetails(task)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all group cursor-pointer relative"
                  >
                    {!isClient && (
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{task.clientName}</span>
                        </div>
                    )}
                    
                    <h4 className="text-sm font-semibold text-slate-800 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getPriorityStyles(task.priority)}`}>
                        {task.priority}
                      </div>
                      <div className="flex items-center gap-2">
                         {task.comments.length > 0 && (
                           <div className="flex items-center text-slate-400 text-xs">
                             <MessageSquare className="w-3 h-3 mr-1" /> {task.comments.length}
                           </div>
                         )}
                         <img 
                           src={`https://ui-avatars.com/api/?name=${task.assignee}&background=e2e8f0&color=64748b`} 
                           className="w-5 h-5 rounded-full" 
                           title={task.assignee} 
                           alt=""
                         />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Slide-Over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-fade-in-left">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-slate-400">{selectedTask ? `ISSUE-${selectedTask.id}` : 'NEW ISSUE'}</span>
                        {selectedTask && <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-200 text-slate-600">{selectedTask.status}</span>}
                    </div>
                    <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {!selectedTask ? (
                        <div className="space-y-8">
                             <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full text-xl font-bold placeholder-slate-300 border-b border-slate-200 focus:border-indigo-500 py-2 outline-none transition-colors"
                                    placeholder="e.g. Update Home Page Banner"
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    autoFocus
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                                <textarea 
                                    className="w-full min-h-[150px] text-slate-600 border border-slate-200 rounded-lg p-3 text-sm leading-relaxed placeholder-slate-300 outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="Add a more detailed description..."
                                    value={newTaskDesc}
                                    onChange={e => setNewTaskDesc(e.target.value)}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                {!isClient && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Client</label>
                                        <select className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500" value={newTaskClient} onChange={e => setNewTaskClient(e.target.value)}>
                                            {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                                    <select className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as Priority)}>
                                        <option value={Priority.LOW}>Low</option>
                                        <option value={Priority.MEDIUM}>Medium</option>
                                        <option value={Priority.HIGH}>High</option>
                                    </select>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">{selectedTask.title}</h2>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed">
                                {selectedTask.description}
                            </div>
                            
                            {/* Comments Section */}
                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Discussion</h3>
                                <div className="space-y-6 mb-6">
                                    {selectedTask.comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${comment.isClient ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {comment.author.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-sm font-bold text-slate-900">{comment.author}</span>
                                                    <span className="text-xs text-slate-400">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 items-start">
                                     <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
                                     <div className="flex-1 relative">
                                        <textarea 
                                            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[80px]"
                                            placeholder="Leave a comment..."
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button onClick={handleAddComment} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Post Comment</button>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions for New Task */}
                {!selectedTask && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleCreateTask} className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-md">Create Issue</button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
