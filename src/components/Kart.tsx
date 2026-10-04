import type { ReactNode } from 'react'

export default function Kart({ baslik, children }: { baslik?: string; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
      {baslik && <h2 className="mb-3 text-base font-semibold">{baslik}</h2>}
      {children}
    </section>
  )
}
