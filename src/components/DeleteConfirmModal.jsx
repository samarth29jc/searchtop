import React from "react";
import "../styles/tempStyle.css"; 
import Icon from "../media/icon/icons";

const DeleteConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="dlt-modal-overlay">
      <div className="dlt-modal-box">
        

          
        <div className="dlt-modal-body">
          <p>Are you sure you want to do this?</p>
          
          <span className="dlt-close-btn" onClick={onClose}><Icon name="close_fill" width={20} height={20} color="#000"/></span>
        </div>
        <div className="dlt-modal-footer">
          <button className="dlt-btn-confirm" onClick={onConfirm}>Confirm</button>
          <button className="dlt-btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
