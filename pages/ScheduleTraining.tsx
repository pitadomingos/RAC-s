
import React from 'react';
import { MOCK_SESSIONS } from '../constants';
import { Calendar, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScheduleTraining: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Training Schedule</h2>
          <p className="text-sm text-gray-500">Upcoming sessions.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-2 bg-gray-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
            >
                <Settings size={18} />
                <span>Settings</span>
            </button>
            <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
                <Plus size={18} />
                <span>New Session</span>
            </button>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">RAC</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trainer</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {MOCK_SESSIONS.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span className="font-medium">{session.date}</span>
                                  <span className="text-gray-400 ml-2 text-xs">{session.startTime}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">
                              {session.racType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {session.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {session.instructor}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default ScheduleTraining;
