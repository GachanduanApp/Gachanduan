import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'blue' | 'white' | 'yellow' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'white',
  size = 'md',
  label,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white text-[#0B2A63] hover:bg-slate-50',
    blue: 'bg-gradient-to-b from-[#2AA5FF] to-[#157FEB] text-white hover:brightness-105',
    yellow: 'bg-gradient-to-b from-[#FFE34E] to-[#FFB800] text-[#0B2A63] hover:brightness-105',
    danger: 'bg-gradient-to-b from-[#FF5E62] to-[#EE3840] text-white hover:brightness-105',
  };

  const sizeStyles = {
    sm: 'w-8 h-8 rounded-xl border-[2px] shadow-[0_2.5px_0_#0B2A63]',
    md: 'w-10 h-10 rounded-2xl border-[2.5px] shadow-[0_3.5px_0_#0B2A63]',
    lg: 'w-12 h-12 rounded-2xl border-[3px] shadow-[0_4px_0_#0B2A63]',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed filter grayscale-[20%]'
    : 'cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_#0B2A63]';

  return (
    <button
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center border-[#0B2A63] select-none transition-all duration-75 shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
