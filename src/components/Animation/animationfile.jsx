import React, { useEffect, useState } from "react";
import Icon from "../../media/icon/icons";

const ProfileContainer = ({ name, title, iconStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const slideInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const expandTimeout = setTimeout(() => {
      setIsExpanded(true);
    }, 2000);

    const showTextTimeout = setTimeout(() => {
      setShowText(true);
    }, 3000);

    return () => {
      clearTimeout(slideInTimeout);
      clearTimeout(expandTimeout);
      clearTimeout(showTextTimeout);
    };
  }, []);

  // Determine the icon to show based on status
  const getStatusIcon = (status) => {
    if (status === 'success') {
      return <Icon name="check_circle" width={20} height={20} color="#4caf50" />;
    }
    if (status === 'fail') {
      return <Icon name="error" width={20} height={20} color="#f44336" />;
    }
    return <Icon name="mood" width={20} height={20} color="#ffffff" />;
  };

  return (
    <div
      className={`profile-container ${isVisible ? "visible" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
    >
      <div className="profile-icon">
        {getStatusIcon(iconStatus)}
      </div>
      <div
        className={`profile-text ${showText ? "show-text" : "hide-text"}`}
      >
        <h3>{name}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default ProfileContainer;
