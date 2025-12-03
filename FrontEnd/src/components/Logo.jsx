import React from 'react';

export const Logo = ({ className = "w-16 h-16" }) => {
  // Logo SVG de réparation - Clé à molette plus petite
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fond circulaire jaune - Plus petit */}
      <circle cx="50" cy="50" r="42" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2.5"/>
      
      {/* Clé à molette - Plus petite */}
      <g transform="translate(50, 50)">
        {/* Tête de la clé à molette (hexagone) */}
        <polygon 
          points="-10,-6 10,-6 14,0 10,6 -10,6 -14,0" 
          fill="#1F2937" 
          stroke="#111827" 
          strokeWidth="2.5"
        />
        <circle cx="0" cy="0" r="5" fill="#374151"/>
        
        {/* Manche de la clé */}
        <rect x="-2.5" y="6" width="5" height="16" rx="2.5" fill="#92400E" stroke="#78350F" strokeWidth="1.5"/>
        
        {/* Poignée */}
        <rect x="-3.5" y="20" width="7" height="6" rx="1.5" fill="#78350F"/>
      </g>
    </svg>
  );
};
