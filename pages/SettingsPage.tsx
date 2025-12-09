
import React, { useState } from 'react';
import { Settings, Users, Box, Save, Plus } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Trainers' | 'RACs'>('General');

  // Mock State for settings
  const [rooms, setRooms] = useState([
      { id: 1, name: 'Room A', capacity: 20 },
      { id: 2, name: 'Room B', capacity: 30 },
      { id: 3, name: 'Field Training Area', capacity: 15 },
      { id: 4, name: 'Computer Lab', capacity: 12 },
  ]);

  const [trainers, setTrainers] = useState([
      { id: 1, name: 'John Doe', racs: ['RAC01', 'RAC05'] },
      { id: 2, name: 'Jane Smith', racs: ['RAC02', 'RAC04'] },
      { id: 3, name: 'Mike Brown', racs: ['RAC08', 'RAC10'] },
  ]);

  const handleCapacityChange = (id: number, val: string) => {
      const newCap = parseInt(val) || 0;
      setRooms(rooms.map(r => r.id === id ? { ...r, capacity: newCap } : r));
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
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'General' && (
                    <div className="max-w-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Room Configurations</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
                            Setting capacities here will limit the number of bookings allowed per session in the "Book Training" module.
                        </div>

                        <div className="space-y-4">
                            {rooms.map(room => (
                                <div key={room.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                    <div>
                                        <div className="font-bold text-slate-700">{String(room.name)}</div>
                                        <div className="text-xs text-gray-400">ID: R-{String(room.id)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Max Capacity:</label>
                                        <input 
                                            type="number" 
                                            className="w-20 border border-gray-300 rounded p-1 text-center font-mono"
                                            value={String(room.capacity)}
                                            onChange={(e) => handleCapacityChange(room.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 flex items-center text-blue-600 text-sm font-bold hover:underline">
                            <Plus size={16} className="mr-1" /> Add New Room
                        </button>
                    </div>
                )}

                {activeTab === 'Trainers' && (
                    <div className="max-w-3xl">
                         <h3 className="text-lg font-bold text-slate-800 mb-4">Authorized Trainers</h3>
                         <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualified RACs</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trainers.map(trainer => (
                                        <tr key={trainer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{String(trainer.name)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex gap-1">
                                                    {trainer.racs.map(r => (
                                                        <span key={r} className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">{String(r)}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 hover:underline cursor-pointer">Edit</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                         <button className="mt-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                            <Plus size={16} /> Add Trainer
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
            <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-sm">
                <Save size={18} />
                <span>Save Configuration</span>
            </button>
        </div>
    </div>
  );
};

export default SettingsPage;
