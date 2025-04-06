import React from 'react'
import useUserAuth from '../../hooks/useUserAuth'

const UserDashboard = () => {
  useUserAuth()
  return (
    <div>
      <h1>UserDashboard</h1>
    </div>
  )
}

export default UserDashboard