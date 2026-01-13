import React from 'react';
import './SidebarItemStyler.css'; // Verifique se existe este arquivo

const SidebarItem = ({ Icon, Text, onClick, active, isLogout = false }) => {
  return (
    <div 
      className={`sidebar-item ${active ? 'selected' : ''} ${isLogout ? 'logout' : ''}`} // Aqui usa "sidebar-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <Icon className="sidebar-icon" />
      <span className="sidebar-text">{Text}</span>
    </div>
  );
};

export default SidebarItem;