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
      label: 'Light Theme',
      icon: Sun,
      desc: 'Crisp slate canvas with high contrast typography',
    },
    {
      mode: 'system',
      label: 'System Sync',
      icon: Laptop,
      desc: 'Automatically synchronizes with your device theme',
    },
    {
      mode: 'dark',
      label: 'Dark Theme',
      icon: Moon,
      desc: 'Deep navy blacks with vivid neon accents',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Profile & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal traveler identity, theme, currency, and travel preferences.
        </p>
      </div>

      {/* User Hero Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={user?.name || 'User Avatar'}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-2xs"
          />
          <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {user?.name || 'Alex Rivera'}
            </h2>
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 self-center sm:self-auto">
              Pro Explorer
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email || 'alex@globetrotter.io'}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5 italic">{bio}</p>
        </div>
      </div>

      {/* Theme Switcher Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance Theme</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select how GlobeTrotter renders across your devices. Currently active in{' '}
            <strong className="text-blue-600 dark:text-blue-400 capitalize">{resolvedTheme} Mode</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <button
                type="button"
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
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
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Traveler Identity & Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure your personal details, home airport, currency format, and travel style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            Travel Bio / Notes
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Notifications & Privacy Toggles */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Notification Preferences
          </h4>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Trip Departure & Milestone Reminders
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive automated alerts for upcoming flights, check-ins, and scheduled tours.
              </p>
            </div>
            <input
              type="checkbox"
              checked={tripReminders}
              onChange={(e) => setTripReminders(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Budget Threshold Warnings
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Get notified when active trip expenses reach 80% of target budget.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            isLoading={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl px-4 py-2 shadow-2xs"
          >
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Danger & Logout Zone */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Account Session</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign out of your active travel session
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Sign out of GlobeTrotter
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your journeys and data are safely saved in local storage.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            onClick={handleSignOut}
            className="text-xs rounded-xl"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
