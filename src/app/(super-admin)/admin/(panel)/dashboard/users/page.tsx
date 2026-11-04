'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiSearch, 
  FiRefreshCw, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiShield, 
  FiUserCheck, 
  FiX, 
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';
import type { UserDTO } from "@/types/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  // Fetch All Registered Users from Database API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users'); // Ya '/api/users'
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // Fallback Mock Data for UI Testing
        const mockUsers = [
          {
            _id: "USR-1001",
            name: "Dileshwar Lahre",
            email: "dileshwar@stonenox.com",
            phone: "+91 98271 23456",
            role: "Super Admin",
            createdAt: "2025-12-10T10:30:00.000Z",
            totalRequests: 8,
            status: "Active"
          },
          {
            _id: "USR-1002",
            name: "Amit Lahre",
            email: "amit.lahre@cginfrax.com",
            phone: "+91 91112 33445",
            role: "User",
            createdAt: "2026-01-15T14:20:00.000Z",
            totalRequests: 4,
            status: "Active"
          },
          {
            _id: "USR-1003",
            name: "Aditya Lahre",
            email: "aditya.lahre@gmail.com",
            phone: "+91 94252 88990",
            role: "User",
            createdAt: "2026-02-01T09:15:00.000Z",
            totalRequests: 2,
            status: "Active"
          },
          {
            _id: "USR-1004",
            name: "Rahul Sharma",
            email: "rahul.sharma@gmail.com",
            phone: "+91 99887 66554",
            role: "User",
            createdAt: "2026-03-12T11:45:00.000Z",
            totalRequests: 1,
            status: "Active"
          },
          {
            _id: "USR-1005",
            name: "Priya Sahu",
            email: "priya.sahu@outlook.com",
            phone: "+91 98765 43210",
            role: "User",
            createdAt: "2026-04-05T16:00:00.000Z",
            totalRequests: 3,
            status: "Active"
          }
        ];
        setUsers(mockUsers);
      }
    } catch (err) {
      console.error("Error fetching users list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Users by Search Input
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.includes(q) ||
        user._id?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans select-none pb-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-sm">
              <FiUsers size={20} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Registered Users Directory
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Manage all registered client accounts, Gmail logins, and phone records.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={fetchUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-slate-950 hover:bg-blue-600 text-white text-xs font-extrabold px-4 py-3 rounded-2xl transition-all cursor-pointer active:scale-95 shadow-md w-fit"
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
          <span>Sync Users ({users.length})</span>
        </button>
      </div>

      {/* 2. Live Search & Stats Console */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Box */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by Name, Gmail, Phone, or User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={15} />
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Total Accounts: <strong className="text-slate-950">{users.length}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Users Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Gmail / Email</th>
                <th className="p-4">Phone Contact</th>
                <th className="p-4">Account Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 pr-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 font-bold">
                    Fetching user records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-bold">
                    No registered user matching "{searchQuery}" found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs shrink-0 border border-blue-100">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{user.name || "Anonymous User"}</div>
                          <div className="font-mono text-[10px] text-slate-400">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <FiMail className="text-blue-600 shrink-0" size={13} />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-slate-700">
                        <FiPhone className="text-slate-400 shrink-0" size={13} />
                        <span>{user.phone || "Not Provided"}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                        user.role === 'Super Admin' || user.role === 'Admin'
                          ? 'bg-slate-950 text-white'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {user.role === 'Super Admin' && <FiShield size={11} className="text-amber-400" />}
                        <span>{user.role || 'User'}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "N/A"
                      }
                    </td>

                    {/* Action Button */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-950 hover:text-white text-slate-700 text-[11px] font-extrabold transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        View Profile
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. USER PROFILE INSPECTION MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center text-sm shadow-md">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950">{selectedUser.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedUser._id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 text-slate-400 hover:text-black rounded-full bg-slate-50"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* User Identity Details */}
              <div className="space-y-3 text-xs">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Email / Gmail</span>
                    <span className="font-extrabold text-slate-900">{selectedUser.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Phone Contact</span>
                    <span className="font-mono font-bold text-slate-900">{selectedUser.phone || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Account Role</span>
                    <span className="font-extrabold text-blue-600">{selectedUser.role || "User"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Submitted Requests</span>
                    <span className="font-extrabold text-slate-950 bg-slate-200/80 px-2 py-0.5 rounded-md">
                      {selectedUser.totalRequests || 0} Requests
                    </span>
                  </div>
                </div>

              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Close Profile
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}