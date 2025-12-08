import React, { useRef } from 'react';
import { Booking, BookingStatus } from '../types';
import CardTemplate from '../components/CardTemplate';
import { Printer, AlertCircle } from 'lucide-react';
import ReactToPrint from 'react-to-print';

interface CardsPageProps {
  bookings: Booking[];
}

const CardsPage: React.FC<CardsPageProps> = ({ bookings }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Filter only passed bookings for card generation
  // Use safety check `b &&` to ensure no nulls
  const eligibleBookings = bookings.filter(b => b && b.status === BookingStatus.PASSED);

  // Chunk array into groups of 8 (since 8 fit on an A4 page)
  const chunkArray = (arr: Booking[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const pages = chunkArray(eligibleBookings, 8);

  return (
    <div className="flex flex-col h-full">
      {/* Control Bar (Hidden on print) */}
      <div className="no-print bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Card Generator (CARs)</h2>
          <p className="text-sm text-gray-500">
            {eligibleBookings.length} cards available for printing. Layout optimized for A4 (8 cards/page).
          </p>
        </div>
        
        {eligibleBookings.length > 0 && (
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm">
                <Printer size={18} />
                <span>Print Cards</span>
              </button>
            )}
            content={() => componentRef.current}
            documentTitle="Vulcan_RAC_Cards"
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-200 overflow-auto flex justify-center p-8">
        
        {/* Empty State Message - Visible if no cards */}
        {eligibleBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 max-w-lg">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full">
              <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Cards Available</h3>
              <p>No 'Passed' training records available to generate cards.</p>
              <p className="text-sm mt-4 text-gray-400">
                Only bookings with a status of "Passed" will appear here. 
                Go to Results to update statuses.
              </p>
            </div>
          </div>
        ) : (
          /* Printable Area - Hidden if empty */
          <div ref={componentRef} className="bg-white shadow-lg print:shadow-none w-[210mm] min-h-[297mm] print:w-full">
             {pages.map((pageGroup, pageIndex) => (
                <div key={`page-${pageIndex}`} className={`grid grid-cols-2 grid-rows-4 gap-0 w-full h-[296mm] ${pageIndex > 0 ? 'break-before-page' : ''}`}>
                    {pageGroup.map((booking) => (
                        <div key={booking.id} className="p-1 w-full h-full border border-dashed border-gray-200 print:border-none">
                            <CardTemplate booking={booking} />
                        </div>
                    ))}
                    {/* Fill remaining slots in the grid to maintain layout if needed, though grid handles this gracefully */}
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsPage;