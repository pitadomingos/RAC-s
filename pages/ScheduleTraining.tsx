
import React, { useState } from 'react';
import { TrainingSession, Room, Trainer } from '../types';
import { RAC_KEYS } from '../constants';
import { Calendar, Plus, Settings, X, Save, Clock, MapPin, User, CalendarDays, ChevronLeft, ChevronRight, Globe, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';

interface ScheduleTrainingProps {
    sessions: TrainingSession[];
    setSessions: React.Dispatch<React.SetStateAction<TrainingSession[]>>;
    rooms: Room[];
    trainers: Trainer[];
}

const ScheduleTraining: React.FC<ScheduleTrainingProps> = ({ sessions, setSessions, rooms, trainers }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  
  // New Session State
  const [newSession, setNewSession] = useState<Partial<TrainingSession>>({
      racType: 'RAC01 - Working at Height',
      date: '',
      startTime: '08:00',
      location: '',
      instructor: '',
      capacity: 0,
      sessionLanguage: 'Portuguese'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleAddSession = () => {
      if (!newSession.date || !newSession.racType || !newSession.location) {
          alert("Please fill in Date, RAC Type and Location");
          return;
      }

      const sessionToAdd: TrainingSession = {
          id: uuidv4(),
          racType: newSession.racType || 'RAC',
          date: newSession.date || '',
          startTime: newSession.startTime || '08:00',
          location: newSession.location || 'TBD',
          instructor: newSession.instructor || 'TBD',
          capacity: newSession.capacity || 20,
          sessionLanguage: newSession.sessionLanguage || 'Portuguese'
      };

      setSessions(prev => [...prev, sessionToAdd]);
      setIsModalOpen(false);
      // Reset form slightly but keep useful defaults
      setNewSession(prev => ({ ...prev, date: '', startTime: '08:00' }));
  };

  const handleDeleteSession = (id: string) => {
      if (confirm('Are you sure you want to delete this session? This will cancel the session and remove it from the schedule.')) {
          setSessions(prev => prev.filter(s => s.id !== id));
      }
  };

  // Filter & Sort Logic
  const filteredSessions = sessions.filter(s => 
      s.racType.toLowerCase().includes(filterQuery.toLowerCase()) || 
      s.instructor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pagination Logic
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const paginatedSessions = sortedSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up relative h-full">
       
       {/* --- HERO HEADER --- */}
       <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-slate-700/50">
         <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
            <CalendarDays size={400} />
         </div>
         {/* Ambient Glow */}
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                    <Calendar size={28} className="text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                      {t.schedule.title}
                  </h2>
               </div>
               <p className="text-slate-400 text-sm max-w-xl font-medium ml-1">
                  {t.schedule.subtitle}
               </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-5 py-3 rounded-xl font-bold backdrop-blur-sm border border-white/10 transition-all text-sm group"
                >
                    <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>{t.nav.settings}</span>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-sm"
                >
                    <Plus size={18} />
                    <span>{t.schedule.newSession}</span>
                </button>
            </div>
         </div>
       </div>

       {/* --- CONTENT AREA --- */}
       <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden relative min-h-[600px]">
          
          {/* Control Bar */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-72">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search sessions..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    value={filterQuery}
                    onChange={(e) => { setFilterQuery(e.target.value); setCurrentPage(1); }}
                  />
              </div>
              
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 shadow-sm">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rows</span>
                      <select 
                          value={itemsPerPage}
                          onChange={handlePageSizeChange}
                          className="text-sm font-bold bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer"
                      >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                      </select>
                  </div>
              </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/30 dark:bg-slate-900/10">
              {paginatedSessions.map((session) => (
                  <div key={session.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all group relative overflow-hidden">
                      {/* Left Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

                      <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1 pl-2">
                          {/* Date Block */}
                          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 w-16 h-16 rounded-2xl border border-slate-100 dark:border-slate-600 shrink-0 shadow-inner">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{new Date(session.date).getDate()}</span>
                          </div>
                          
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{session.racType}</h3>
                                  {session.sessionLanguage && (
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${session.sessionLanguage === 'English' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'}`}>
                                          <Globe size={10} />
                                          {session.sessionLanguage === 'English' ? 'ENG' : 'PT'}
                                      </span>
                                  )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-lg"><Clock size={12} className="text-slate-400"/> {session.startTime}</span>
                                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-lg"><MapPin size={12} className="text-slate-400"/> {session.location}</span>
                                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-lg"><User size={12} className="text-slate-400"/> {session.instructor}</span>
                              </div>
                          </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex items-center gap-6 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                          <div className="text-right">
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Capacity</div>
                              <div className="text-xl font-black text-slate-800 dark:text-white flex items-center justify-end gap-1">
                                  {session.capacity} 
                                  <span className="text-xs font-medium text-slate-400 mb-1">seats</span>
                              </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteSession(session.id)}
                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            title="Cancel Session"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  </div>
              ))}
              
              {sortedSessions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                          <Calendar size={40} className="text-slate-300 dark:text-slate-500" />
                      </div>
                      <p className="font-bold text-lg text-slate-500 dark:text-slate-400">No sessions scheduled</p>
                      <p className="text-sm text-slate-400">Click "New Session" to get started.</p>
                  </div>
              )}
          </div>

          {/* Footer Pagination */}
          {sortedSessions.length > 0 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Page {currentPage} of {Math.max(1, totalPages)} • {sortedSessions.length} Total
                      </div>
                      
                      <div className="flex gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-600 dark:text-slate-300"><ChevronLeft size={16} /></button>
                          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-600 dark:text-slate-300"><ChevronRight size={16} /></button>
                      </div>
                  </div>
              </div>
          )}
       </div>

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-xl p-0 overflow-hidden transform transition-all scale-100 border border-slate-200 dark:border-slate-700">
                
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.schedule.modal.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create a new training slot.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.racType}</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all hover:bg-slate-100 dark:hover:bg-slate-600"
                                value={String(newSession.racType)}
                                onChange={e => setNewSession({...newSession, racType: e.target.value})}
                            >
                                {RAC_KEYS.map(k => <option key={String(k)} value={`${k} - General`}>{String(k)}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.date}</label>
                            <input 
                                type="date" 
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white transition-all"
                                value={String(newSession.date)}
                                onChange={e => setNewSession({...newSession, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.startTime}</label>
                            <input 
                                type="time" 
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white transition-all"
                                value={String(newSession.startTime)}
                                onChange={e => setNewSession({...newSession, startTime: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.location}</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white appearance-none"
                                    value={String(newSession.location)}
                                    onChange={e => {
                                        const selectedRoom = rooms.find(r => r.name === e.target.value);
                                        setNewSession({
                                            ...newSession, 
                                            location: e.target.value,
                                            capacity: selectedRoom ? selectedRoom.capacity : 0
                                        });
                                    }}
                                >
                                    <option value="">Select Room</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.name}>{room.name}</option>
                                    ))}
                                </select>
                                <MapPin size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.capacity}</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-xl p-3 text-sm font-bold text-slate-500 dark:text-slate-300 cursor-not-allowed outline-none text-center"
                                    value={String(newSession.capacity)}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.instructor}</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white appearance-none"
                                    value={String(newSession.instructor)}
                                    onChange={e => setNewSession({...newSession, instructor: e.target.value})}
                                >
                                    <option value="">Select Instructor</option>
                                    {trainers.map(trainer => (
                                        <option key={trainer.id} value={trainer.name}>
                                            {trainer.name}
                                        </option>
                                    ))}
                                </select>
                                <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block ml-1">{t.schedule.modal.language}</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white appearance-none"
                                    value={String(newSession.sessionLanguage)}
                                    onChange={e => setNewSession({...newSession, sessionLanguage: e.target.value as any})}
                                >
                                    <option value="Portuguese">{t.schedule.modal.portuguese}</option>
                                    <option value="English">{t.schedule.modal.english}</option>
                                </select>
                                <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                    >
                        {t.common.cancel}
                    </button>
                    <button 
                        onClick={handleAddSession}
                        className="px-8 py-3 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
