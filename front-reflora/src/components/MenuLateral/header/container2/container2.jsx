import '../container2/container2Styler.css'
import { Link } from 'react-router-dom'
import bell from '../../../../assets/bell.svg'

function Container2({Text}){
    return (
        <div className='Container2'>
            <span>{Text}</span>
            <Link to='/notificacoes'>
                <img src= {bell} alt='notification-bell' className='bell' />
            </Link>
        </div>
    )
}

export default Container2   