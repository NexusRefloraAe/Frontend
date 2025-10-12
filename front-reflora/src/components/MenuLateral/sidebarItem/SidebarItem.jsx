import React from 'react'
import { Container } from './SidebarItemStyler'

const SidebarItem = ({ Icon, Text, isLogout, onClick }) => {
  return (
    <Container isLogout={isLogout} onClick={onClick} >
      <Icon />
      {Text}
    </Container>
  )
}

export default SidebarItem