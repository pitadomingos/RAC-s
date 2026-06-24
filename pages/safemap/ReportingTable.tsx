import React, { useState, useMemo } from 'react';
import { UnsafeCondition, User, Company } from '../../types';
import { Search, Filter, Download, Eye, MapPin, LayoutDashboard, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import ConditionWorkflowModal from './ConditionWorkflowModal';
import { useNavigate } from 'react-router-dom';

interface Props {
  conditions: UnsafeCondition[];
  onConditionUpdated: () => void;
  users: User[];
  companies: Company[];
}

export default function ReportingTable({ conditions, onConditionUpdated, users }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<UnsafeCondition | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredConditions = conditions.filter(c => {
    const matchesSearch = c.functionLocation.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.conditionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? c.state === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (state: string) => {
    switch(state) {
      case 'Criado': return 'bg-slate-100 text-slate-700';
      case 'Em Correção': return 'bg-blue-100 text-blue-700';
      case 'Submetido ao Gerente': return 'bg-indigo-100 text-indigo-700';
      case 'Análise SSMA': return 'bg-purple-100 text-purple-700';
      case 'Resolvido': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Reporting Table</h1>
          <p className="text-slate-500 mt-2">Filter and manage unsafe condition reports.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/safemap/analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-bold transition-all"
          >
            <LayoutDashboard size={18} />
            SafeSite Dashboard
          </button>
          <button 
            onClick={() => navigate('/safemap/global')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl font-bold transition-all"
          >
            <MapPin size={18} />
            Global Map
          </button>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by location, type, description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-64 relative">
          <Filter className="absolute left-3 top-3 text-slate-400" size={18} />
          <select 
            title="Filter by status"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Criado">Criado</option>
            <option value="Em Correção">Em Correção</option>
            <option value="Submetido ao Gerente">Submetido ao Gerente</option>
            <option value="Análise SSMA">Análise SSMA</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="w-10"></th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">ID</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Date</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Location</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Type</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Area</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Status</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConditions.map(condition => (
                <React.Fragment key={condition.id}>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                    <td className="p-4 text-center">
                        <button 
                            onClick={() => toggleRow(condition.id)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Expand Details"
                            aria-label="Expand Details"
                        >
                            {expandedRow === condition.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{condition.id}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{new Date(condition.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-bold text-slate-700 dark:text-slate-300">{condition.functionLocation}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{condition.conditionType}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{condition.responsibleArea}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(condition.state)}`}>
                        {condition.state}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        title="View Details"
                        aria-label="View Details"
                        onClick={() => setSelectedCondition(condition)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === condition.id && (
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
                        <td colSpan={8} className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{condition.description}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Plano de Ação</h4>
                                    {condition.actionPlan ? (
                                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            {condition.actionPlan}
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-slate-400 dark:text-slate-500">Nenhum plano de ação registrado.</p>
                                    )}
                                </div>
                            </div>
                        </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredConditions.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold">No conditions found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCondition && (
        <ConditionWorkflowModal
          condition={selectedCondition}
          onClose={() => setSelectedCondition(null)}
          onUpdate={() => {
            onConditionUpdated();
            setSelectedCondition(null);
          }}
          users={users}
        />
      )}
    </div>
  );
}
