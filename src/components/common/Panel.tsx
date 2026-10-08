import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'navy' | 'blue' | 'yellow';
  header?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  variant = 'white',
  header,
}) => {
  const variantStyles = {
    white: 'bg-white text-[#0B2A63] border-[#0B2A63] shadow-[0_8px_0_#0B2A63]',
    navy: 'bg-[#0B2A63] text-white border-[#051838] shadow-[0_8px_0_#051838]',
    blue: 'bg-gradient-to-b from-[#2595FE] to-[#1176DE] text-white border-[#0B2A63] shadow-[0_8px_0_#0B2A63]',
    yellow: 'bg-gradient-to-b from-[#FFF275] to-[#FFCF25] text-[#0B2A63] border-[#0B2A63] shadow-[0_8px_0_#0B2A63]',
  };

  return (
    <div
      className={`rounded-3xl border-[3.5px] relative overflow-hidden ${variantStyles[variant]} ${className}`}
    >
      {header && <div className="border-b-[3px] border-[#0B2A63] bg-slate-50/80 px-6 py-4">{header}</div>}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
