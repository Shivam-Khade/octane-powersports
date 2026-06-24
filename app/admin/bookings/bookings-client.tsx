"use client";

import { useState } from "react";
import { Trash2, Phone, Calendar as CalendarIcon, Wrench } from "lucide-react";

export default function BookingsClient({ initialBookings, deleteAction, bulkDeleteAction }: any) {
  const [bookings, setBookings] = useState(initialBookings);
  const [bookingToDelete, setBookingToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(bookings.map((b: any) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    setIsDeleting(true);
    try {
      if (bookingToDelete === "bulk") {
        await bulkDeleteAction(selectedIds);
        setBookings(bookings.filter((b: any) => !selectedIds.includes(b.id)));
        setSelectedIds([]);
      } else {
        await deleteAction(bookingToDelete.id);
        setBookings(bookings.filter((b: any) => b.id !== bookingToDelete.id));
        setSelectedIds(selectedIds.filter(id => id !== bookingToDelete.id));
      }
    } catch (err) {
      alert("Failed to delete booking.");
    } finally {
      setIsDeleting(false);
      setBookingToDelete(null);
    }
  };

  const isUpcoming = (dateStr: string) => {
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return bookingDate >= today;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        {selectedIds.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-14 bg-red-50 border-b border-red-100 flex items-center justify-between px-6 z-10 animate-in fade-in slide-in-from-top-4">
            <span className="text-sm font-semibold text-red-900">{selectedIds.length} booking(s) selected</span>
            <div className="flex gap-2">
               <button 
                onClick={() => setSelectedIds([])}
                className="text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Clear Selection
              </button>
              <button 
                onClick={() => setBookingToDelete("bulk")}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors border border-red-200"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
        <div className={`overflow-x-auto transition-all ${selectedIds.length > 0 ? 'mt-14' : ''}`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={bookings.length > 0 && selectedIds.length === bookings.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#ff6b00] focus:ring-[#ff6b00] cursor-pointer"
                  />
                </th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Date & Time</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Phone</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No service bookings found.</td>
                </tr>
              ) : bookings.map((booking: any) => {
                const upcoming = isUpcoming(booking.booking_date);
                const isSelected = selectedIds.includes(booking.id);
                return (
                  <tr key={booking.id} className={`hover:bg-gray-50 transition-colors ${!upcoming ? 'opacity-60 bg-gray-50/50' : ''} ${isSelected ? 'bg-red-50/30 hover:bg-red-50/50' : ''}`}>
                    <td className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectRow(booking.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#ff6b00] focus:ring-[#ff6b00] cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} className={upcoming ? "text-[#ff6b00]" : "text-gray-400"} />
                          <span className="font-bold text-[#0a0a0a]">
                            {new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        {booking.time_slot && (
                          <div className="text-sm text-gray-500 ml-6">
                            {booking.time_slot}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#0a0a0a]">{booking.name}</td>
                    <td className="p-4">
                      <a href={`tel:${booking.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                        <Phone size={14} /> {booking.phone}
                      </a>
                    </td>
                    <td className="p-4">
                      {upcoming ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Upcoming</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Past</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setBookingToDelete(booking)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5 border border-red-100">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-2 tracking-tight">
                {bookingToDelete === "bulk" ? "Delete Selected Bookings" : "Delete Booking"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {bookingToDelete === "bulk" ? (
                  <>Are you sure you want to delete <strong>{selectedIds.length}</strong> selected bookings? This action cannot be undone.</>
                ) : (
                  <>Are you sure you want to delete the service booking for <strong className="text-[#0a0a0a] font-semibold">{bookingToDelete.name}</strong>? This action cannot be undone and will permanently remove it from the system.</>
                )}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                disabled={isDeleting}
                onClick={() => setBookingToDelete(null)}
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  bookingToDelete === "bulk" ? `Delete ${selectedIds.length} Bookings` : 'Delete Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
