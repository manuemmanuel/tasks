'use client'

import { Suspense } from 'react'
import LoadingScreen from './LoadingScreen'

export default function LazyComponent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  )
} 