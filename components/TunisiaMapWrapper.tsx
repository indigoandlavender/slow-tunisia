'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps { children: ReactNode; fallback: ReactNode; onError?: () => void; }
interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { if (this.state.hasError) return this.props.fallback; return this.props.children; }
}

function MapFallback({ stories }: { stories: Array<{ slug: string; title: string; region?: string; category?: string }> }) {
  const byRegion = stories.reduce((acc, story) => { const region = story.region || 'Tunisia'; if (!acc[region]) acc[region] = []; acc[region].push(story); return acc; }, {} as Record<string, typeof stories>);
  const sortedRegions = Object.keys(byRegion).sort();
  return (
    <div className="w-full bg-[#111] px-6 py-8 border border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Stories by Region</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {sortedRegions.slice(0, 9).map(region => (
          <div key={region}><h3 className="text-sm text-white/70 mb-2">{region}</h3><ul className="space-y-1">{byRegion[region].slice(0, 3).map(story => (<li key={story.slug}><Link href={`/story/${story.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">{story.title}</Link></li>))}{byRegion[region].length > 3 && (<li className="text-xs text-white/30">+ {byRegion[region].length - 3} more</li>)}</ul></div>
        ))}
      </div>
    </div>
  );
}

const TunisiaMap = dynamic(() => import('./TunisiaMap'), { ssr: false, loading: () => (<div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>) });

const TUNISIA_COORDINATES: Record<string, [number, number]> = {
  'Tunis': [10.1658, 36.8065], 'Sidi Bou Said': [10.3472, 36.8689], 'Carthage': [10.3253, 36.8528], 'Sousse': [10.6089, 35.8256],
  'Kairouan': [10.1006, 35.6781], 'Djerba': [10.8575, 33.8076], 'Tozeur': [8.1339, 33.9197], 'Douz': [9.0203, 33.4500],
  'North': [9.5000, 36.8000], 'South': [9.5000, 33.5000], 'Central': [9.5000, 35.0000], 'Coast': [10.5000, 35.5000],
  'Tunisia': [9.5375, 34.0], 'Multiple': [9.5375, 34.0],
};

const prepareStoriesForTunisiaMap = (stories: Array<{ slug: string; title: string; subtitle?: string; category?: string; region?: string; }>) => {
  const getCoordinates = (region: string): [number, number] => {
    if (!region) return TUNISIA_COORDINATES['Tunisia'];
    if (TUNISIA_COORDINATES[region]) return TUNISIA_COORDINATES[region];
    const lowerRegion = region.toLowerCase();
    for (const [key, coords] of Object.entries(TUNISIA_COORDINATES)) {
      if (key.toLowerCase() === lowerRegion) return coords;
      if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) return coords;
    }
    return TUNISIA_COORDINATES['Tunisia'];
  };
  return stories.map(story => ({ slug: story.slug, title: story.title, subtitle: story.subtitle, category: story.category, region: story.region, coordinates: getCoordinates(story.region || '') }));
};

interface TunisiaMapWrapperProps { stories: Array<{ slug: string; title: string; subtitle?: string; category?: string; region?: string; }>; className?: string; }

export default function TunisiaMapWrapper({ stories, className }: TunisiaMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (stories.length === 0) return (<div className="w-full h-[300px] bg-[#1a1a1a] flex items-center justify-center"><p className="text-white/40 text-sm">No stories to display on map</p></div>);
  if (!isClient || mapError) return <MapFallback stories={stories} />;
  const mappedStories = prepareStoriesForTunisiaMap(stories);
  return (<ErrorBoundary fallback={<MapFallback stories={stories} />} onError={() => setMapError(true)}><TunisiaMap stories={mappedStories} className={className} /></ErrorBoundary>);
}
