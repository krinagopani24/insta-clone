import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { AuthContext } from '../../../hooks/AuthContext'
import { auth } from '../../../firebase'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img src={currentUser.picture} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar