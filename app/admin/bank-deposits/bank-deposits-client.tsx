"use client";

import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, AlertCircle, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

const formatIST = (dateStr: string | Date) => {
  if (!dateStr) return 'N/A';
  let safeStr = typeof dateStr === 'string' ? dateStr : new Date(dateStr).toISOString();
  if (typeof safeStr === 'string') {
    if (!safeStr.includes('T')) safeStr = safeStr.replace(' ', 'T');
    if (!safeStr.endsWith('Z') && !safeStr.includes('+') && !safeStr.match(/-\d{2}:\d{2}$/)) {
      safeStr += 'Z';
    }
  }
  return new Intl.DateTimeFormat('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Kolkata' 
  }).format(new Date(safeStr));
};

type Deposit = {
  id: number;
  order_id: number;
  receipt_url: string;
  deposited_amount: number;
  deposit_date: string;
  reference_number: string | null;
  customer_notes: string | null;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_remarks: string | null;
  uploaded_at: string;
  total_amount: number;
  order_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

export default function BankDepositsClient({ 
  initialDeposits,
  handleAction
}: { 
  initialDeposits: Deposit[],
  handleAction: (id: number, action: 'APPROVE' | 'REJECT', remarks: string) => Promise<void>
}) {
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [remarks, setRemarks] = useState("");

  const filteredDeposits = deposits.filter(dep => {
    const matchesSearch = 
      dep.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      dep.order_id.toString().includes(search) ||
      (dep.reference_number && dep.reference_number.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStatus = statusFilter === "ALL" || dep.verification_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const onApprove = async () => {
    if (!selectedDeposit) return;
    setIsProcessing(true);
    try {
      await handleAction(selectedDeposit.id, 'APPROVE', remarks);
      toast.success("Deposit Approved & Order Pending!");
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, verification_status: 'APPROVED', admin_remarks: remarks } : d));
      setSelectedDeposit(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve deposit");
    } finally {
      setIsProcessing(false);
    }
  };

  const onReject = async () => {
    if (!selectedDeposit) return;
    if (!remarks.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setIsProcessing(true);
    try {
      await handleAction(selectedDeposit.id, 'REJECT', remarks);
      toast.success("Deposit Rejected");
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, verification_status: 'REJECTED', admin_remarks: remarks } : d));
      setSelectedDeposit(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject deposit");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">APPROVED</span>;
    if (status === 'REJECTED') return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">REJECTED</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">PENDING</span>;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, order ID, ref..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#ff6b00] text-sm"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#ff6b00]"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Deposit Info</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Date Uploaded</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No bank deposits found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold">#{dep.order_id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{dep.customer_name}</p>
                      <p className="text-gray-500 text-xs">{dep.customer_email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold">₹{dep.deposited_amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">Order Total: ₹{dep.total_amount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="p-4">{getStatusBadge(dep.verification_status)}</td>
                    <td className="p-4 text-gray-600">
                      {formatIST(dep.uploaded_at)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => { setSelectedDeposit(dep); setRemarks(""); }}
                        className="p-2 text-[#ff6b00] hover:bg-[#ff6b00]/10 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col md:flex-row">
            
            {/* Receipt Viewer */}
            <div className="md:w-1/2 bg-gray-100 border-r border-gray-200 p-4 flex flex-col items-center justify-center min-h-[300px]">
              {selectedDeposit.receipt_url.endsWith('.pdf') ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <FileText size={48} className="text-gray-400 mb-4" />
                  <a href={selectedDeposit.receipt_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-bold shadow-sm hover:bg-gray-50">
                    Open PDF in New Tab
                  </a>
                </div>
              ) : (
                <div className="relative w-full h-[500px]">
                  <Image 
                    src={selectedDeposit.receipt_url} 
                    alt="Receipt" 
                    fill 
                    className="object-contain" 
                  />
                  <a href={selectedDeposit.receipt_url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 px-3 py-1 bg-white/80 backdrop-blur border border-gray-200 rounded text-xs font-bold shadow-sm hover:bg-white">
                    View Full
                  </a>
                </div>
              )}
            </div>
            
            {/* Details & Actions */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-black">Order #{selectedDeposit.order_id}</h2>
                  <p className="text-gray-500 text-sm">Uploaded {formatIST(selectedDeposit.uploaded_at)}</p>
                </div>
                <button onClick={() => setSelectedDeposit(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4 flex-grow text-sm">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Deposited Amount:</span>
                    <span className="font-bold text-lg text-[#ff6b00]">₹{selectedDeposit.deposited_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-bold">₹{selectedDeposit.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedDeposit.deposited_amount !== selectedDeposit.total_amount && (
                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> Amount mismatch!
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Deposit Date</span>
                    <span className="font-semibold">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(selectedDeposit.deposit_date))}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Ref Number</span>
                    <span className="font-semibold">{selectedDeposit.reference_number || 'N/A'}</span>
                  </div>
                </div>
                
                <div>
                  <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Customer Notes</span>
                  <div className="p-3 bg-gray-50 rounded border border-gray-100 text-gray-700 italic">
                    {selectedDeposit.customer_notes || 'No notes provided.'}
                  </div>
                </div>

                <div>
                  <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Customer Info</span>
                  <div className="text-gray-700">
                    <p><strong>{selectedDeposit.customer_name}</strong></p>
                    <p>{selectedDeposit.customer_email}</p>
                    <p>{selectedDeposit.customer_phone}</p>
                  </div>
                </div>
              </div>
              
              {selectedDeposit.verification_status === 'PENDING' ? (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Admin Remarks (Optional for Approve, Required for Reject)</label>
                  <textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter reason if rejecting, or any internal note..."
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#ff6b00] mb-4 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={onReject}
                      disabled={isProcessing}
                      className="flex-1 py-3 px-4 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Reject"}
                    </button>
                    <button 
                      onClick={onApprove}
                      disabled={isProcessing}
                      className="flex-1 py-3 px-4 bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#ff6b00]/20"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Approve & Process"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className={`p-4 rounded-lg ${selectedDeposit.verification_status === 'APPROVED' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    <p className="font-bold flex items-center gap-2 mb-2">
                      {selectedDeposit.verification_status === 'APPROVED' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      Already {selectedDeposit.verification_status}
                    </p>
                    {selectedDeposit.admin_remarks && (
                      <p className="text-sm">Remarks: {selectedDeposit.admin_remarks}</p>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
