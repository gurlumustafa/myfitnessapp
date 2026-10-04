interface Props {
  etiket: string
  tuketilen: number
  hedef: number
  birim: string
  renk: string // Tailwind arka plan sınıfı, örn. "bg-protein"
}

export default function MakroCubugu({ etiket, tuketilen, hedef, birim, renk }: Props) {
  const oran = hedef > 0 ? Math.min(1, tuketilen / hedef) : 0
  const kalan = Math.round(hedef - tuketilen)
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{etiket}</span>
        <span className="text-zinc-500">
          {Math.round(tuketilen)} / {hedef} {birim} ·{' '}
          {kalan >= 0 ? `${kalan} kaldı` : `${-kalan} fazla`}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className={`h-full rounded-full ${kalan < 0 ? 'bg-red-500' : renk}`} style={{ width: `${oran * 100}%` }} />
      </div>
    </div>
  )
}
