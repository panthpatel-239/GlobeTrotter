import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  User,
  LogOut,
  ChevronDown,
  Compass,
  CheckCheck,
  Plane,
  AlertTriangle,
  DollarSign,
  Ticket,
  Bookmark,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { CommandPalette } from '../common/CommandPalette';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Global listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const loadNotifs = async () => {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    };
    loadNotifs();
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllNotificationsRead = async () => {
    const updated = await notificationService.markAllRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications =
    selectedCategory === 'all'
      ? notifications
      : notifications.filter((n) => n.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel':
        return <Plane className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" />;
      case 'budget':
        return <DollarSign className="w-3.5 h-3.5 text-[#34C759] dark:text-[#30D158]" />;
      case 'planning':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A]" />;
      default:
        return <Ticket className="w-3.5 h-3.5 text-[#5AC8FA] dark:text-[#64D2FF]" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/[0.08] dark:border-white/[0.10] bg-white/80 dark:bg-[#1C1C1E]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl transition-colors">
        {/* Left side: Hamburger button + Command Bar Trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onOpenSidebar}
            className="rounded-lg p-1.5 text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] lg:hidden cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clickable Command Palette trigger bar */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.03] dark:bg-white/[0.05] px-3 py-1.5 text-xs text-[#8E8E93] dark:text-[#98989D] hover:border-[#007AFF] dark:hover:border-[#0A84FF] hover:bg-white dark:hover:bg-[#1C1C1E] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#8E8E93] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              <span className="truncate">Search destinations, activities, trips, bookings...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#8E8E93] dark:text-[#98989D] bg-white dark:bg-[#2C2C2E] rounded border border-black/[0.08] dark:border-white/[0.10]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: Theme Selector, Plan CTA, Notifications, Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Apple-style Segmented Theme Selector Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1 p-1.5 rounded-lg text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer text-xs font-medium"
              title="Change appearance theme"
              aria-label="Theme selector"
            >
              {theme === 'system' ? (
                <Laptop className="w-4 h-4" />
              ) : resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <ChevronDown className="w-3 h-3 text-[#8E8E93]" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#2C2C2E] p-1 shadow-lg border border-black/[0.08] dark:border-white/[0.10] z-50 text-xs">
                {(
                  [
                    { mode: 'light', label: 'Light', icon: Sun },
                    { mode: 'dark', label: 'Dark', icon: Moon },
                    { mode: 'system', label: 'System', icon: Laptop },
                  ] as const
                ).map((t) => {
                  const Icon = t.icon;
                  const isSelected = theme === t.mode;
                  return (
                    <button
                      key={t.mode}
                      onClick={() => {
                        setTheme(t.mode);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#007AFF] text-white dark:bg-[#0A84FF] font-semibold'
                          : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate('/trips/create')}
            className="hidden sm:inline-flex bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white font-medium shadow-xs"
          >
            Plan Trip
          </Button>

          {/* Notifications Popover */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-1.5 text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1C1E]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1C1C1E] p-4 shadow-xl border border-black/[0.08] dark:border-white/[0.10] z-50">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] uppercase tracking-wider">
                      Trip Alerts & Updates
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[11px] text-[#007AFF] dark:text-[#0A84FF] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notification Category Filter Tabs */}
                <div className="flex items-center gap-1 py-2 border-b border-black/[0.06] dark:border-white/[0.08] overflow-x-auto text-[11px]">
                  {['all', 'travel', 'planning', 'budget', 'system'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-0.8 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
                          : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 space-y-1.5 max-h-80 overflow-y-auto">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.link) {
                            navigate(notif.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                          notif.unread
                            ? 'bg-blue-500/5 dark:bg-blue-500/10 border-[#007AFF]/20 text-[#1D1D1F] dark:text-[#F5F5F7]'
                            : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] text-[#6E6E73] dark:text-[#98989D]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {getCategoryIcon(notif.category)}
                            <span>{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-[#8E8E93] flex-shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-[#8E8E93]">
                      No notifications in this category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 rounded-lg p-1 text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt={user?.name || 'User'}
                className="h-7 w-7 rounded-full object-cover border border-black/[0.08] dark:border-white/[0.10]"
              />
              <span className="hidden md:inline-block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {user?.name?.split(' ')[0] || 'Alex'}
              </span>
              <ChevronDown className="hidden md:inline-block h-3 w-3 text-[#8E8E93]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1C1C1E] py-1.5 shadow-xl border border-black/[0.08] dark:border-white/[0.10] z-50">
                <div className="px-3.5 py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <p className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                    {user?.name || 'Alex Rivera'}
                  </p>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] truncate">
                    {user?.email || 'alex@globetrotter.io'}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#8E8E93]" />
                  <span>Profile & Preferences</span>
                </Link>
                <Link
                  to="/trips"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-[#8E8E93]" />
                  <span>My Journeys</span>
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#8E8E93]" />
                  <span>Saved & Wishlists</span>
                </Link>
                <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#FF3B30] dark:text-[#FF453A] hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};
