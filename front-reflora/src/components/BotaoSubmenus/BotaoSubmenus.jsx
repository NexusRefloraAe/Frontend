import React from 'react';
import Button from '../Button/Button';

const BotaoSubmenus = ({ menus, activeMenuId, onMenuClick }) => {
    return (
        <div className="configuracoes-tabs">
            {menus.map((menu) => (
                <Button
                    key={menu.id}
                    variant={menu.id === activeMenuId ? 'tab-active' : 'tab-inactive'}
                    icon={menu.icon}
                    onClick={() => onMenuClick(menu.id)}
                >
                    {menu.label}
                </Button>
            ))}
        </div>
    );
};

export default BotaoSubmenus;