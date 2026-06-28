"use client";

import { useState } from "react";
import { Search, MapPin, Mail, Phone, Calendar, User, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
}

export function UsersClient({ users }: { users: UserData[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="relative max-w-md w-full group">
          <div className="relative">
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${searchTerm ? 'text-[#ff6b00]' : 'text-gray-400 group-focus-within:text-[#ff6b00]'}`} 
              size={18} 
            />
            <input 
              type="text" 
              placeholder="Search users by name, email, or phone..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-white text-[#0a0a0a] placeholder-gray-400 border border-gray-200 rounded-xl text-sm font-medium tracking-wide focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] shadow-sm focus:shadow-[0_8px_24px_rgba(255,107,0,0.12)] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">User Details</th>
              <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Contact Info</th>
              <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Primary Address</th>
              <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Role & Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center text-gray-400">No users found matching your search.</td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                {/* User Details */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-[#0a0a0a] text-sm">{user.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="p-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <a href={`mailto:${user.email}`} className="hover:text-[#ff6b00] transition-colors truncate max-w-[200px]" title={user.email}>{user.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span>{user.phone || <span className="text-gray-300 italic">Not provided</span>}</span>
                    </div>
                  </div>
                </td>

                {/* Address */}
                <td className="p-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600 max-w-[250px]">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      {user.address_line ? (
                        <>
                          <p className="line-clamp-2 leading-snug">{user.address_line}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {[user.city, user.postal_code].filter(Boolean).join(', ')}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-300 italic">No address on file</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
                      <ShieldAlert size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                      <ShieldCheck size={12} /> User
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
