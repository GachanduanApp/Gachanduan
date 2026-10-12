import React, { useRef, useEffect, useCallback } from 'react';
import { GachaCardData, Rarity } from '../types';
import { Sparkles } from 'lucide-react';

interface GachaCardProps {
  card: GachaCardData;
  index: number;
  onReveal?: (id: string) => void;
  onNextCard?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isFlipped?: boolean; // override for animation control if needed
  className?: string;
}

export const GachaCard: React.FC<GachaCardProps> = ({
  card,
  index,
  onReveal,
  onNextCard,
  disabled = false,
  size = 'lg',
  isFlipped,
  className = '',
}) => {
  const revealed = isFlipped !== undefined ? isFlipped : card.revealed;

  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Dynamic glare background generator following cursor / phone tilt angle
  const getGlareBackground = useCallback((xPct: string, yPct: string, rarity: Rarity) => {
    const xNum = parseFloat(xPct);
    const yNum = parseFloat(yPct);
    const angle = Math.round((Math.atan2(yNum - 50, xNum - 50) * 180) / Math.PI + 90);

    if (rarity === 'EPIC') {
      return `radial-gradient(circle 280px at ${xPct}% ${yPct}%, rgba(255, 255, 255, 0.85) 0%, rgba(217, 70, 239, 0.38) 25%, rgba(147, 51, 234, 0.2) 50%, rgba(56, 189, 248, 0.15) 70%, transparent 85%), linear-gradient(${angle}deg, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%)`;
    }
    if (rarity === 'RARE') {
      return `radial-gradient(circle 270px at ${xPct}% ${yPct}%, rgba(255, 255, 255, 0.85) 0%, rgba(56, 189, 248, 0.4) 28%, rgba(147, 197, 253, 0.18) 55%, transparent 80%), linear-gradient(${angle}deg, transparent 30%, rgba(255, 255, 255, 0.22) 50%, transparent 70%)`;
    }
    return `radial-gradient(circle 260px at ${xPct}% ${yPct}%, rgba(255, 255, 255, 0.8) 0%, rgba(40, 216, 107, 0.32) 30%, rgba(255, 255, 255, 0.1) 55%, transparent 75%), linear-gradient(${angle}deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)`;
  }, []);

  const updateTiltAndGlare = useCallback((normX: number, normY: number, opacity: number = 1) => {
    if (!tiltRef.current || !glareRef.current) return;

    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // Tilt directly towards cursor / tilt direction
    const maxTilt = 14;
    const rotX = -clampedY * maxTilt;
    const rotY = clampedX * maxTilt;

    tiltRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    const glareX = ((clampedX + 1) * 50).toFixed(1);
    const glareY = ((clampedY + 1) * 50).toFixed(1);

    glareRef.current.style.opacity = `${opacity}`;
    glareRef.current.style.background = getGlareBackground(glareX, glareY, card.rarity);
  }, [card.rarity, getGlareBackground]);

  const resetTiltAndGlare = useCallback(() => {
    if (tiltRef.current) {
      tiltRef.current.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
      tiltRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  // Desktop Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!revealed || size !== 'lg' || disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);
    updateTiltAndGlare(normX, normY, 1);
  };

  const handleMouseEnter = () => {
    if (!revealed || size !== 'lg' || disabled) return;
    isHoveredRef.current = true;
    if (tiltRef.current) {
      tiltRef.current.style.transition = 'transform 0.08s ease-out';
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    resetTiltAndGlare();
  };

  // Mobile Touch Handlers
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!revealed || size !== 'lg' || disabled || !cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - (rect.left + rect.width / 2);
    const y = touch.clientY - (rect.top + rect.height / 2);
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);
    updateTiltAndGlare(normX, normY, 0.9);
  };

  const handleTouchEnd = () => {
    resetTiltAndGlare();
  };

  // Mobile Gyroscope System (tilting the phone tilts the card and shifts glare)
  useEffect(() => {
    if (!revealed || size !== 'lg' || disabled) {
      resetTiltAndGlare();
      return;
    }

    let rafId: number | null = null;
    let targetNormX = 0;
    let targetNormY = 0;
    let currentNormX = 0;
    let currentNormY = 0;
    let hasGyroData = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Prioritize direct mouse hovering if on desktop
      if (isHoveredRef.current) return;
      if (e.gamma === null || e.beta === null) return;
      hasGyroData = true;

      // Natural holding angle on phone is ~45 degrees
      const naturalBeta = 45;
      const maxRange = 22; // Responsive tilt sensitivity

      const gamma = Math.max(-maxRange, Math.min(maxRange, e.gamma));
      const betaDiff = Math.max(-maxRange, Math.min(maxRange, e.beta - naturalBeta));

      targetNormX = gamma / maxRange;
      targetNormY = -betaDiff / maxRange;

      if (!rafId) {
        rafId = requestAnimationFrame(stepGyro);
      }
    };

    const stepGyro = () => {
      if (!hasGyroData) return;
      currentNormX += (targetNormX - currentNormX) * 0.18;
      currentNormY += (targetNormY - currentNormY) * 0.18;

      updateTiltAndGlare(currentNormX, currentNormY, 0.85);

      if (
        Math.abs(targetNormX - currentNormX) > 0.005 ||
        Math.abs(targetNormY - currentNormY) > 0.005
      ) {
        rafId = requestAnimationFrame(stepGyro);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (rafId) cancelAnimationFrame(rafId);
      resetTiltAndGlare();
    };
  }, [revealed, size, disabled, updateTiltAndGlare, resetTiltAndGlare]);

  // Assets mapping according to Section 10.1 of PDF
  const getAssets = (rarity: Rarity) => {
    switch (rarity) {
      case 'COMMON':
        return {
          frontImg: '/assets/commonFront.png',
          backImg: '/assets/commonBack.png',
          color: '#28D86B',
          glowClass: 'drop-shadow-[0_0_20px_rgba(40,216,107,0.5)]',
          voteText: '+1 VOTE',
          badgeBg: 'bg-[#28D86B] text-[#0B2A63]',
        };
      case 'RARE':
        return {
          frontImg: '/assets/rareFront.png',
          backImg: '/assets/rareBack.png',
          color: '#2A91FF',
          glowClass: 'drop-shadow-[0_0_25px_rgba(42,145,255,0.6)]',
          voteText: '+2 VOTES',
          badgeBg: 'bg-[#2A91FF] text-white',
        };
      case 'EPIC':
        return {
          frontImg: '/assets/epicFront.png',
          backImg: '/assets/epicBack.png',
          color: '#C026D3',
          glowClass: 'drop-shadow-[0_0_30px_rgba(217,70,239,0.7)]',
          voteText: '+3 VOTES',
          badgeBg: 'bg-gradient-to-r from-[#D946EF] to-[#9333EA] text-white',
        };
      default:
        return {
          frontImg: '/assets/commonFront.png',
          backImg: '/assets/commonBack.png',
          color: '#28D86B',
          glowClass: '',
          voteText: '+1 VOTE',
          badgeBg: 'bg-[#28D86B] text-[#0B2A63]',
        };
    }
  };

  const currentTheme = getAssets(card.rarity);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;

    // Request device orientation permission for iOS 13+ devices
    if (
      typeof window !== 'undefined' &&
      typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any).requestPermission().catch(() => {});
    }

    if (!card.revealed) {
      if (onReveal) {
        onReveal(card.id);
      }
    } else if (onNextCard) {
      onNextCard();
    }
  };

  // Dimensions matching 2:3 card ratio
  const sizeClasses = {
    sm: 'w-20 h-[120px] rounded-xl text-xs',
    md: 'w-44 h-[264px] rounded-2xl text-sm',
    lg: 'w-64 sm:w-72 md:w-80 h-[384px] sm:h-[432px] md:h-[480px]',
  };

  const isClickable = !disabled && ((!card.revealed && !!onReveal) || (card.revealed && !!onNextCard));

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role={isClickable ? 'button' : 'figure'}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`${card.optionName || 'Hidden card'} (${card.revealed ? card.rarity : 'Unrevealed'})`}
      className={`relative perspective-1000 select-none transition-all duration-200 ${sizeClasses[size]} ${
        isClickable
          ? revealed && size === 'lg'
            ? 'cursor-pointer'
            : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
          : 'cursor-default'
      } ${className}`}
    >
      {/* 3D Tilt Wrapper */}
      <div
        ref={tiltRef}
        className="relative w-full h-full transform-style-3d will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-out ${
            revealed ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= CARD BACK (Face Down State) ================= */}
          {/* Invisible/transparent container with drop-shadow naturally following card PNG edges */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-transparent drop-shadow-[0_12px_24px_rgba(11,42,99,0.5)]"
            style={{ transform: 'translateZ(1px)' }}
          >
            {/* Card Back Graphic Asset */}
            <img
              src={currentTheme.backImg}
              alt="Card Back"
              className="w-full h-full object-contain select-none pointer-events-none"
            />

            {/* Card Number Badge in Back */}
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-xl bg-[#0B2A63]/85 border-[2px] border-white/60 text-white font-display font-black text-xs shadow-md">
              #{index + 1}
            </div>

            {/* Gacha Logo or hint on back */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/95 border-[2px] border-[#0B2A63] text-[#0B2A63] font-display font-black text-[11px] shadow-sm whitespace-nowrap">
              TAP TO REVEAL
            </div>
          </div>

          {/* ================= CARD FRONT (Revealed State) ================= */}
          {/* Invisible/transparent container with glow and drop-shadow */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-transparent drop-shadow-[0_12px_24px_rgba(11,42,99,0.5)] ${currentTheme.glowClass}`}
            style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          >
            {/* Card Front Graphic Frame Asset */}
            <img
              src={currentTheme.frontImg}
              alt={`${card.rarity} Card Frame`}
              className="w-full h-full object-contain select-none pointer-events-none absolute inset-0 z-0"
            />

            {/* Dynamic Interactive Glare Layer following cursor / gyro */}
            {size === 'lg' && (
              <div
                ref={glareRef}
                className="absolute inset-0 z-30 pointer-events-none rounded-[28px] sm:rounded-[34px] overflow-hidden transition-opacity duration-300"
                style={{
                  opacity: 0,
                  mixBlendMode: 'overlay',
                }}
              />
            )}

          {/* Dynamic Content Layer strictly rendered in HTML inside safe card window */}
          <div
            className={`relative z-10 w-full h-full flex flex-col justify-between pointer-events-none ${
              size === 'md' ? 'p-3 sm:p-3.5' : 'p-5 sm:p-6'
            }`}
          >
            {/* Top Bar: Card Number & Rarity Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`rounded-xl bg-[#0B2A63] border-[2px] border-white/60 text-white font-display font-black shadow-sm ${
                  size === 'md' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
                }`}
              >
                #{index + 1} / 10
              </span>

              <span
                className={`rounded-xl border-[2.5px] border-[#0B2A63] font-display font-black uppercase tracking-wider shadow-[0_2px_0_#0B2A63] ${
                  size === 'md' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
                } ${currentTheme.badgeBg}`}
              >
                {card.rarity}
              </span>
            </div>

            {/* Center Area: Candidate Option Name */}
            <div className="flex-1 flex flex-col items-center justify-center px-1 py-2 text-center my-auto">
              <div
                className={`w-full max-w-[90%] bg-white/95 backdrop-blur-sm rounded-2xl border-[3px] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] ${
                  size === 'md' ? 'py-2 px-2' : 'py-4 px-3 sm:px-4'
                }`}
              >
                <span
                  className={`font-black uppercase tracking-wider text-slate-400 block mb-0.5 ${
                    size === 'md' ? 'text-[9px]' : 'text-[10px] sm:text-xs mb-1'
                  }`}
                >
                  CANDIDATE
                </span>
                <h3
                  className={`font-display font-black text-[#0B2A63] uppercase break-words drop-shadow-sm ${
                    size === 'md'
                      ? 'text-sm sm:text-base leading-snug line-clamp-2'
                      : 'text-xl sm:text-2xl md:text-3xl leading-tight'
                  }`}
                >
                  {card.optionName}
                </h3>
              </div>
            </div>

            {/* Bottom Bar: Vote Power Badge */}
            <div className="flex items-center justify-center">
              <div
                className={`inline-flex items-center rounded-2xl border-[2.5px] border-[#0B2A63] font-display font-black tracking-wider shadow-[0_3px_0_#0B2A63] ${
                  size === 'md' ? 'px-2.5 py-0.5 text-xs' : 'px-4 py-1.5 text-sm sm:text-base'
                } ${currentTheme.badgeBg}`}
              >
                <span>{currentTheme.voteText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
