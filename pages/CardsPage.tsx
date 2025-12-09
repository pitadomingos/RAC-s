import React, { useRef } from 'react';
import { Booking, BookingStatus, EmployeeRequirement } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Printer, AlertCircle } from 'lucide-react';
import ReactToPrint from 'react-to-print';

interface CardsPageProps {
  bookings: Booking[];
  requirements: EmployeeRequirement[];
}

const CardsPage: React.FC<CardsPageProps> = ({ bookings, requirements }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Filter eligible bookings (Passed)
  const eligibleBookings = bookings.filter(b => b && b.status === BookingStatus.PASSED);

  // De-duplicate: 1 card per person
  const uniqueEmployeeBookings: Booking[] = [];
  const seenIds = new Set();
  
  eligibleBookings.forEach(b => {
      if (!seenIds.has(b.employee.id)) {
          uniqueEmployeeBookings.push(b);
          seenIds.add(b.employee.id);
      }
  });

  // Chunk array into groups of 8 (4 cols * 2 rows)
  const chunkArray = (arr: Booking[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const pages = chunkArray(uniqueEmployeeBookings, 8);
  const getRequirement = (empId: string) => requirements.find(r => r.employeeId === empId);

  return (
    <div className="flex flex-col h-full">
      {/* Control Bar */}
      <div className="no-print bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Card Generator (CARs)</h2>
          <p className="text-sm text-gray-500">
            {uniqueEmployeeBookings.length} cards available. Layout: 8 Cards per A4 Landscape Page.
          </p>
        </div>
        
        {uniqueEmployeeBookings.length > 0 && (
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm">
                <Printer size={18} />
                <span>Print Cards</span>
              </button>
            )}
            content={() => componentRef.current}
            documentTitle="Vulcan_RAC_Cards"
            pageStyle="@page { size: A4 landscape; margin: 0; } body { -webkit-print-color-adjust: exact; }"
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-200 overflow-auto flex justify-center p-8">
        {uniqueEmployeeBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 max-w-lg">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full">
              <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Cards Available</h3>
              <p>No 'Passed' training records available to generate cards.</p>
            </div>
          </div>
        ) : (
          /* Printable Container */
          <div ref={componentRef} className="print:w-full print:h-full">
             {pages.map((pageGroup, pageIndex) => (
                <div 
                  key={`page-${pageIndex}`} 
                  className={`
                    bg-white shadow-lg print:shadow-none mx-auto
                    grid grid-cols-4 grid-rows-2
                    w-[297mm] h-[210mm] 
                    justify-items-center items-center
                    gap-4
                    ${pageIndex > 0 ? 'break-before-page' : ''}
                  `}
                  style={{ 
                    padding: '10mm',
                    boxSizing: 'border-box'
                  }}
                >
                    {pageGroup.map((booking) => (
                        <div key={booking.id} className="flex justify-center items-center">
                            <CardTemplate booking={booking} requirement={getRequirement(booking.employee.id)} />
                        </div>
                    ))}
                    {/* Fillers to maintain grid structure if page is not full */}
                    {Array.from({ length: 8 - pageGroup.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-[54mm] h-[86mm]"></div>
                    ))}
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsPage;