import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoute = ({allowedRoutes}) => {
  return <Outlet/>
}

export default PrivateRoute