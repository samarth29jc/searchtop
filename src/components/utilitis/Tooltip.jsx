import React from "react";

const Tooltip = ({ tooltip, children }) => {
  return (
    <div className="tooltip-wrapper">
      {children}
      {tooltip && <div className="tooltip-box">{tooltip}</div>}
    </div>
  );
};

export default Tooltip;
