import React, { useEffect, useState } from 'react';
import './ProfileDropdown.css';
import Icon from '../../media/icon/icons.jsx';

const ProfileDropdown = ({ 
  isOpen, 
  onClose, 
  user = {}, 
  onEditProfile,
  onLogout,
  className = '',
}) => {
  const [show, setShow] = useState(isOpen);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimating(false);
    } else if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setShow(false);
        setAnimating(false);
      }, 300); // match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, show]);

  if (!show) return null;

  const defaultUser = {
    name: 'Admin',
    email: 'admin@gmail.com',
    avatar: null,
  };

  const userData = { ...defaultUser, ...user };

  const handleEditProfile = () => {
    onEditProfile && onEditProfile();
    onClose();
  };

  const handleLogout = () => {
    onLogout && onLogout();
    onClose();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="profile-overlay" onClick={onClose} />
      <div className={`profile-dropdown ${className} ${isOpen ? 'open' : 'close'}`}>
        <div className="profile-header">
          <div className="profile-title">
            <Icon name="user_fill" width={16} height={16} color="#003366" />
            <span>Profile</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <Icon name="cross" width={20} height={20} color="#666" />
          </button>
        </div>

        <div className="profile-content">
          <div className="user-info">
            <div className="user-avatar">
              <Icon name="person" width={24} height={24} color="#4B5563" />
            </div>
            <div className="user-details">
              <h3 className="user-name">{userData.name}</h3>
              <p className="user-email">{userData.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              <Icon name="edit" width={16} height={16} color="#fff" />
              <span>Edit Profile</span>
            </button>
            <hr className="separator" />
            <button className="logout-btn" onClick={handleLogout}>
              <Icon name="logout" width={16} height={16} color="#4b5563" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;