import React from 'react';

export const Logo = ({ className = "w-12 h-12" }) => {
  // Logo SVG de réparation - Outils croisés (clé à molette et marteau)
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fond circulaire jaune */}
      <circle cx="50" cy="50" r="40" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      
      {/* Clé à molette (positionnée en diagonale) */}
      <g transform="translate(50, 50) rotate(-45)">
        {/* Tête de la clé à molette (hexagone) */}
        <polygon 
          points="-8,-5 8,-5 11,0 8,5 -8,5 -11,0" 
          fill="#1F2937" 
          stroke="#111827" 
          strokeWidth="2"
        />
        <circle cx="0" cy="0" r="4" fill="#374151"/>
        
        {/* Manche de la clé */}
        <rect x="-2" y="5" width="4" height="14" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1"/>
        
        {/* Poignée */}
        <rect x="-3" y="17" width="6" height="5" rx="1" fill="#78350F"/>
      </g>
      
      {/* Marteau (positionné en diagonale croisée) */}
      <g transform="translate(50, 50) rotate(45)">
        {/* Tête du marteau */}
        <rect x="-6" y="-12" width="12" height="8" rx="1" fill="#1F2937" stroke="#111827" strokeWidth="2"/>
        
        {/* Manche du marteau */}
        <rect x="-2" y="-4" width="4" height="20" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1"/>
        
        {/* Poignée du marteau */}
        <rect x="-3" y="14" width="6" height="4" rx="1" fill="#78350F"/>
      </g>
    </svg>
  );
};
