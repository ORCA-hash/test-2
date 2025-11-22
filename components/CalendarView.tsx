
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { Task, TaskStatus, Priority } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  addTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, addTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddEvent = () => {
    if (!newEventTitle) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newEventTitle,
      description: 'Calendar Event',
      status: TaskStatus.TODO,
      assignee: 'Me',
      priority: Priority.MEDIUM,
      dueDate: new Date(newEventDate).toISOString(),
      clientName: 'General',
      comments: []
    };
    addTask(newTask);
    setIsModalOpen(false);
    setNewEventTitle('');
  };

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const d = new Date(task.dueDate);
      return d.getDate() === day && 
             d.getMonth() === currentDate.getMonth() && 
             d.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="p-8 h-full flex flex-col bg-slate-50/50 font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Production Calendar</h1>
           <p className="text-slate-500 text-sm mt-1">Manage deadlines and campaign launches.</p>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm">
               <Plus className="w-4 h-4" /> Add Event
            </button>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 border-r border-slate-200 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
              <div className="px-6 py-2 font-bold text-slate-800 min-w-[160px] text-center text-sm">
                  {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 border-l border-slate-200 text-slate-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-200 gap-px border-b border-slate-200">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="bg-slate-50/50" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTasks = getTasksForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
            return (
              <div key={day} className="bg-white p-2 min-h-[120px] flex flex-col hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700'}`}>{day}</span>
                </div>
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                  {dayTasks.map(task => (
                    <div key={task.id} className="text-[10px] px-2 py-1 rounded truncate font-medium bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500">
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Array.from({ length: (42 - (daysInMonth + firstDayOfMonth)) % 7 }).map((_, i) => <div key={`end-${i}`} className="bg-slate-50/50" />)}
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-900 mb-4">New Event</h2>
              <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Event Title" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newEventTitle}
                    onChange={e => setNewEventTitle(e.target.value)}
                 />
                 <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                 />
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleAddEvent} className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Add to Calendar</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
