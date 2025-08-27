import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 36, withText = false }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <img
        src="/icons/LogoS.svg"
        alt="SoundWave"
        width={size}
        height={size}
        className="select-none"
        draggable={false}
      />
      {withText && (
        <span className="text-white font-semibold text-lg tracking-wide group-hover:text-green-400 transition-colors">
          SoundWave
        </span>
      )}
    </Link>
  );
};

export default Logo;

