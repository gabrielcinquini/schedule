'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export const ClearCookies = () => {
  useEffect(() => {
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.trim().split('=')
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
    localStorage.clear()
    sessionStorage.clear()
    signOut()
  }, [])

  return <></>
}
