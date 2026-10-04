import { NavLink } from 'react-router'

const SEKMELER = [
  { yol: '/', etiket: 'Bugün', simge: '🍽️' },
  { yol: '/antrenman', etiket: 'Antrenman', simge: '🏋️' },
  { yol: '/raporlar', etiket: 'Raporlar', simge: '📊' },
  { yol: '/ayarlar', etiket: 'Ayarlar', simge: '⚙️' },
]

export default function AltMenu() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <ul className="mx-auto flex max-w-lg">
        {SEKMELER.map((s) => (
          <li key={s.yol} className="flex-1">
            <NavLink
              to={s.yol}
              end={s.yol === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'font-semibold text-marka' : 'text-zinc-500'}`
              }
            >
              <span className="text-xl" aria-hidden>{s.simge}</span>
              {s.etiket}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
