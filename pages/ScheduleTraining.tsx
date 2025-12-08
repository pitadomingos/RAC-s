import React from 'react';
import { MOCK_SESSIONS } from '../constants';
import { Calendar, MapPin, User, Clock, Plus } from 'lucide-react';

const ScheduleTraining: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Training Schedule</h2>
          <p className="text-sm text-gray-500">Manage upcoming RAC sessions, locations, and instructors.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
          <Plus size={18} />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SESSIONS.map((session) => (
          <div key={session.id} className="border rounded-xl p-5 hover:shadow-md transition bg-gray-50 border-gray-200">
             <div className="flex justify-between items-start mb-3">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                  {session.racType.split(' - ')[0]}
                </span>
                <span className="text-xs text-gray-500 font-mono">{session.id}</span>
             </div>
             
             <h3 className="font-bold text-slate-800 mb-4">{session.racType.split(' - ')[1]}</h3>
             
             <div className="space-y-2 text-sm text-gray-600">
               <div className="flex items-center gap-2">
                 <Calendar size={16} className="text-gray-400" />
                 <span>{session.date}</span>
               </div>
               <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-gray-400" />
                 <span>{session.location}</span>
               </div>
               <div className="flex items-center gap-2">
                 <User size={16} className="text-gray-400" />
                 <span>{session.instructor}</span>
               </div>
               <div className="flex items-center gap-2">
                 <Clock size={16} className="text-gray-400" />
                 <span>Capacity: {session.capacity}</span>
               </div>
             </div>

             <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
               <button className="flex-1 bg-white border border-gray-300 text-slate-700 py-1 rounded text-sm hover:bg-gray-50">Edit</button>
               <button className="flex-1 bg-white border border-gray-300 text-red-600 py-1 rounded text-sm hover:bg-red-50">Cancel</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTraining;