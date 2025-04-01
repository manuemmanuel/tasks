'use client'

import { useState } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function LazyImage({ src, alt, width, height, className }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`
          ${className || ''}
          ${isLoading ? 'blur-sm' : 'blur-0'}
          transition-all duration-300
        `}
        loading="lazy"
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-violet-950/20 animate-pulse" />
      )}
    </div>
  )
} 