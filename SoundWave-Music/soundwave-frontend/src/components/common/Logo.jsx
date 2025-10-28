import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 36, withText = false }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <img
        src="/icons/LogoS.svg"
        alt="Logo de l'application"
        width={size}
        height={size}
        className="select-none hover:scale-110 transition-transform duration-200"
        style={{ filter: 'brightness(0) invert(1)' }}
        draggable={false}
      />
      {withText && (
        <span className="text-white font-semibold text-lg tracking-wide group-hover:text-green-400 transition-colors">
          {/* Le nom de l'application sera défini par l'utilisateur */}
        </span>
      )}
    </Link>
  );
};

export default Logo;

