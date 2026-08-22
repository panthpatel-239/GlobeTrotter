import React from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Sparkles,
  User,
  PlusCircle,
  LogOut,
  Globe2,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  Bookmark,
  DollarSign,
  Ticket,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tripsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  count?: number;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tripsCount,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const navigate = useRouterNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'PLAN',
      items: [
        { name: 'My Journeys', path: '/trips', icon: Compass, count: tripsCount },
        { name: 'Travel Calendar', path: '/calendar', icon: Calendar },
        { name: 'Plan New Trip', path: '/trips/create', icon: PlusCircle, highlight: true },
      ],
    },
    {
      title: 'DISCOVER',
      items: [
        { name: 'Destinations', path: '/explore/cities', icon: MapPin },
        { name: 'Things To Do', path: '/explore/activities', icon: Sparkles },
        { name: 'Saved & Wishlists', path: '/saved', icon: Bookmark },
      ],
    },
    {
      title: 'MANAGE',
      items: [
        { name: 'Budget & Costs', path: '/budget', icon: DollarSign },
        { name: 'Reservations', path: '/reservations', icon: Ticket },
        { name: 'Document Wallet', path: '/documents', icon: ShieldCheck },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Profile & Settings', path: '/profile', icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-100 transition-all duration-200 ease-in-out lg:translate-x-0 border-r border-slate-800 shadow-xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px] w-[260px]'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <RouterNavLink
            to="/dashboard"
            className="flex items-center gap-3 group overflow-hidden"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <Globe2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-white block">
                  {APP_NAME}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-blue-400 font-bold">
                  Travel Platform
                </span>
              </div>
            )}
          </RouterNavLink>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed expand button on desktop */}
        {isCollapsed && onToggleCollapse && (
          <div className="hidden lg:flex justify-center py-2.5 border-b border-slate-800 bg-slate-950/30">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    location.pathname.startsWith(item.path) &&
                    item.path !== '/trips/create');

                if (item.highlight) {
                  return (
                    <RouterNavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      title={isCollapsed ? item.name : undefined}
                      className={`relative flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                      } py-2 rounded-xl text-xs font-semibold transition-all group bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-md hover:shadow-blue-500/30 mt-1.5`}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                        <Icon className="w-4 h-4 text-white flex-shrink-0" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">
                          New
                        </span>
                      )}
                    </RouterNavLink>
                  );
                }

                return (
                  <RouterNavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                    className={`relative flex items-center ${
                      isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200 transition-colors'
                        }`}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isCollapsed && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </RouterNavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          {!isCollapsed ? (
            <>
              <RouterNavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 mb-2 transition-colors group cursor-pointer"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {user?.name || 'Alex Rivera'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.travelStyle || 'Cultural & Adventure'}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </RouterNavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <RouterNavLink to="/profile" title="Profile">
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-slate-600"
                />
              </RouterNavLink>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
