import React, { useState, useRef } from 'react';
import { DishHotspot } from '../types';

interface FloatingDish3DProps {
  imageUrl: string;
  imageAlt: string;
  heightClass?: string;
  hotspots?: DishHotspot[];
  onSelectHotspot?: (hotspot: DishHotspot) => void;
  showSweepToggle?: boolean;
  reducedMotion?: boolean;
}

export const FloatingDish3D: React.FC<FloatingDish3DProps> = ({
  imageUrl,
  imageAlt,
  heightClass = 'h-[280px]',
  hotspots = [],
  onSelectHotspot,
  showSweepToggle = true,
  reducedMotion = false
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(!reducedMotion);
  const [showRadarHotspots, setShowRadarHotspots] = useState(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotationAngle((prev) => prev + deltaX * 0.4);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    setRotationAngle((prev) => prev + deltaX * 0.4);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full ${heightClass} flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none`}
    >
      {/* 3D Wireframe Depth Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[280px] h-[280px] rounded-full border border-dashed border-[#63e6ff]/30 animate-spin" style={{ animationDuration: '40s' }}></div>
        <div className="absolute w-[220px] h-[220px] rounded-full border border-[#ffafd3]/20"></div>
        <div className="absolute w-[340px] h-[340px] rounded-full border border-white/5"></div>
      </div>

      {/* Floating Shadow */}
      <div className="absolute bottom-6 w-48 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85)_0%,transparent_75%)] animate-plate-shadow"></div>

      {/* Levitating Food Asset Stage */}
      <div
        style={{
          transform: `rotateY(${rotationAngle}deg)`,
          transition: isDragging ? 'none' : 'transform 0.4s ease-out'
        }}
        className={`relative z-10 w-64 h-64 flex items-center justify-center ${
          isRotating ? 'animate-dish-levitate' : ''
        }`}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.9)] filter contrast-105"
        />

        {/* Hotspot Radar Pins overlayed on 3D coordinates */}
        {showRadarHotspots &&
          hotspots.map((hs) => {
            const isSelected = activeHotspotId === hs.id;
            return (
              <div
                key={hs.id}
                style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newId = isSelected ? null : hs.id;
                    setActiveHotspotId(newId);
                    if (onSelectHotspot) onSelectHotspot(hs);
                  }}
                  className="relative group p-1.5 focus:outline-none"
                  aria-label={hs.title}
                >
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: hs.color }}
                  ></span>
                  <span
                    className="relative block w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                    style={{ backgroundColor: hs.color }}
                  ></span>
                </button>
              </div>
            );
          })}
      </div>

      {/* Hotspot Details Card Popup */}
      {activeHotspot && (
        <div
          className="absolute bottom-3 left-4 right-4 z-40 bg-[#10182A]/95 backdrop-blur-xl border p-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex items-center justify-between animate-in fade-in zoom-in-95"
          style={{ borderColor: `${activeHotspot.color}60` }}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeHotspot.color, boxShadow: `0 0 10px ${activeHotspot.color}` }}
            ></span>
            <div className="truncate">
              <span className="font-space text-xs font-bold text-[#F5F8FF] block uppercase tracking-wide truncate">
                {activeHotspot.title}
              </span>
              <span className="font-space text-[10px] text-[#869396] block truncate">
                {activeHotspot.subtitle}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveHotspotId(null)}
            className="w-6 h-6 rounded-full bg-[#181b27] text-[#869396] hover:text-[#F5F8FF] flex items-center justify-center shrink-0 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Viewport Floating Controls */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#10182A]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#63e6ff] animate-pulse"></span>
        <span className="font-space text-[9px] text-[#869396] uppercase tracking-wider font-bold">
          3D CULINARY VIEWPORT
        </span>
      </div>

      {showSweepToggle && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1">
          <button
            onClick={() => setShowRadarHotspots(!showRadarHotspots)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              showRadarHotspots
                ? 'bg-[#181b27] border-[#63e6ff]/50 text-[#63e6ff]'
                : 'bg-[#10182A]/80 border-white/5 text-[#869396]'
            }`}
            title="Toggle Radar Hotspots"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              isRotating
                ? 'bg-[#181b27] border-[#ffd86b]/50 text-[#ffd86b]'
                : 'bg-[#10182A]/80 border-white/5 text-[#869396]'
            }`}
            title="Auto Sweep 180°"
          >
            <span className="material-symbols-outlined text-[16px]">360</span>
          </button>
        </div>
      )}
    </div>
  );
};
