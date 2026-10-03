import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number; // default tilt degrees, e.g. 10
  elevationScale?: number; // scale on hover, e.g. 1.02
  enableGlow?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  tiltIntensity = 8,
  elevationScale = 1.02,
  enableGlow = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for natural tactile feel
  const springConfig = { stiffness: 350, damping: 28, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Transform coordinates into 3D rotations
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Glare / holographic reflection position
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized cursor position from center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset smoothly to flat position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY
      }}
      whileHover={{
        scale: elevationScale,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1, ease: 'easeIn' }
      }}
      className={`relative transform-gpu transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#63e6ff]/15 select-none ${className}`}
    >
      {/* Glare / Holographic Light Sheen */}
      {enableGlow && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(99, 230, 255, 0.12) 0%, rgba(186, 2, 123, 0.05) 45%, transparent 70%)`
          }}
        />
      )}

      {/* Card Content with 3D Depth */}
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};
