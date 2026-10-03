import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DroneDeliveryHeatmapProps {
  cityName?: string;
  className?: string;
}

interface DronePath {
  id: string;
  origin: string;
  destination: string;
  points: [number, number][];
  activeDrones: number;
  avgAltitude: number;
  densityScore: number; // 0 to 100
  color: string;
}

interface HotspotNode {
  name: string;
  x: number;
  y: number;
  intensity: number; // 0 to 1
  radius: number;
  activeDeliveries: number;
}

const CITY_HOTSPOTS: HotspotNode[] = [
  { name: 'HITEC Cyber Sky-Hub', x: 80, y: 70, intensity: 0.95, radius: 45, activeDeliveries: 42 },
  { name: 'Durgam Cheruvu Cable Airway', x: 190, y: 110, intensity: 0.88, radius: 40, activeDeliveries: 38 },
  { name: 'Madhapur Express Corridor', x: 140, y: 85, intensity: 0.75, radius: 35, activeDeliveries: 29 },
  { name: 'Skyview Dropzone (Your Hub)', x: 310, y: 160, intensity: 0.92, radius: 38, activeDeliveries: 19 },
  { name: 'Gachibowli Financial Hub', x: 60, y: 170, intensity: 0.70, radius: 34, activeDeliveries: 24 },
  { name: 'Jubilee Hills Ridge', x: 260, y: 65, intensity: 0.65, radius: 30, activeDeliveries: 16 },
  { name: 'Banjara Hills Node', x: 330, y: 80, intensity: 0.60, radius: 28, activeDeliveries: 14 }
];

const DRONE_ROUTES: DronePath[] = [
  {
    id: 'route-alpha',
    origin: 'HITEC Hub',
    destination: 'Skyview Dropzone',
    points: [[80, 70], [130, 80], [190, 110], [250, 135], [310, 160]],
    activeDrones: 8,
    avgAltitude: 120,
    densityScore: 94,
    color: '#63e6ff'
  },
  {
    id: 'route-beta',
    origin: 'Gachibowli Tech Deck',
    destination: 'Durgam Cheruvu',
    points: [[60, 170], [110, 145], [190, 110]],
    activeDrones: 5,
    avgAltitude: 105,
    densityScore: 82,
    color: '#ffd86b'
  },
  {
    id: 'route-gamma',
    origin: 'Jubilee Hills Ridge',
    destination: 'Skyview Residences',
    points: [[260, 65], [290, 110], [310, 160]],
    activeDrones: 6,
    avgAltitude: 135,
    densityScore: 78,
    color: '#75f5a6'
  },
  {
    id: 'route-delta',
    origin: 'Bawarchi Cyber Kitchen',
    destination: 'Skyview Gate 2',
    points: [[90, 60], [160, 95], [220, 105], [310, 160]],
    activeDrones: 11,
    avgAltitude: 115,
    densityScore: 98,
    color: '#ba027b'
  }
];

