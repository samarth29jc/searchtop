import React, { useState, useRef, useEffect } from "react";
import Icon from "../../media/icon/icons";

const SlidingBottomLineButtons = ({ buttons, activeTab, onTabChange }) => {
  const [activeButton, setActiveButton] = useState(0);
  const buttonRefs = useRef([]);
  const [buttonWidths, setButtonWidths] = useState([]);

  useEffect(() => {
    const widths = buttonRefs.current.map((button) => button.offsetWidth);
    setButtonWidths(widths);
  }, [buttons]);

  useEffect(() => {
    const activeIndex = buttons.findIndex((button) => button.name === activeTab);
    setActiveButton(activeIndex);
  }, [activeTab, buttons]);

  return (
    <div className="sliding-buttons-container">
      <div className="button-lines">
        <div
          className="slide-line"
          style={{
            left: `${buttonWidths.slice(0, activeButton).reduce((acc, curr) => acc + curr, 0)}px`,
            width: `${buttonWidths[activeButton]}px`,
            transition: "left 0.3s ease, width 0.3s ease", 
          }}
        ></div>
      </div>

      {buttons.map((button, index) => (
        <button
          key={index}
          ref={(el) => (buttonRefs.current[index] = el)}
          className={`sliding-button ${activeButton === index ? "isactive" : ""}`}
          onClick={() => onTabChange(button.name)} 
        >
          <Icon name={button.icon} width={20} height={20} color={ activeButton===index ? "#003366" : "#b7b7b7"} />
          {button.name}
        </button>
      ))}
    </div>
  );
};

export default SlidingBottomLineButtons;
