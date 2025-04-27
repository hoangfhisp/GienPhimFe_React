// Overlay.jsx
import React from 'react';
import '../Table/Overlay.scss';

const Overlay = ({ onClose, children }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
