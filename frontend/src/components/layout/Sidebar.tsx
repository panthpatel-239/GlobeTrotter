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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] transition-all duration-200 ease-in-out lg:translate-x-0 border-r border-black/[0.08] dark:border-white/[0.10] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px] w-[240px]'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <RouterNavLink
            to="/dashboard"
            className="flex items-center gap-2.5 group overflow-hidden"
            onClick={onClose}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <Globe2 className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] block">
                  {APP_NAME}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#007AFF] dark:text-[#0A84FF] font-semibold">
                  Travel Platform
                </span>
              </div>
            )}
          </RouterNavLink>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed expand button on desktop */}
        {isCollapsed && onToggleCollapse && (
          <div className="hidden lg:flex justify-center py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
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
                      isCollapsed ? 'justify-center px-0' : 'justify-between px-2.5'
                    } py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                      item.highlight
                        ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-xs hover:bg-[#0062CC] font-semibold'
                        : isActive
                        ? 'bg-black/[0.06] dark:bg-white/[0.12] text-[#007AFF] dark:text-[#0A84FF] font-semibold'
                        : 'text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          item.highlight
                            ? 'text-white'
                            : isActive
                            ? 'text-[#007AFF] dark:text-[#0A84FF]'
                            : 'text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#1D1D1F] dark:group-hover:text-[#F5F5F7]'
                        }`}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isCollapsed && item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-black/[0.06] dark:bg-white/[0.12] text-[#6E6E73] dark:text-[#98989D] text-[10px] font-semibold">
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
        <div className="p-2.5 border-t border-black/[0.06] dark:border-white/[0.08]">
          {!isCollapsed ? (
            <>
              <RouterNavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] mb-1.5 transition-colors group cursor-pointer"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-black/[0.08] dark:border-white/[0.10]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
                    {user?.name || 'Alex Rivera'}
                  </p>
                  <p className="text-[10px] text-[#8E8E93] dark:text-[#98989D] truncate">
                    {user?.travelStyle || 'Cultural & Adventure'}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-[#1D1D1F] dark:group-hover:text-[#F5F5F7]" />
              </RouterNavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#8E8E93] dark:text-[#98989D] hover:text-[#FF3B30] dark:hover:text-[#FF453A] hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
                  className="w-7 h-7 rounded-full object-cover border border-black/[0.08] dark:border-white/[0.10]"
                />
              </RouterNavLink>
              <button
                onClick={handleLogout}
                className="p-1.5 text-[#8E8E93] hover:text-[#FF3B30] dark:hover:text-[#FF453A] rounded-lg"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
