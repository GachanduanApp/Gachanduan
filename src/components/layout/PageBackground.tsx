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

      {/* 4. Decorative Floating Ambient Cards (At far edges, low opacity, tilted) */}
      <div className="hidden lg:block absolute top-1/4 left-6 w-20 h-28 opacity-25 -rotate-12 animate-float-subtle">
        <img
          src="/assets/commonBack.png"
          alt=""
          className="w-full h-full object-contain drop-shadow-lg select-none"
        />
      </div>
      <div className="hidden lg:block absolute top-1/3 right-8 w-22 h-30 opacity-25 rotate-12 animate-float-subtle" style={{ animationDelay: '1.5s' }}>
        <img
          src="/assets/rareBack.png"
          alt=""
          className="w-full h-full object-contain drop-shadow-lg select-none"
        />
      </div>
      <div className="hidden xl:block absolute bottom-1/4 left-10 w-24 h-32 opacity-20 rotate-6 animate-float-subtle" style={{ animationDelay: '2.5s' }}>
        <img
          src="/assets/epicBack.png"
          alt=""
          className="w-full h-full object-contain drop-shadow-lg select-none"
        />
      </div>
    </div>
  );
};
