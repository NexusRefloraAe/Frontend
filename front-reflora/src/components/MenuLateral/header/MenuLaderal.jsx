import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import Sidebar from '../sidebar/Sidebar'
import './MenuLaderal.css'



const MenuLaderal = () => {
  const [sidebar, setSidebar] = useState(false)

  const showSiderbar = () => setSidebar(!sidebar)

  return (
      <div className='Container'>
       <div className='MenuToggle' onClick={showSiderbar}>
          <FaBars />
        </div>{sidebar && <Sidebar active={setSidebar} />}
      </div>
  
  )
}

export default MenuLaderal 