export const DroneDeliveryHeatmapD3: React.FC<DroneDeliveryHeatmapProps> = ({
  cityName = 'Hyderabad Cyber Corridor',
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedHub, setSelectedHub] = useState<HotspotNode | null>(CITY_HOTSPOTS[3]); // default to Skyview
  const [activeLayer, setActiveLayer] = useState<'heatmap' | 'routes' | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<'live' | '1h' | '24h'>('live');
  const [droneCount, setDroneCount] = useState(28);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean re-render

    const width = 380;
    const height = 210;

    // Background Container
    const g = svg.append('g').attr('class', 'heatmap-container');

    // Define SVG Gradients & Filters
    const defs = svg.append('defs');

    // Blur filter for D3 heatmap gaussian dissipation
    const filter = defs.append('filter')
      .attr('id', 'd3-heatmap-blur')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '18')
      .attr('result', 'blur');

    // Heatmap Radial Gradients for Hotspots
    CITY_HOTSPOTS.forEach((spot, idx) => {
      const grad = defs.append('radialGradient')
        .attr('id', `heat-grad-${idx}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', spot.intensity > 0.85 ? '#ba027b' : spot.intensity > 0.7 ? '#ffd86b' : '#63e6ff')
        .attr('stop-opacity', spot.intensity * 0.75);

      grad.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#63e6ff')
        .attr('stop-opacity', spot.intensity * 0.35);

      grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#060914')
        .attr('stop-opacity', 0);
    });

    // 1. Draw Grid Lines for HUD feel
    const gridG = g.append('g').attr('class', 'grid-layer').attr('opacity', 0.15);
    for (let x = 20; x < width; x += 30) {
      gridG.append('line')
        .attr('x1', x).attr('y1', 0)
        .attr('x2', x).attr('y2', height)
        .attr('stroke', '#63e6ff')
        .attr('stroke-width', 0.6)
        .attr('stroke-dasharray', '2 4');
    }
    for (let y = 20; y < height; y += 30) {
      gridG.append('line')
        .attr('x1', 0).attr('y1', y)
        .attr('x2', width).attr('y2', y)
        .attr('stroke', '#63e6ff')
        .attr('stroke-width', 0.6)
        .attr('stroke-dasharray', '2 4');
    }

    // 2. Render D3 Heatmap Circles with Blur Filter
    if (activeLayer === 'heatmap' || activeLayer === 'all') {
      const heatmapG = g.append('g').attr('class', 'heatmap-layer').attr('filter', 'url(#d3-heatmap-blur)');
      
      CITY_HOTSPOTS.forEach((spot, idx) => {
        heatmapG.append('circle')
          .attr('cx', spot.x)
          .attr('cy', spot.y)
          .attr('r', spot.radius * 1.4)
          .attr('fill', `url(#heat-grad-${idx})`);
      });
    }

    // 3. Render D3 Drone Delivery Flight Paths (Spline Curves)
    if (activeLayer === 'routes' || activeLayer === 'all') {
      const lineGenerator = d3.line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveCatmullRom.alpha(0.5));

      const routesG = g.append('g').attr('class', 'routes-layer');

      DRONE_ROUTES.forEach((route) => {
        const pathData = lineGenerator(route.points) || '';

        // Glowing under-stroke
        routesG.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', route.color)
          .attr('stroke-width', 3.5)
          .attr('stroke-opacity', 0.25)
          .attr('stroke-linecap', 'round');

        // Animated flight path
        const mainPath = routesG.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', route.color)
          .attr('stroke-width', 1.6)
          .attr('stroke-dasharray', '4 4')
          .attr('stroke-opacity', 0.85);

        // Animate stroke dashoffset for live flow effect
        mainPath.append('animate')
          .attr('attributeName', 'stroke-dashoffset')
          .attr('values', '40;0')
          .attr('dur', `${2.5 + Math.random()}s`)
          .attr('repeatCount', 'indefinite');
      });
    }

    // 4. Render Interactive Hub Nodes with Pulsing Beacons
    const nodesG = g.append('g').attr('class', 'nodes-layer');

    CITY_HOTSPOTS.forEach((spot) => {
      const isSelected = selectedHub?.name === spot.name;

      const nodeGroup = nodesG.append('g')
        .attr('transform', `translate(${spot.x}, ${spot.y})`)
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedHub(spot);
        });

      // Outer radar pulse
      nodeGroup.append('circle')
        .attr('r', isSelected ? 12 : 7)
        .attr('fill', 'none')
        .attr('stroke', isSelected ? '#75f5a6' : '#63e6ff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.6)
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', `${isSelected ? 10 : 6};${isSelected ? 20 : 14}`)
        .attr('dur', '1.8s')
        .attr('repeatCount', 'indefinite');

      // Center node core
      nodeGroup.append('circle')
        .attr('r', isSelected ? 5 : 3.5)
        .attr('fill', isSelected ? '#75f5a6' : '#ffd86b')
        .attr('stroke', '#060914')
        .attr('stroke-width', 1.5);

      // Node label
      nodeGroup.append('text')
        .attr('x', 0)
        .attr('y', isSelected ? -12 : -8)
        .attr('text-anchor', 'middle')
        .attr('fill', isSelected ? '#75f5a6' : '#cbd5e1')
        .attr('font-size', isSelected ? '9px' : '7.5px')
        .attr('font-family', 'Space Grotesk, sans-serif')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .text(spot.name.split(' ')[0]);
    });

  }, [activeLayer, selectedHub, timeFilter]);

  // Periodic random drone flight counter tick
  useEffect(() => {
    const timer = setInterval(() => {
      setDroneCount((prev) => {
        const delta = Math.floor((Math.random() - 0.48) * 3);
        return Math.max(18, Math.min(42, prev + delta));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`p-4 rounded-3xl bg-[#10182A]/95 border border-[#63e6ff]/30 shadow-2xl space-y-3.5 relative overflow-hidden ${className}`}>
      {/* Background glow sheen */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#ba027b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#63e6ff]/15 text-[#63e6ff] flex items-center justify-center border border-[#63e6ff]/30">
            <span className="material-symbols-outlined text-[18px]">radar</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#75f5a6] animate-ping" />
              <h3 className="text-xs font-black text-[#F5F8FF] font-space tracking-wide">
                DRONE AIR-CORRIDOR HEATMAP
              </h3>
            </div>
            <p className="text-[10px] text-[#869396] font-space">
              D3 density radar • {cityName}
            </p>
          </div>
        </div>

        {/* Live Active Drone Count Badge */}
        <div className="text-right">
          <span className="text-[9px] font-mono text-[#869396] uppercase block">ACTIVE SORTIES</span>
          <span className="text-xs font-mono font-black text-[#75f5a6] bg-[#75f5a6]/10 px-2 py-0.5 rounded-md border border-[#75f5a6]/30 inline-block">
            ⚡ {droneCount} In-Flight
          </span>
        </div>
      </div>

      {/* D3 SVG Heatmap Render Stage */}
      <div className="relative rounded-2xl bg-[#060914] border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 380 210"
          className="w-full h-48 select-none"
        />

        {/* Heatmap Layer Legend overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#060914]/85 px-2 py-0.5 rounded-lg border border-white/10 text-[8px] font-space text-[#869396]">
          <span className="text-[7px]">LOW</span>
          <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-[#63e6ff] via-[#ffd86b] to-[#ba027b]" />
          <span className="text-[7px] text-[#ba027b] font-bold">DENSE</span>
        </div>

        {/* Live Altitude Indicator */}
        <div className="absolute top-2 right-2 bg-[#060914]/85 px-2 py-0.5 rounded-lg border border-[#63e6ff]/20 text-[9px] font-mono text-[#63e6ff]">
          AGL: 120m Skyway
        </div>
      </div>

      {/* Layer Toggles & Filters */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex bg-[#060914] p-0.5 rounded-xl border border-white/10">
          {(['all', 'heatmap', 'routes'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 text-[9px] font-space font-bold rounded-lg uppercase transition-all cursor-pointer ${
                activeLayer === layer
                  ? 'bg-[#63e6ff] text-black shadow-sm'
                  : 'text-[#869396] hover:text-white'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-space text-[#869396]">
          {(['live', '1h', '24h'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-2 py-0.5 rounded-md font-mono text-[9px] transition-all cursor-pointer ${
                timeFilter === tf
                  ? 'bg-[#75f5a6]/20 text-[#75f5a6] font-bold border border-[#75f5a6]/40'
                  : 'hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Hub Telemetry Details */}
      {selectedHub && (
        <div className="p-2.5 rounded-2xl bg-[#060914]/90 border border-white/10 flex items-center justify-between text-xs font-space">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd86b]" />
            <div>
              <div className="font-bold text-[#F5F8FF] text-[11px]">
                {selectedHub.name}
              </div>
              <div className="text-[9px] text-[#869396]">
                Density Index: {Math.round(selectedHub.intensity * 100)}% • Sky-lane Speed: 62 km/h
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-[#63e6ff]">
              {selectedHub.activeDeliveries} Drops Today
            </span>
            <div className="text-[8px] text-[#75f5a6]">Air-Corridor Clear</div>
          </div>
        </div>
      )}
    </div>
  );
};
