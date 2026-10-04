import { Outlet } from 'react-router'
import AltMenu from './components/AltMenu'

export default function App() {
  return (
    <div className="mx-auto flex h-full max-w-lg flex-col">
      <main className="flex-1 overflow-y-auto px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-24">
        <Outlet />
      </main>
      <AltMenu />
    </div>
  )
}
