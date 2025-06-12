import React from 'react'
import { cn } from '@/lib/utils'

const BorderDiv = ({children,className}: {children: React.ReactNode,className?: string}) => {
  return (
    <div className={cn("p-2 rounded-3xl border-2",className)}>
      {children}
    </div>
  )
}

export default BorderDiv