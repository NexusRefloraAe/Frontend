import './container2Styler.css';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import bell from '../../../../assets/bell.svg';

function Container2({ Text, onMenuClick, isMobile }) {
    return (
        <div className='Container2'>
            {isMobile && (
                <button className="menu-button" onClick={onMenuClick} aria-label="Abrir menu">
                    <FaBars />
                </button>
            )}

            <span title={Text}>{Text}</span>

            <Link to='/notificacoes'>
                <img src={bell} alt='Notificações' className='bell' />
            </Link>
        </div>
    );
}

export default Container2;