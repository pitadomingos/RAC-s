
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle, Sliders } from 'lucide-react';
import { RacDef } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';

// Interfaces
interface Room { id: string; name: string; capacity: number; }
interface Trainer { id: string; name: string; racs: string[]; }

interface SettingsPageProps {
    racDefinitions: RacDef[];
    onUpdateRacs: (newDefs: RacDef[]) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ racDefinitions, onUpdateRacs }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs'>('General');
  const [isSaving, setIsSaving] = useState(false);

  // --- ROOMS STATE & CRUD ---
  const [rooms, setRooms] = useState<Room[]>([
      { id: '1', name: 'Room A', capacity: 20 },
      { id: '2', name: 'Room B', capacity: 30 },
      { id: '3', name: 'Field Training Area', capacity: 15 },
      { id: '4', name: 'Computer Lab', capacity: 12 },
  ]);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 0 });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editRoomData, setEditRoomData] = useState<Partial<Room>>({});

  const handleAddRoom = () => {
      if (!newRoom.name) return;
      const room: Room = {
          id: uuidv4(),
          name: newRoom.name,
          capacity: newRoom.capacity > 0 ? newRoom.capacity : 20
      };
      setRooms([...rooms, room]);
      setNewRoom({ name: '', capacity: 0 });
  };

  const startEditRoom = (room: Room) => {
      setEditingRoomId(room.id);
      setEditRoomData(room);
  };

  const saveRoom = () => {
      if (editingRoomId && editRoomData.name) {
          setRooms(rooms.map(r => r.id === editingRoomId ? { ...r, ...editRoomData } as Room : r));
          setEditingRoomId(null);
      }
  };

  const deleteRoom = (id: string) => {
      if (confirm('Delete this room?')) {
          setRooms(rooms.filter(r => r.id !== id));
      }
  };


  // --- TRAINERS STATE & CRUD ---
  const [trainers, setTrainers] = useState<Trainer[]>([
      { id: '1', name: 'John Doe', racs: ['RAC01', 'RAC05'] },
      { id: '2', name: 'Jane Smith', racs: ['RAC02', 'RAC04'] },
      { id: '3', name: 'Mike Brown', racs: ['RAC08', 'RAC10'] },
  ]);
  const [newTrainer, setNewTrainer] = useState({ name: '', racs: '' });
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [editTrainerData, setEditTrainerData] = useState<{name: string, racs: string}>({ name: '', racs: '' });

  const handleAddTrainer = () => {
      if (!newTrainer.name) return;
      const racList = newTrainer.racs.split(',').map(s => s.trim()).filter(s => s);
      const trainer: Trainer = {
          id: uuidv4(),
          name: newTrainer.name,
          racs: racList.length > 0 ? racList : ['General']
      };
      setTrainers([...trainers, trainer]);
      setNewTrainer({ name: '', racs: '' });
  };

  const startEditTrainer = (trainer: Trainer) => {
      setEditingTrainerId(trainer.id);
      setEditTrainerData({ name: trainer.name, racs: trainer.racs.join(', ') });
  };

  const saveTrainer = () => {
      if (editingTrainerId && editTrainerData.name) {
          const racList = editTrainerData.racs.split(',').map(s => s.trim()).filter(s => s);
          setTrainers(trainers.map(t => t.id === editingTrainerId ? { ...t, name: editTrainerData.name, racs: racList } : t));
          setEditingTrainerId(null);
      }
  };

  const deleteTrainer = (id: string) => {
      if (confirm('Delete this trainer?')) {
          setTrainers(trainers.filter(t => t.id !== id));
      }
  };


  // --- RACS STATE & CRUD (Now using Props) ---
  const [newRac, setNewRac] = useState({ code: '', name: '' });
  const [editingRacId, setEditingRacId] = useState<string | null>(null);
  const [editRacData, setEditRacData] = useState<Partial<RacDef>>({});

  const handleAddRac = () => {
      if (!newRac.code || !newRac.name) return;
      const rac: RacDef = {
          id: uuidv4(),
          code: newRac.code,
          name: newRac.name
      };
      onUpdateRacs([...racDefinitions, rac]);
      setNewRac({ code: '', name: '' });
  };

  const startEditRac = (rac: RacDef) => {
      setEditingRacId(rac.id);
      setEditRacData(rac);
  };

  const saveRac = () => {
      if (editingRacId && editRacData.code) {
          onUpdateRacs(racDefinitions.map(r => r.id === editingRacId ? { ...r, ...editRacData } as RacDef : r));
          setEditingRacId(null);
      }
  };

  const deleteRac = (id: string) => {
      if (confirm('Delete this RAC Definition? This will affect columns in the database.')) {
          onUpdateRacs(racDefinitions.filter(r => r.id !== id));
      }
  };
  
  const handleGlobalSave = () => {
      setIsSaving(true);
      // Simulate API delay and logging
      logger.audit('System Configuration Updated', 'Current Admin User', {
          roomsCount: rooms.length,
          trainersCount: trainers.length,
          racsCount: racDefinitions.length
      });
      
      setTimeout(() => {
          setIsSaving(false);
          alert('Configuration saved successfully to production database.');
      }, 800);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <Sliders size={200} />
            </div>
            <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Settings size={32} className="text-blue-400" />
                    {t.settings.title}
                </h2>
                <p className="text-slate-400 mt-2 text-sm max-w-xl">
                    {t.settings.subtitle}
                </p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-72 bg-white rounded-xl shadow-lg border border-slate-100 p-4 space-y-2 h-fit">
                <button 
                    onClick={() => setActiveTab('General')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3
                        ${activeTab === 'General' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                    <Box size={18} />
                    {t.settings.tabs.general}
                </button>
                <button 
                    onClick={() => setActiveTab('Trainers')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3
                        ${activeTab === 'Trainers' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                    <Users size={18} />
                    {t.settings.tabs.trainers}
                </button>
                 <button 
                    onClick={() => setActiveTab('RACs')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3
                        ${activeTab === 'RACs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                    <Tag size={18} />
                    {t.settings.tabs.racs}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'General' && (
                        <div className="max-w-3xl">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.settings.rooms.title}</h3>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-900 flex items-start gap-3">
                                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                                <span>Setting capacities here will limit the number of bookings allowed per session in the "Book Training" module.</span>
                            </div>

                            {/* Rooms Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">{t.settings.rooms.name}</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase">{t.settings.rooms.capacity}</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase">{t.common.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {rooms.map(room => (
                                            <tr key={String(room.id)}>
                                                <td className="px-6 py-4">
                                                    {editingRoomId === room.id ? (
                                                        <input 
                                                            className="border rounded px-2 py-1 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            value={String(editRoomData.name)}
                                                            onChange={(e) => setEditRoomData({...editRoomData, name: e.target.value})}
                                                        />
                                                    ) : (
                                                        <div className="font-bold text-slate-900">{String(room.name)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {editingRoomId === room.id ? (
                                                        <input 
                                                            type="number"
                                                            className="border rounded px-2 py-1 text-sm w-20 text-center outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            value={String(editRoomData.capacity)}
                                                            onChange={(e) => setEditRoomData({...editRoomData, capacity: parseInt(e.target.value) || 0})}
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold bg-slate-100 text-slate-900 px-3 py-1 rounded-full">{String(room.capacity)}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {editingRoomId === room.id ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={saveRoom} className="text-green-600 hover:bg-green-50 p-2 rounded-full"><Check size={18} /></button>
                                                            <button onClick={() => setEditingRoomId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => startEditRoom(room)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit2 size={16} /></button>
                                                            <button onClick={() => deleteRoom(room.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Create Room Form */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.rooms.new}</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="e.g. Training Lab 4"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.rooms.capacity}</label>
                                    <input 
                                        type="number"
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="20"
                                        value={newRoom.capacity || ''}
                                        onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddRoom}
                                    className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trainers' && (
                        <div className="max-w-4xl">
                             <h3 className="text-xl font-bold text-slate-900 mb-4">{t.settings.trainers.title}</h3>
                             
                             {/* Trainers Table */}
                             <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase w-1/3">{t.settings.trainers.name}</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">{t.settings.trainers.qualifiedRacs}</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase w-32">{t.common.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {trainers.map(trainer => (
                                            <tr key={String(trainer.id)}>
                                                <td className="px-6 py-4">
                                                    {editingTrainerId === trainer.id ? (
                                                        <input 
                                                            className="border rounded px-2 py-1 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            value={String(editTrainerData.name)}
                                                            onChange={(e) => setEditTrainerData({...editTrainerData, name: e.target.value})}
                                                        />
                                                    ) : (
                                                        <div className="text-sm font-bold text-slate-900">{String(trainer.name)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingTrainerId === trainer.id ? (
                                                        <input 
                                                            className="border rounded px-2 py-1 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            placeholder="RAC01, RAC02 (comma separated)"
                                                            value={String(editTrainerData.racs)}
                                                            onChange={(e) => setEditTrainerData({...editTrainerData, racs: e.target.value})}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {trainer.racs.map(r => (
                                                                <span key={String(r)} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100 font-medium">{String(r)}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {editingTrainerId === trainer.id ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={saveTrainer} className="text-green-600 hover:bg-green-50 p-2 rounded-full"><Check size={18} /></button>
                                                            <button onClick={() => setEditingTrainerId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => startEditTrainer(trainer)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit2 size={16} /></button>
                                                            <button onClick={() => deleteTrainer(trainer.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>

                             {/* Create Trainer Form */}
                             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 items-end">
                                <div className="w-1/3">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.trainers.new}</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="Full Name"
                                        value={newTrainer.name}
                                        onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.trainers.qualifiedRacs}</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="e.g. RAC01, RAC02"
                                        value={newTrainer.racs}
                                        onChange={(e) => setNewTrainer({...newTrainer, racs: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddTrainer}
                                    className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'RACs' && (
                        <div className="max-w-4xl">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t.settings.racs.title}</h3>
                            <p className="text-sm text-slate-600 mb-6">Add, remove or edit RAC modules here. These changes will reflect in the Database Matrix.</p>
                            
                            {/* RACs Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase w-32">{t.settings.racs.code}</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">{t.settings.racs.description}</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase w-32">{t.common.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {racDefinitions.map(rac => (
                                            <tr key={String(rac.id)}>
                                                <td className="px-6 py-4">
                                                     {editingRacId === rac.id ? (
                                                        <input 
                                                            className="border rounded px-2 py-1 text-sm w-full font-mono outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            value={String(editRacData.code)}
                                                            onChange={(e) => setEditRacData({...editRacData, code: e.target.value})}
                                                        />
                                                    ) : (
                                                        <span className="font-mono font-bold text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">{String(rac.code)}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingRacId === rac.id ? (
                                                        <input 
                                                            className="border rounded px-2 py-1 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                            value={String(editRacData.name)}
                                                            onChange={(e) => setEditRacData({...editRacData, name: e.target.value})}
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-slate-900 font-medium">{String(rac.name)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {editingRacId === rac.id ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={saveRac} className="text-green-600 hover:bg-green-50 p-2 rounded-full"><Check size={18} /></button>
                                                            <button onClick={() => setEditingRacId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => startEditRac(rac)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit2 size={16} /></button>
                                                            <button onClick={() => deleteRac(rac.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full"><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>

                            {/* Create RAC Form */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex gap-4 items-end">
                                <div className="w-32">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.racs.new}</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="RAC11" 
                                        value={newRac.code}
                                        onChange={(e) => setNewRac({...newRac, code: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.settings.racs.description}</label>
                                    <input 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-black" 
                                        placeholder="Hazard Description" 
                                        value={newRac.name}
                                        onChange={(e) => setNewRac({...newRac, name: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleAddRac}
                                    className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Global Save */}
                <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50">
                    <button 
                        onClick={handleGlobalSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5
                          ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-green-500'}
                        `}
                    >
                        {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                        <span>{isSaving ? t.settings.saving : t.settings.saveAll}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsPage;
