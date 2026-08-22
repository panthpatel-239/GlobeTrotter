import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  Utensils,
  Sparkles,
  Train,
  Plane,
  ZoomIn,
  ZoomOut,
  Layers,
  Compass,
  Navigation,
  ExternalLink,
  DollarSign,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { GeoLocation, MapRouteSegment, mapService } from '../../services/mapService';
import { Trip } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface TripMapViewProps {
  trip: Trip;
}

export const TripMapView: React.FC<TripMapViewProps> = ({ trip }) => {
  const [points, setPoints] = useState<GeoLocation[]>([]);
  const [routes, setRoutes] = useState<MapRouteSegment[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<GeoLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'destination' | 'hotel' | 'activity' | 'restaurant'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    const loadMap = async () => {
      const data = await mapService.getTripMapData(trip.id);
      setPoints(data.points);
      setRoutes(data.routes);
      if (data.points.length > 0) {
        setSelectedPoint(data.points[0]);
      }
    };
    loadMap();
  }, [trip.id]);

  const filteredPoints =
    activeFilter === 'all'
      ? points
      : points.filter((p) => p.type === activeFilter);

  const getPointIcon = (type: GeoLocation['type']) => {
    switch (type) {
      case 'destination':
        return <Compass className="w-3.5 h-3.5 text-white" />;
      case 'hotel':
        return <Building className="w-3.5 h-3.5 text-white" />;
      case 'restaurant':
        return <Utensils className="w-3.5 h-3.5 text-white" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getPointBg = (type: GeoLocation['type']) => {
    switch (type) {
      case 'destination':
        return 'bg-blue-600';
      case 'hotel':
        return 'bg-teal-600';
      case 'restaurant':
        return 'bg-amber-500';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Header & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Interactive Route & Location Map
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            ({points.length} coordinates mapped)
          </span>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Markers' },
            { id: 'destination', label: 'Hubs' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'activity', label: 'Activities' },
            { id: 'restaurant', label: 'Dining' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative h-[440px] w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-[#EBF2F7] dark:bg-[#080D1A] shadow-sm">
        {/* Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(#94A3B8 1.5px, transparent 1.5px), radial-gradient(#94A3B8 1.5px, #EBF2F7 1.5px)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* Route Lines Connecting Destinations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 180 240 Q 320 180 480 280 T 780 220"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Map Interactive Pins */}
        <div
          className="relative w-full h-full p-8 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {filteredPoints.map((point, index) => {
            const leftPercent = 20 + (index * 13) + ((index % 2) * 5);
            const topPercent = 25 + ((index * 9) % 50) + ((index % 3) * 6);
            const isSelected = selectedPoint?.name === point.name;

            return (
              <div
                key={point.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                onClick={() => setSelectedPoint(point)}
              >
                {/* Pin Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md transition-all group-hover:scale-110 ${
                    getPointBg(point.type)
                  } ${isSelected ? 'ring-4 ring-blue-400/40 scale-110' : ''}`}
                >
                  {getPointIcon(point.type)}
                  <span className="text-[11px] font-bold text-white whitespace-nowrap">
                    {point.name}
                  </span>
                </div>
                {/* Pin Tip */}
                <div
                  className={`w-2 h-2 mx-auto rotate-45 -mt-1 shadow-sm ${getPointBg(point.type)}`}
                />
              </div>
            );
          })}
        </div>

        {/* Zoom & Control Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.6))}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Inspector Detail Overlay Card */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl z-30 space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl ${getPointBg(selectedPoint.type)}`}>
                  {getPointIcon(selectedPoint.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedPoint.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                    {selectedPoint.category || selectedPoint.type} • {selectedPoint.cityName || trip.destinationSummary}
                  </p>
                </div>
              </div>

              {selectedPoint.cost !== undefined && selectedPoint.cost > 0 && (
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  {formatCurrency(selectedPoint.cost)}
                </span>
              )}
            </div>

            {selectedPoint.address && (
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedPoint.address}</span>
              </p>
            )}

            {selectedPoint.time && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Scheduled for {selectedPoint.time}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
