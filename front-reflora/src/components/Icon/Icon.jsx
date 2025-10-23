// src/components/Icon/Icon.jsx
import React from 'react';
import { 
  HiOutlineUserAdd, 
  HiOutlinePencilAlt, 
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineX
} from 'react-icons/hi';

import './Icon.css';

// Mapeamento de todos os ícones disponíveis
const iconComponents = {
  // Canteiros
  'user-add': HiOutlineUserAdd,
  'edit': HiOutlinePencilAlt,
  'history': HiOutlineClock,
  'truck': HiOutlineTruck,
  'chart': HiOutlineChartBar,
  
  // Gerais
  'settings': HiOutlineCog,
  'home': HiOutlineHome,
  'user': HiOutlineUser,
  'search': HiOutlineSearch,
  'plus': HiOutlinePlus,
  'trash': HiOutlineTrash,
  'save': HiOutlineSave,
  'close': HiOutlineX
};

const Icon = ({ name, size = 18, color, className = '' }) => {
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado!`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      color={color}
      className={`icon ${className}`}
    />
  );
};

export default Icon;