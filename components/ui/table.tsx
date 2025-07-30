import { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-600">
        {children}
      </table>
    </div>
  )
}
