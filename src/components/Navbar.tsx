import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, MapPin, Shield, LogOut, User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0B0F19]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#161F33] lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <span className="font-extrabold text-white text-base">US</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base group-hover:text-emerald-400 transition-colors">
                  UrbanScientist AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Telangana
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                Telangana Urban Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Persistent Global Location Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161F33]/80 border border-[#222F4C] shadow-inner">
          <MapPin className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-gray-200">
            📍 Telangana, India
          </span>
          <span className="text-[10px] text-gray-500 font-mono">|</span>
          <span className="text-[11px] text-emerald-400/90 font-medium">
            33 Districts Monitored
          </span>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Telangana cities, districts, zones... (Ctrl+K)"
              className="w-72 bg-[#111726] border border-[#222F4C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#161F33] relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0B0F19]"></span>
            </button>
          </div>

          {/* User profile with role pill or Sign In */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#1E293B]">
            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-gray-200 truncate max-w-[150px]">
                    {user.fullName}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Logout"
                  className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-[#161F33] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
