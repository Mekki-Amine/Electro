import React, { useState } from 'react';

export const Logo = ({ className = "w-90 h-90" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Essayer de charger l'image depuis le dossier public
  // Changez le nom du fichier selon votre image (logo.png, logo.jpg, logo.svg, etc.)
  const logoSrc = '/logo.jpg';


  
  if (imageError) {
    // SVG de fallback si l'image ne charge pas
    return (
      <svg
        className={className}
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="60" cy="80" rx="30" ry="40" fill="#FFA500" />
          <ellipse cx="30" cy="85" rx="15" ry="22" fill="#FFA500" transform="rotate(-35 30 85)" />
          <rect x="50" y="70" width="100" height="12" rx="3" fill="#808080" />
          <circle cx="40" cy="76" r="14" fill="#808080" />
          <circle cx="40" cy="76" r="7" fill="#fff" />
          <circle cx="160" cy="76" r="14" fill="#808080" />
          <circle cx="160" cy="76" r="7" fill="#fff" />
        </g>
      </svg>
    );
  }
  
  return (
    <img
      src={logoSrc}
      alt="Fixer Logo"
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

