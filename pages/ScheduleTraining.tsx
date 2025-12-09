import React, { useState } from 'react';
import { TrainingSession } from '../types';
import { RAC_KEYS } from '../constants';
import { Calendar, Plus, Settings, X, Save } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t.schedule.title}</h2>
          <p className="text-sm text-gray-500">{t.schedule.subtitle}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-2 bg-gray-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
            >
                <Settings size={18} />
                <span>{t.nav.settings}</span>
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition"
            >
                <Plus size={18} />
                <span>{t.schedule.newSession}</span>
            </button>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.schedule.table.date}</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.schedule.table.rac}</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.schedule.table.room}</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t.schedule.table.trainer}</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                      <tr key={String(session.id)} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span className="font-medium">{String(session.date)}</span>
                                  <span className="text-gray-400 ml-2 text-xs">{String(session.startTime)}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">
                              {String(session.racType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {String(session.location)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {String(session.instructor)}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-bold text-slate-800">{t.schedule.modal.title}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.racType}</label>
                        <select 
                            className="w-full border rounded p-2 text-sm"
                            value={String(newSession.racType)}
                            onChange={e => setNewSession({...newSession, racType: e.target.value})}
                        >
                            {RAC_KEYS.map(k => <option key={String(k)} value={`${k} - General`}>{String(k)}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.date}</label>
                            <input 
                                type="date" 
                                className="w-full border rounded p-2 text-sm"
                                value={String(newSession.date)}
                                onChange={e => setNewSession({...newSession, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.startTime}</label>
                            <input 
                                type="time" 
                                className="w-full border rounded p-2 text-sm"
                                value={String(newSession.startTime)}
                                onChange={e => setNewSession({...newSession, startTime: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.location}</label>
                            <input 
                                type="text" 
                                className="w-full border rounded p-2 text-sm"
                                value={String(newSession.location)}
                                onChange={e => setNewSession({...newSession, location: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.capacity}</label>
                            <input 
                                type="number" 
                                className="w-full border rounded p-2 text-sm"
                                value={String(newSession.capacity)}
                                onChange={e => setNewSession({...newSession, capacity: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.schedule.modal.instructor}</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 text-sm"
                            value={String(newSession.instructor)}
                            onChange={e => setNewSession({...newSession, instructor: e.target.value})}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        {t.common.cancel}
                    </button>
                    <button 
                        onClick={handleAddSession}
                        className="px-4 py-2 text-sm bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium flex items-center gap-2"
                    >
                        <Save size={16} /> {t.schedule.modal.saveSession}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTraining;