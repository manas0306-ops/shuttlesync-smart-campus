import React, { useEffect, useState } from 'react';

export const ShuttleCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let prevX = 0;
    let prevY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      // Calculate slight tilt angle based on velocity
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        // smooth clamp tilt
        setAngle(targetAngle > 90 || targetAngle < -90 ? -12 : 12);
      }

      prevX = e.clientX;
      prevY = e.clientY;

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], label, .interactive-hover');
        setIsPointer(!!interactive);
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-opacity duration-200"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) scale(${isPointer ? 0.75 : 1})`,
        opacity: isPointer ? 0.6 : 0.95,
      }}
    >
      {/* Animated Mini Shuttle Cart */}
      <div
        className="relative transition-transform duration-150"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <svg
          width="38"
          height="32"
          viewBox="0 0 38 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_10px_rgba(2,132,199,0.5)]"
        >
          {/* Exhaust puff animation when moving */}
          <circle cx="2" cy="19" r="2.5" fill="#38bdf8" opacity="0.6" className="animate-ping" />
          <circle cx="6" cy="19" r="1.5" fill="#bae6fd" opacity="0.8" />

          {/* Shuttle body */}
          <rect x="7" y="6" width="26" height="17" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Roof strip */}
          <rect x="10" y="3" width="20" height="4" rx="2" fill="#38bdf8" />
          {/* Windows */}
          <rect x="10" y="9" width="7" height="6" rx="1.5" fill="#e0f2fe" opacity="0.9" />
          <rect x="19" y="9" width="6" height="6" rx="1.5" fill="#e0f2fe" opacity="0.9" />
          <path d="M27 9H31V15H27V9Z" fill="#bae6fd" />
          {/* Headlight beam */}
          <polygon points="33,12 38,9 38,17 33,16" fill="#fef08a" opacity="0.75" />
          {/* Front Light */}
          <circle cx="32" cy="14" r="1.5" fill="#fef08a" />
          {/* Wheels */}
          <g className="animate-spin" style={{ transformOrigin: '14px 23px', animationDuration: '0.8s' }}>
            <circle cx="14" cy="23" r="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="14" cy="23" r="1.2" fill="#e2e8f0" />
          </g>
          <g className="animate-spin" style={{ transformOrigin: '27px 23px', animationDuration: '0.8s' }}>
            <circle cx="27" cy="23" r="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="27" cy="23" r="1.2" fill="#e2e8f0" />
          </g>
        </svg>

        {/* Small beacon on top */}
        <div className="absolute -top-1 left-4 h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
      </div>
    </div>
  );
};
