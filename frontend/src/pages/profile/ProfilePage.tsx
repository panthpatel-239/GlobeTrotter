import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Compass,
  Globe,
  DollarSign,
  Shield,
  LogOut,
  Save,
  Check,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  Bell,
  Lock,
  Plane,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Settings State
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [bio, setBio] = useState(
    user?.bio || 'Globe trotter, photographer & cultural explorer. 24 countries documented.'
  );
  const [currency, setCurrency] = useState(user?.preferredCurrency || 'USD');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || 'Cultural & Adventure');
  const [budgetLevel, setBudgetLevel] = useState('Moderate');
  const [homeAirport, setHomeAirport] = useState('SFO (San Francisco)');
  const [favoriteRegion, setFavoriteRegion] = useState('East Asia & Southern Europe');
  const [language, setLanguage] = useState('English (US)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateUser({
        name,
        bio,
        preferredCurrency: currency,
        travelStyle,
      });
      success('Settings Saved', 'Your traveler profile and preferences have been updated.');
    } catch (err: any) {
      toastError('Update Failed', err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD ($) - US Dollar' },
    { value: 'EUR', label: 'EUR (€) - Euro' },
    { value: 'GBP', label: 'GBP (£) - British Pound' },
    { value: 'INR', label: 'INR (₹) - Indian Rupee' },
    { value: 'JPY', label: 'JPY (¥) - Japanese Yen' },
  ];

  const travelStyleOptions = [
    { value: 'Cultural & Adventure', label: 'Cultural & Adventure' },
    { value: 'Luxury & Relaxation', label: 'Luxury & Relaxation' },
    { value: 'Budget Backpacker', label: 'Budget Backpacker' },
    { value: 'Foodie & Gastronomy', label: 'Foodie & Gastronomy' },
    { value: 'Solo Explorer', label: 'Solo Explorer' },
  ];

  const budgetOptions = [
    { value: 'Backpacker', label: 'Backpacker ($0 - $75/day)' },
    { value: 'Moderate', label: 'Moderate ($75 - $200/day)' },
    { value: 'Premium', label: 'Premium ($200 - $500/day)' },
    { value: 'Luxury', label: 'Luxury ($500+/day)' },
  ];

  const languageOptions = [
    { value: 'English (US)', label: 'English (US)' },
    { value: 'English (UK)', label: 'English (UK)' },
    { value: 'Spanish', label: 'Español' },
    { value: 'French', label: 'Français' },
    { value: 'Japanese', label: '日本語' },
    { value: 'German', label: 'Deutsch' },
  ];

  const themeOptions: { mode: ThemeMode; label: string; icon: any; desc: string }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: Sun,
      desc: 'Clean paper surface with dark typography',
    },
    {
      mode: 'system',
      label: 'System Preference',
      icon: Laptop,
      desc: 'Automatically synchronizes with your device theme',
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: Moon,
      desc: 'Deep blacks, subtle elevation and sharp contrast',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
          <span>Profile & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-0.5">
          Manage your personal traveler identity, theme, currency, and travel preferences.
        </p>
      </div>

      {/* User Hero Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 sm:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={user?.name || 'User Avatar'}
            className="w-20 h-20 rounded-full object-cover border-2 border-black/[0.08] dark:border-white/[0.10]"
          />
          <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[#34C759] dark:bg-[#30D158] border-2 border-white dark:border-[#1C1C1E] flex items-center justify-center text-white text-[10px]">
            ✓
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {user?.name || 'Alex Rivera'}
            </h2>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] self-center sm:self-auto">
              Pro Explorer
            </span>
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email || 'alex@globetrotter.io'}</span>
          </p>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] pt-0.5 italic">{bio}</p>
        </div>
      </div>

      {/* Theme Switcher Section */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 sm:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-4">
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Appearance Theme</h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Select how GlobeTrotter renders across your devices. Currently active in{' '}
            <strong className="text-[#007AFF] dark:text-[#0A84FF] capitalize">{resolvedTheme} Mode</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <button
                type="button"
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-500/5 dark:bg-blue-500/10 border-[#007AFF] dark:border-[#0A84FF] ring-1 ring-[#007AFF]'
                    : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? 'bg-[#007AFF] text-white dark:bg-[#0A84FF]'
                        : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#6E6E73] dark:text-[#98989D]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{opt.label}</h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#1C1C1E] p-5 sm:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-5"
      >
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Traveler Identity & Preferences
          </h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Configure your personal details, home airport, currency format, and travel style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Display Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-3.5 h-3.5" />}
            required
          />

          <Input
            label="Email Address"
            value={user?.email || 'alex@globetrotter.io'}
            disabled
            leftIcon={<Mail className="w-3.5 h-3.5" />}
            helperText="Authenticated account email"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Preferred Currency"
            options={currencyOptions}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />

          <Select
            label="Travel Style"
            options={travelStyleOptions}
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Budget Preference"
            options={budgetOptions}
            value={budgetLevel}
            onChange={(e) => setBudgetLevel(e.target.value)}
          />

          <Select
            label="Interface Language"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Home Airport"
            value={homeAirport}
            onChange={(e) => setHomeAirport(e.target.value)}
            leftIcon={<Plane className="w-3.5 h-3.5" />}
            placeholder="e.g. SFO (San Francisco)"
          />

          <Input
            label="Favorite Travel Regions"
            value={favoriteRegion}
            onChange={(e) => setFavoriteRegion(e.target.value)}
            leftIcon={<Compass className="w-3.5 h-3.5" />}
            placeholder="e.g. East Asia, Scandinavia"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
            Travel Bio / Notes
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] p-3 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        {/* Notifications & Privacy Toggles */}
        <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
            Notification Preferences
          </h4>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Trip Departure & Milestone Reminders
              </p>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                Receive automated alerts for upcoming flights, check-ins, and scheduled tours.
              </p>
            </div>
            <input
              type="checkbox"
              checked={tripReminders}
              onChange={(e) => setTripReminders(e.target.checked)}
              className="h-4 w-4 rounded text-[#007AFF] focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Budget Threshold Warnings
              </p>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                Get notified when active trip expenses reach 80% of target budget.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded text-[#007AFF] focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.08]">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            isLoading={isSaving}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium text-xs shadow-xs"
          >
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Danger & Logout Zone */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 sm:p-6 rounded-2xl border border-red-500/20 shadow-card space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#FF3B30] dark:text-[#FF453A]">Account Session</h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
            Sign out of your active travel session
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Sign out of GlobeTrotter
            </p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              Your journeys and data are safely saved in local storage.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            onClick={handleSignOut}
            className="text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
