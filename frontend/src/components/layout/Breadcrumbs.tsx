import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customItems?: { label: string; path?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  if (customItems) {
    return (
      <nav className="flex items-center text-xs text-slate-500 mb-5 overflow-x-auto whitespace-nowrap">
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        {customItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 flex-shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-brand-600 transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  // If on dashboard, do not show breadcrumb
  if (pathnames.length === 0 || pathnames[0] === 'dashboard') {
    return null;
  }

  const formatBreadcrumb = (segment: string) => {
    if (segment === 'trips') return 'My Trips';
    if (segment === 'create') return 'New Trip';
    if (segment === 'itinerary') return 'Itinerary Builder';
    if (segment === 'budget') return 'Budget & Expenses';
    if (segment === 'calendar') return 'Calendar & Schedule';
    if (segment === 'explore') return 'Explore';
    if (segment === 'cities') return 'Cities';
    if (segment === 'activities') return 'Activities';
    if (segment === 'profile') return 'Profile & Settings';
    if (segment.startsWith('trip-') || segment.length > 10) return 'Trip Details';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className="flex items-center text-xs text-slate-500 mb-5 overflow-x-auto whitespace-nowrap">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 flex-shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold">{formatBreadcrumb(value)}</span>
            ) : (
              <Link to={to} className="hover:text-brand-600 transition-colors font-medium">
                {formatBreadcrumb(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
