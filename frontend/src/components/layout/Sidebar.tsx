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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, APP_TAGLINE } from '../../constants';

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
        { name: 'My Journeys', path: '/trips', icon: Compass, count: tripsCount },
      ],
    },
    {
      title: 'DISCOVERY',
      items: [
        { name: 'Explore Cities', path: '/explore/cities', icon: MapPin },
        { name: 'Things To Do', path: '/explore/activities', icon: Sparkles },
      ],
    },
    {
      title: 'PLANNING',
      items: [
        { name: 'Plan New Trip', path: '/trips/create', icon: PlusCircle, highlight: true },
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-950 text-white transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px] w-[260px]'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
          <RouterNavLink
            to="/dashboard"
            className="flex items-center gap-3 group overflow-hidden"
            onClick={onClose}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-ocean-500 text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <Globe2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {APP_NAME}
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-brand-400 font-bold">
                  MODERN EXPEDITION
                </span>
              </div>
            )}
          </RouterNavLink>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsed expand button on desktop */}
        {isCollapsed && onToggleCollapse && (
          <div className="hidden lg:flex justify-center py-2 border-b border-slate-800">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
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

                return (
                  <RouterNavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                    className={`relative flex items-center ${
                      isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      item.highlight
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/30 hover:shadow-lg hover:from-brand-500 hover:to-brand-400 font-bold'
                        : isActive
                        ? 'bg-slate-900 text-brand-400 font-bold border-l-2 border-brand-400 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          item.highlight
                            ? 'text-white'
                            : isActive
                            ? 'text-brand-400'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isCollapsed && item.count !== undefined && item.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
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
        <div className="p-3 border-t border-slate-800/80">
          {!isCollapsed ? (
            <>
              <RouterNavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 mb-2 transition-colors group cursor-pointer"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                    {user?.name || 'Alex Rivera'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.travelStyle || 'Cultural & Adventure'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </RouterNavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
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
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
              </RouterNavLink>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl"
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
