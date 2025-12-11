
import React, { useState } from 'react';
import { TrainingSession } from '../types';
import { RAC_KEYS } from '../constants';
import { Calendar, Plus, Settings, X, Save, Clock, MapPin, User, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';

interface ScheduleTrainingProps {
    sessions: TrainingSession[];
    setSessions: React.Dispatch<React.SetStateAction<TrainingSession[]>>;
}

const ScheduleTraining: React.FC<ScheduleTrainingProps> = ({ sessions, setSessions }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState<Partial<TrainingSession>>({
      racType: 'RAC01 - Working at Height',
      date: '',
      startTime: '08:00',
      location: 'Room A',
      instructor: 'John Doe',
      capacity: 20
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const handleAddSession = () => {
      if (!newSession.date || !newSession.racType) {
          alert("Please fill in Date and RAC Type");
          return;
      }

      const sessionToAdd: TrainingSession = {
          id: uuidv4(),
          racType: newSession.racType || 'RAC',
          date: newSession.date || '',
          startTime: newSession.startTime || '08:00',
          location: newSession.location || 'TBD',
          instructor: newSession.instructor || 'TBD',
          capacity: newSession.capacity || 20
      };

      setSessions(prev => [...prev, sessionToAdd]);
      setIsModalOpen(false);
  };

  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pagination Logic
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const paginatedSessions = sortedSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
       {/* Header */}
       <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <CalendarDays size={200} />
         </div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <Calendar size={32} className="text-blue-500" />
                  {t.schedule.title}
               </h2>
               <p className="text-slate-400 mt-2 text-sm max-w-xl">
                  {t.schedule.subtitle}
               </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold backdrop-blur-sm border border-white/10 transition-all"
                >
                    <Settings size={18} />
                    <span>{t.nav.settings}</span>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    <span>{t.schedule.newSession}</span>
                </button>
            </div>
         </div>
       </div>

       {/* Session List */}
       <div className="grid gap-4">
          {paginatedSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-16 h-16 rounded-xl border border-blue-100">
                          <span className="text-xs font-bold uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black">{new Date(session.date).getDate()}</span>
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{session.racType}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span className="flex items-center gap-1"><Clock size={14}/> {session.startTime}</span>
                              <span className="flex items-center gap-1"><MapPin size={14}/> {session.location}</span>
                              <span className="flex items-center gap-1"><User size={14}/> {session.instructor}</span>
                          </div>
                      </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <div className="text-right">
                          <div className="text-xs text-slate-500 font-bold uppercase">Capacity</div>
                          <div className="text-lg font-bold text-slate-900">{session.capacity}</div>
                      </div>
                      <div className="h-10 w-1 bg-slate-100 rounded-full mx-2 hidden md:block"></div>
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                          <X size={20} />
                      </button>
                  </div>
              </div>
          ))}
          
          {sortedSessions.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No upcoming sessions scheduled.</p>
              </div>
          )}
       </div>

        {/* Footer Pagination */}
        {sortedSessions.length > 0 && (
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Rows per page:</span>
                    <select 
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="text-xs border border-slate-300 rounded bg-white text-slate-800 px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={120}>120</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-600">
                        Page {currentPage} of {Math.max(1, totalPages)} ({sessions.length} total)
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-slate-600"><ChevronLeft size={16} /></button>
                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-slate-600"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        )}

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">{t.schedule.modal.title}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.racType}</label>
                        <select 
                            className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            value={String(newSession.racType)}
                            onChange={e => setNewSession({...newSession, racType: e.target.value})}
                        >
                            {RAC_KEYS.map(k => <option key={String(k)} value={`${k} - General`}>{String(k)}</option>)}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.date}</label>
                            <input 
                                type="date" 
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                value={String(newSession.date)}
                                onChange={e => setNewSession({...newSession, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.startTime}</label>
                            <input 
                                type="time" 
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                value={String(newSession.startTime)}
                                onChange={e => setNewSession({...newSession, startTime: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.location}</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                placeholder="e.g. Room 101"
                                value={String(newSession.location)}
                                onChange={e => setNewSession({...newSession, location: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.capacity}</label>
                            <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                value={String(newSession.capacity)}
                                onChange={e => setNewSession({...newSession, capacity: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t.schedule.modal.instructor}</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="Full Name"
                            value={String(newSession.instructor)}
                            onChange={e => setNewSession({...newSession, instructor: e.target.value})}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                    >
                        {t.common.cancel}
                    </button>
                    <button 
                        onClick={handleAddSession}
                        className="px-8 py-3 text-sm bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                        <Save size={18} /> {t.schedule.modal.saveSession}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTraining;
