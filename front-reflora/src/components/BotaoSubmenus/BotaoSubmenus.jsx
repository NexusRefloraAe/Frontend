import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './BotaoSubmenus.css';

const BotaoSubmenus = ({ menus, activeMenuId, onMenuClick }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Detecta se é mobile (agora usando 576px como breakpoint)
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleMenuSelect = (menuId) => {
        onMenuClick(menuId);
        setShowDropdown(false);
    };

    // Encontra o menu ativo para exibir no dropdown
    const activeMenu = menus.find(menu => menu.id === activeMenuId);

    if (isMobile) {
        // Versão mobile com dropdown (mantida intacta)
        return (
            <div className="configuracoes-wrapper">
                <div 
                    className={`mobile-dropdown-trigger ${showDropdown ? 'active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="dropdown-selected">
                        {activeMenu?.icon && (
                            <span className="dropdown-icon">{activeMenu.icon}</span>
                        )}
                        <span className="dropdown-label">{activeMenu?.label || 'Selecione'}</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    
                    {showDropdown && (
                        <div className="dropdown-menu">
                            {menus.map((menu) => (
                                <div
                                    key={menu.id}
                                    className={`dropdown-item ${menu.id === activeMenuId ? 'dropdown-item-active' : ''}`}
                                    onClick={() => handleMenuSelect(menu.id)}
                                >
                                    {menu.icon && (
                                        <span className="dropdown-item-icon">{menu.icon}</span>
                                    )}
                                    <span>{menu.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Versão web com botões compactos
    return (
        <div className="configuracoes-wrapper">
            <div className="configuracoes-tabs">
                {menus.map((menu) => (
                    <Button
                        key={menu.id}
                        variant={menu.id === activeMenuId ? 'tab-active' : 'tab-inactive'}
                        icon={menu.icon}
                        onClick={() => onMenuClick(menu.id)}
                        className="tab-button"
                        title={menu.label} // Tooltip para textos muito curtos
                    >
                        {menu.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default BotaoSubmenus;