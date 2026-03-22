'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ToastCtx { toast: (msg: string) => void }
const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)

  const toast = useCallback((m: string) => {
    setMsg(m); setVisible(true)
    setTimeout(() => setVisible(false), 2400)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-[var(--text)] text-[var(--text-inv)] px-5 py-2.5 rounded-full text-sm font-medium shadow-[var(--shadow-md)] whitespace-nowrap z-[9999] transition-all duration-250 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {msg}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
