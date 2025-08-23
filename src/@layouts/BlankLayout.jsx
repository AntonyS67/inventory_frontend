'use client'

// Third-party Imports
import { useLayoutEffect } from 'react'

import { useRouter } from 'next/navigation'

import classnames from 'classnames'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'

// Util Imports
import { blankLayoutClasses } from './utils/layoutClasses'

const BlankLayout = props => {
  // Props
  const { children, systemMode } = props

  // Hooks
  const { settings } = useSettings()

  useLayoutInit(systemMode)

  const router = useRouter()

  useLayoutEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (token != null && token !== undefined) {
      router.push('/')
    }
  }, [])

  return (
    <div className={classnames(blankLayoutClasses.root, 'is-full bs-full')} data-skin={settings.skin}>
      {children}
    </div>
  )
}

export default BlankLayout
