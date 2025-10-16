import React from 'react'
import "./SidebarItemStyler.css";

const SidebarItem = ({ Icon, Text, isLogout, onClick }) => {
  return (
    <button
      className={`sidebar-item ${isLogout ? "logout" : ""}`}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
      <span>{Text}</span>
    </button>
  );
};

export default SidebarItem;