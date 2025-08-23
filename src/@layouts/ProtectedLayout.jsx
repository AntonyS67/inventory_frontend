'use client'

import { useLayoutEffect } from 'react'

import { useRouter } from 'next/navigation'

const ProtectedLayout = ({ children }) => {
  const router = useRouter()

  useLayoutEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (token == null || token === undefined) {
      router.push('/login')
    }
  }, [])

  return <div className='flex flex-col min-h-screen'>{children}</div>
}

export default ProtectedLayout
