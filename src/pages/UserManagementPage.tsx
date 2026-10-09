import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Role } from '../types';
import { UserCog, MapPin, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const list = await api.getAllUsers();
        setUsers(list);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: Role) => {
    setUpdatingId(userId);
    try {
      const updated = await api.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">RBAC Security Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Urban User Management
        </h1>
        <p className="text-sm text-gray-400">
          Admin portal: manage roles (ADMIN, PLANNER, ANALYST, VIEWER) and access permissions for Telangana officials.
        </p>
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCog className="w-4 h-4 text-emerald-400" />
            Registered Telangana Officials & Users ({users.length})
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            Default Public Role: VIEWER
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-gray-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Current Role</th>
                <th className="py-2.5 px-3">Change Role</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#161F33]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {u.fullName}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-300">
                      {u.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                          : u.role === 'PLANNER'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          : u.role === 'ANALYST'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/25'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                        className="bg-[#161F33] text-gray-200 text-xs rounded-lg px-2.5 py-1 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="PLANNER">PLANNER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
