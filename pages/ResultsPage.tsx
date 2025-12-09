import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Booking, BookingStatus, UserRole, TrainingSession } from '../types';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, addYears } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultsPageProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  importBookings?: (newBookings: Booking[]) => void;
  userRole: UserRole;
  sessions: TrainingSession[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ bookings, updateBookingStatus, importBookings, userRole, sessions }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [filter, setFilter] = useState(initialQuery);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  // Update filter if URL param changes
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
        setFilter(query);
    }
  }, [searchParams]);

  // Handle Download Template
  const handleDownloadTemplate = () => {
    const headers = [
      'Full Name', 'Record ID', 'Company', 'Department', 'Role',
      'RAC Code (e.g. RAC01)', 'Date (YYYY-MM-DD)', 'Status (Passed/Failed)', 
      'Theory Score', 'Practical Score', 'DL Number', 'DL Class', 'DL Expiry (YYYY-MM-DD)'
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vulcan_records_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      // Skip Header
      const dataRows = lines.slice(1);
      const newBookings: Booking[] = [];

      dataRows.forEach(line => {
        const cols = line.split(',');
        if (cols.length < 8) return; // Basic validation

        // Map CSV columns to Booking Object
        const [
            name, recordId, company, dept, role,
            racCode, date, statusRaw, theory, practical, dlNum, dlClass, dlExp
        ] = cols.map(c => c?.trim());

        if (!name || !recordId || !racCode) return;

        const status = statusRaw?.toLowerCase() === 'passed' ? BookingStatus.PASSED : BookingStatus.FAILED;
        let expiryDate = '';
        
        if (status === BookingStatus.PASSED && date) {
             // Basic 2 year expiry calc
             try {
                const d = new Date(date);
                expiryDate = format(addYears(d, 2), 'yyyy-MM-dd');
             } catch(e) {}
        }

        const newBooking: Booking = {
            id: uuidv4(),
            sessionId: `${racCode} - Historical Import`,
            status: status,
            resultDate: date,
            expiryDate: expiryDate,
            theoryScore: parseInt(theory) || 0,
            practicalScore: parseInt(practical) || 0,
            attendance: true,
            employee: {
                id: uuidv4(),
                name,
                recordId,
                company: company || 'Unknown',
                department: dept || 'Operations',
                role: role || 'Staff',
                driverLicenseNumber: dlNum,
                driverLicenseClass: dlClass,
                driverLicenseExpiry: dlExp
            }
        };
        newBookings.push(newBooking);
      });

      if (newBookings.length > 0 && importBookings) {
          importBookings(newBookings);
          alert(`Successfully imported ${newBookings.length} records.`);
      } else {
          alert("No valid records found in file.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };
  
  const filteredBookings = bookings.filter(b => 
    String(b.employee.name).toLowerCase().includes(filter.toLowerCase()) ||
    String(b.employee.recordId).includes(filter)
  );

  const getRacDetails = (sessionId: string) => {
      if (sessionId.includes('RAC02') || sessionId.includes('RAC 02')) return { isRac02: true };
      const session = sessions.find(s => s.id === sessionId);
      if (session && (session.racType.includes('RAC02') || session.racType.includes('RAC 02'))) {
          return { isRac02: true };
      }
      return { isRac02: false };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">{t.results.title}</h2>
           <p className="text-sm text-gray-500">{t.results.subtitle}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
             {/* Import Controls */}
             {userRole === UserRole.SYSTEM_ADMIN && (
               <div className="flex gap-2">
                 <button 
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1 bg-gray-100 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-200"
                    title="Download CSV Template"
                 >
                    <FileSpreadsheet size={16} />
                    <span className="hidden sm:inline">{t.common.template}</span>
                 </button>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100"
                 >
                    <Upload size={16} />
                    <span className="hidden sm:inline">{t.common.import}</span>
                 </button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".csv"
                    onChange={handleFileUpload}
                 />
               </div>
             )}

             <div className="w-64">
                <input 
                    type="text" 
                    placeholder={t.results.searchPlaceholder} 
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.results.table.employee}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.results.table.session}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.results.table.dlRac02}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">{t.results.table.theory}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">{t.results.table.prac}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">{t.results.table.status}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.results.table.expiry}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">{t.dashboard.booked.noData}</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const { isRac02 } = getRacDetails(booking.sessionId);
                const dlExpiry = booking.employee.driverLicenseExpiry || '';
                const isDlExpired = dlExpiry && new Date(dlExpiry) < new Date();
                
                // Safe string casting to prevent errors
                const dlNum = String(booking.employee.driverLicenseNumber || '');
                const dlClass = String(booking.employee.driverLicenseClass || '-');
                const dlExpStr = String(dlExpiry || '-');

                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{String(booking.employee.name)}</div>
                      <div className="text-xs text-gray-500">{String(booking.employee.recordId)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-600">{String(booking.sessionId)}</span>
                    </td>
                    {/* Driver License Column - Only shows data for RAC 02 */}
                    <td className="px-4 py-4 whitespace-nowrap">
                        {isRac02 ? (
                            <div className="flex flex-col text-xs">
                                <div>
                                    <span className="font-bold text-gray-500">{t.database.number}:</span> 
                                    {booking.employee.driverLicenseNumber ? String(booking.employee.driverLicenseNumber) : <span className="text-red-400 italic">Missing</span>}
                                </div>
                                <div><span className="font-bold text-gray-500">{t.database.class}:</span> {dlClass}</div>
                                <div className={`${isDlExpired ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                    <span className="font-bold text-gray-500">{t.database.expired}:</span> {dlExpStr}
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400 italic">N/A</span>
                        )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {booking.theoryScore !== undefined ? String(booking.theoryScore) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {booking.practicalScore !== undefined && booking.practicalScore > 0 ? String(booking.practicalScore) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === BookingStatus.PASSED ? 'bg-green-100 text-green-800' : 
                          booking.status === BookingStatus.FAILED ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {String(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(booking.expiryDate || '-')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;