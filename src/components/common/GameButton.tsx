import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyan';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
  withGlare?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  withGlare = false,
  ...props
}) => {
  // Variant styles based on PDF 6.2 Button System
  const variantStyles: Record<ButtonVariant, string> = {
    // Primary: Yellow/orange face, navy outline, offset bottom shadow
    primary:
      'bg-gradient-to-b from-[#FFE34E] to-[#FFB800] text-[#0B2A63] border-[#0B2A63] shadow-[0_5px_0_#0B2A63] hover:brightness-105 active:shadow-[0_1px_0_#0B2A63] active:translate-y-[4px]',
    // Secondary: Blue or white face, navy outline, soft depth
    secondary:
      'bg-gradient-to-b from-[#FFFFFF] to-[#E9F0FA] text-[#0B2A63] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] hover:bg-white active:shadow-[0_1px_0_#0B2A63] active:translate-y-[3px]',
    // Danger: Red/coral face, navy outline
    danger:
      'bg-gradient-to-b from-[#FF5E62] to-[#EE3840] text-white border-[#0B2A63] shadow-[0_4px_0_#0B2A63] hover:brightness-105 active:shadow-[0_1px_0_#0B2A63] active:translate-y-[3px]',
    // Cyan: Bright energetic secondary action
    cyan:
      'bg-gradient-to-b from-[#55DCFF] to-[#1EA7FD] text-[#0B2A63] border-[#0B2A63] shadow-[0_4px_0_#0B2A63] hover:brightness-105 active:shadow-[0_1px_0_#0B2A63] active:translate-y-[3px]',
    // Ghost: subtle transparent
    ghost:
      'bg-white/20 text-white hover:bg-white/30 border-transparent active:translate-y-[1px]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl border-[2.5px] font-bold gap-1.5',
    md: 'text-sm sm:text-base px-4 py-2.5 rounded-2xl border-[3px] font-extrabold gap-2',
    lg: 'text-base sm:text-lg px-6 py-3.5 rounded-2xl border-[3.5px] font-black tracking-wide gap-2.5',
    xl: 'text-lg sm:text-xl px-8 py-4 rounded-3xl border-[4px] font-black tracking-wider gap-3',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed filter grayscale-[30%] shadow-[0_2px_0_#0B2A63] active:translate-y-0 active:shadow-[0_2px_0_#0B2A63]'
    : 'cursor-pointer';

  return (
    <button
      disabled={disabled}
      className={`relative overflow-hidden group inline-flex items-center justify-center select-none font-display transition-all duration-75 text-center leading-none ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {withGlare && !disabled && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
          aria-hidden="true"
        >
          <span className="absolute inset-y-0 -left-[120%] w-[60%] bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-25deg] transition-all duration-700 ease-out group-hover:left-[160%]" />
        </span>
      )}
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
