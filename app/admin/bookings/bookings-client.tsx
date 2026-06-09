"use client";

import { useState } from "react";
import { Trash2, Phone, Calendar as CalendarIcon, Wrench } from "lucide-react";

export default function BookingsClient({ initialBookings, deleteAction }: any) {
  const [bookings, setBookings] = useState(initialBookings);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteAction(id);
        setBookings(bookings.filter((b: any) => b.id !== id));
      } catch (err) {
        alert("Failed to delete booking.");
      }
    }
  };

  const isUpcoming = (dateStr: string) => {
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return bookingDate >= today;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Date & Time</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Phone</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Service Type</th>
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
              return (
                <tr key={booking.id} className={`hover:bg-gray-50 transition-colors ${!upcoming ? 'opacity-60 bg-gray-50/50' : ''}`}>
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
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full inline-flex font-medium">
                      <Wrench size={14} /> {booking.service_type}
                    </div>
                  </td>
                  <td className="p-4">
                    {upcoming ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Upcoming</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Past</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(booking.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md">
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
  );
}
