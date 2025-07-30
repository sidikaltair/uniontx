import { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl shadow-md bg-white p-4">
      {children}
    </div>
  )
}
