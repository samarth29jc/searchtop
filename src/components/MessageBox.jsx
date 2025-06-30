import React, { useEffect, useState } from 'react';
import '../styles/tempStyle.css';

const MessageBox = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`message-box ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default MessageBox;
