import React from 'react';

export const PageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Rich Cartoon Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e5bb5] via-[#168cf5] to-[#0d59b2]" />

      {/* 2. Seamless Card Pattern Texture (Low Opacity) */}
      <div
        className="absolute inset-0 opacity-12 bg-repeat"
        style={{
          backgroundImage: "url('/assets/seamlessPattern.png')",
          backgroundSize: '360px auto',
        }}
      />

      {/* 3. Ambient Clouds (Positioned at edges, subtle floating animation) */}
      {/* Top Left Cloud */}
      <div className="absolute -top-10 -left-20 w-80 sm:w-96 md:w-[480px] opacity-80 animate-cloud-slow">
        <img
          src="/assets/cloud1.png"
          alt=""
          className="w-full h-auto drop-shadow-md select-none"
        />
      </div>

      {/* Top Right Cloud */}
      <div className="absolute -top-6 -right-24 w-80 sm:w-[420px] md:w-[500px] opacity-75 animate-cloud-reverse">
        <img
          src="/assets/cloud2.png"
          alt=""
          className="w-full h-auto drop-shadow-md select-none"
        />
      </div>

      {/* Bottom Left Cloud */}
      <div className="absolute -bottom-16 -left-24 w-72 sm:w-88 md:w-[440px] opacity-70 animate-cloud-reverse">
        <img
          src="/assets/cloud2.png"
          alt=""
          className="w-full h-auto drop-shadow-md select-none"
        />
      </div>

      {/* Bottom Right Cloud */}
      <div className="absolute -bottom-20 -right-20 w-80 sm:w-96 md:w-[460px] opacity-75 animate-cloud-slow">
        <img
          src="/assets/cloud1.png"
          alt=""
          className="w-full h-auto drop-shadow-md select-none"
        />
      </div>
    </div>
  );
};
