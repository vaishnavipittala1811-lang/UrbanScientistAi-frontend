import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Car,
  CloudFog,
  Droplets,
  CloudSun,
  Users,
  Activity,
  Workflow,
  Sparkles,
  SlidersHorizontal,
  Target,
  Calculator,
  FileText,
  Database,
  UserCog,
  Settings,
  UserCheck,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'City Intelligence', path: '/cities', icon: Building2 },
    { name: 'Traffic', path: '/traffic', icon: Car },
    { name: 'Pollution', path: '/pollution', icon: CloudFog },
    { name: 'Water', path: '/water', icon: Droplets },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'Population', path: '/population', icon: Users },
    { name: 'Healthcare', path: '/healthcare', icon: Activity },
    { name: 'Infrastructure', path: '/infrastructure', icon: Workflow },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles },
    { name: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal },
    { name: 'Intervention Planner', path: '/interventions', icon: Target },
    { name: 'Budget Optimizer', path: '/budget-optimizer', icon: Calculator },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Data Sources', path: '/data-sources', icon: Database },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#1E293B] bg-[#070A11]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wide text-white uppercase">
              UrbanScientist AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-emerald-400 font-black text-xs tracking-wider">
              TELANGANA
            </span>
            <span className="text-[10px] text-gray-500 font-mono">|</span>
            <span className="text-[10px] text-gray-400 font-medium">
              State Twin
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white lg:hidden rounded"
          >
            ✕
          </button>
        )}
      </div>

      {/* Region Status Pill */}
      <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-[#111726] border border-[#1E293B] flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <div className="text-[11px] leading-tight">
          <p className="font-semibold text-gray-200">Telangana, India</p>
          <p className="text-[10px] text-gray-500">Autonomous Regional System</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Intelligence Modules
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#161F33]/70'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-4 space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider flex items-center justify-between">
              <span>Admin Control</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                AUTH
              </span>
            </div>
            <NavLink
              to="/admin/users"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#161F33]/70'
                }`
              }
            >
              <UserCog className="w-4 h-4 shrink-0" />
              <span>User Management</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Bottom Profile / Quick Info */}
      <div className="p-3 border-t border-[#1E293B] bg-[#070A11]/60">
        <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-gray-300">{user?.role || 'VIEWER'}</span>
          </div>
          <NavLink to="/reports" className="hover:text-emerald-400 transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
