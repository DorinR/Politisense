import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

export default function Logout () {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    localStorage.clear()
  })
  return (
    <div>
      <Redirect to='/login' />
    </div>
  )
}
