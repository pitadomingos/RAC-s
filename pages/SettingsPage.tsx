import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus, Trash2, Tag, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { RAC_KEYS } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

// Interfaces
interface Room { id: string; name: string; capacity: number; }
interface Trainer { id: string; name: string; racs: string[]; }
interface RacDef { id: string; code: string; name: string; }

const SettingsPage: React.FC = () => {
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


  // --- RACS STATE & CRUD ---
  const [racs, setRacs] = useState<RacDef[]>(
      RAC_KEYS.map((k, i) => ({ id: String(i), code: k, name: `Description for ${k}` }))
  );
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
      setRacs([...racs, rac]);
      setNewRac({ code: '', name: '' });
  };

  const startEditRac = (rac: RacDef) => {
      setEditingRacId(rac.id);
      setEditRacData(rac);
  };

  const saveRac = () => {
      if (editingRacId && editRacData.code) {
          setRacs(racs.map(r => r.id === editingRacId ? { ...r, ...editRacData } as RacDef : r));
          setEditingRacId(null);
      }
  };

  const deleteRac = (id: string) => {
      if (confirm('Delete this RAC Definition?')) {
          setRacs(racs.filter(r => r.id !== id));
      }
  };
  
  const handleGlobalSave = () => {
      setIsSaving(true);
      // Simulate API delay and logging
      logger.audit('System Configuration Updated', 'Current Admin User', {
          roomsCount: rooms.length,
          trainersCount: trainers.length,
          racsCount: racs.length
      });
      
      setTimeout(() => {
          setIsSaving(false);
          alert('Configuration saved successfully to production database.');
      }, 800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings size={24} className="text-slate-400" />
                System Configuration
            </h2>
            <p className="text-sm text-gray-500">Manage Room Capacities, Trainers, and Global Settings.</p>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
                <button 
                    onClick={() => setActiveTab('General')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'General' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <Box size={16} className="inline mr-2" />
                    General & Rooms
                </button>
                <button 
                    onClick={() => setActiveTab('Trainers')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Trainers' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <Users size={16} className="inline mr-2" />
                    Trainers
                </button>
                 <button 
                    onClick={() => setActiveTab('RACs')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'RACs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <Tag size={16} className="inline mr-2" />
                    RAC Definitions
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'General' && (
                    <div className="max-w-3xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Room Configurations</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800 flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5" />
                            <span>Setting capacities here will limit the number of bookings allowed per session in the "Book Training" module.</span>
                        </div>

                        {/* Rooms Table */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Name</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacity</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rooms.map(room => (
                                        <tr key={String(room.id)}>
                                            <td className="px-6 py-4">
                                                {editingRoomId === room.id ? (
                                                    <input 
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                        value={String(editRoomData.name)}
                                                        onChange={(e) => setEditRoomData({...editRoomData, name: e.target.value})}
                                                    />
                                                ) : (
                                                    <div className="font-bold text-slate-700">{String(room.name)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {editingRoomId === room.id ? (
                                                    <input 
                                                        type="number"
                                                        className="border rounded px-2 py-1 text-sm w-20 text-center"
                                                        value={String(editRoomData.capacity)}
                                                        onChange={(e) => setEditRoomData({...editRoomData, capacity: parseInt(e.target.value) || 0})}
                                                    />
                                                ) : (
                                                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{String(room.capacity)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingRoomId === room.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={saveRoom} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                                                        <button onClick={() => setEditingRoomId(null)} className="text-gray-400 hover:bg-gray-50 p-1 rounded"><X size={18} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => startEditRoom(room)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                                                        <button onClick={() => deleteRoom(room.id)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Create Room Form */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">New Room Name</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="e.g. Training Lab 4"
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 uppercase">Capacity</label>
                                <input 
                                    type="number"
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="20"
                                    value={newRoom.capacity || ''}
                                    onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                                />
                            </div>
                            <button 
                                onClick={handleAddRoom}
                                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 h-[38px] w-[38px] flex items-center justify-center"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Trainers' && (
                    <div className="max-w-4xl">
                         <h3 className="text-lg font-bold text-slate-800 mb-4">Authorized Trainers</h3>
                         
                         {/* Trainers Table */}
                         <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualified RACs</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trainers.map(trainer => (
                                        <tr key={String(trainer.id)}>
                                            <td className="px-6 py-4">
                                                {editingTrainerId === trainer.id ? (
                                                    <input 
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                        value={String(editTrainerData.name)}
                                                        onChange={(e) => setEditTrainerData({...editTrainerData, name: e.target.value})}
                                                    />
                                                ) : (
                                                    <div className="text-sm font-bold text-slate-700">{String(trainer.name)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingTrainerId === trainer.id ? (
                                                    <input 
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                        placeholder="RAC01, RAC02 (comma separated)"
                                                        value={String(editTrainerData.racs)}
                                                        onChange={(e) => setEditTrainerData({...editTrainerData, racs: e.target.value})}
                                                    />
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {trainer.racs.map(r => (
                                                            <span key={String(r)} className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">{String(r)}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingTrainerId === trainer.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={saveTrainer} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                                                        <button onClick={() => setEditingTrainerId(null)} className="text-gray-400 hover:bg-gray-50 p-1 rounded"><X size={18} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => startEditTrainer(trainer)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                                                        <button onClick={() => deleteTrainer(trainer.id)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>

                         {/* Create Trainer Form */}
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
                            <div className="w-1/3">
                                <label className="text-xs font-bold text-gray-500 uppercase">New Trainer Name</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="Full Name"
                                    value={newTrainer.name}
                                    onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Qualified RACs</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="e.g. RAC01, RAC02"
                                    value={newTrainer.racs}
                                    onChange={(e) => setNewTrainer({...newTrainer, racs: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleAddTrainer}
                                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 h-[38px] w-[38px] flex items-center justify-center"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'RACs' && (
                    <div className="max-w-4xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">RAC Definitions</h3>
                        
                        {/* RACs Table */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {racs.map(rac => (
                                        <tr key={String(rac.id)}>
                                            <td className="px-6 py-4">
                                                 {editingRacId === rac.id ? (
                                                    <input 
                                                        className="border rounded px-2 py-1 text-sm w-full font-mono"
                                                        value={String(editRacData.code)}
                                                        onChange={(e) => setEditRacData({...editRacData, code: e.target.value})}
                                                    />
                                                ) : (
                                                    <span className="font-mono font-bold text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{String(rac.code)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingRacId === rac.id ? (
                                                    <input 
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                        value={String(editRacData.name)}
                                                        onChange={(e) => setEditRacData({...editRacData, name: e.target.value})}
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-600">{String(rac.name)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingRacId === rac.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={saveRac} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                                                        <button onClick={() => setEditingRacId(null)} className="text-gray-400 hover:bg-gray-50 p-1 rounded"><X size={18} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => startEditRac(rac)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                                                        <button onClick={() => deleteRac(rac.id)} className="text-red-400 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>

                        {/* Create RAC Form */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 uppercase">RAC Code</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="RAC11" 
                                    value={newRac.code}
                                    onChange={(e) => setNewRac({...newRac, code: e.target.value})}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <input 
                                    className="w-full border rounded p-2 text-sm mt-1" 
                                    placeholder="Hazard Description" 
                                    value={newRac.name}
                                    onChange={(e) => setNewRac({...newRac, name: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleAddRac}
                                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 h-[38px] w-[38px] flex items-center justify-center"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
            <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className={`flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all
                  ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-green-700'}
                `}
            >
                {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
                <span>{isSaving ? 'Saving...' : 'Save All Configurations'}</span>
            </button>
        </div>
    </div>
  );
};

export default SettingsPage;