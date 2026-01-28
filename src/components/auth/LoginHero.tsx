
import React from 'react';
import { Logo } from '../ui/Icons';

const LoginHero: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Hero Image: Professional environment with tablet */}
      <img 
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
        alt="Candidata utilizando tablet"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark overlay for text contrast - matches the image opacity */}
      <div className="absolute inset-0 bg-black/55"></div>
      
      {/* Logo in top left - with shadow for visibility */}
      <div className="absolute top-10 left-10 z-10">
        <Logo className="drop-shadow-lg scale-110 origin-left" />
      </div>

      {/* Hero Caption - Subtle and modern */}
      <div className="absolute bottom-16 left-12 right-12 text-white/90 max-w-sm hidden xl:block border-l-2 border-[#F04E23] pl-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#5AB7F7] mb-3">Conexão • Talento • Futuro</p>
        <h2 className="text-4xl font-black leading-[1.1]">Sua vaga ideal está te esperando.</h2>
      </div>
    </div>
  );
};

export default LoginHero;
