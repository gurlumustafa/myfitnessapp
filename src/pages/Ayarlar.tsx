import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent, type ReactNode } from 'react'
import Kart from '../components/Kart'
import { db } from '../db/db'
import { profilKaydet, yasHesapla, type ProfilFormu } from '../db/profil'
import type { AktiviteSeviyesi, Hedef, Makrolar, Profil } from '../db/types'
import { AKTIVITE_ETIKETI, HEDEF_ETIKETI, onerilenHedefler } from '../lib/beslenme'

const BU_YIL = new Date().getFullYear()

const VARSAYILAN: ProfilFormu = {
  cinsiyet: 'erkek',
  dogumYili: BU_YIL - 25,
  boyCm: 175,
  kiloKg: 75,
  aktivite: 'orta',
  hedef: 'koru',
  hedefModu: 'otomatik',
}

export default function Ayarlar() {
  const profil = useLiveQuery(() => db.profil.get('ben').then((p) => p ?? null))
  const kilolar = useLiveQuery(() => db.kiloKayitlari.orderBy('tarih').reverse().limit(10).toArray())
  if (profil === undefined) return null

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Ayarlar</h1>
      <ProfilFormuKarti profil={profil} />
      {kilolar && kilolar.length > 0 && (
        <Kart baslik="Son kilo kayıtları">
          <ul className="divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
            {kilolar.map((k) => (
              <li key={k.id} className="flex justify-between py-2">
                <span>{new Date(k.tarih + 'T00:00').toLocaleDateString('tr-TR')}</span>
                <span className="font-medium">{k.kiloKg} kg</span>
              </li>
            ))}
          </ul>
        </Kart>
      )}
    </>
  )
}

function ProfilFormuKarti({ profil }: { profil: Profil | null }) {
  const [form, setForm] = useState<ProfilFormu>(() => {
    if (!profil) return VARSAYILAN
    const { id: _id, gunlukHedef, ...bilgiler } = profil
    return { ...bilgiler, elleHedef: gunlukHedef }
  })
  const [kaydedildi, setKaydedildi] = useState(false)

  const guncelle = (degisiklik: Partial<ProfilFormu>) => {
    setForm((f) => ({ ...f, ...degisiklik }))
    setKaydedildi(false)
  }

  const oneri = onerilenHedefler({ ...form, yas: yasHesapla(form.dogumYili) })
  const elleHedef = form.elleHedef ?? oneri

  const gonder = async (e: FormEvent) => {
    e.preventDefault()
    await profilKaydet({ ...form, elleHedef: form.hedefModu === 'elle' ? elleHedef : undefined })
    setKaydedildi(true)
  }

  return (
    <form onSubmit={gonder}>
      <Kart baslik="Profil">
        <Alan etiket="Cinsiyet">
          <div className="grid grid-cols-2 gap-2">
            {(['erkek', 'kadin'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => guncelle({ cinsiyet: c })}
                className={`rounded-xl border py-2 ${form.cinsiyet === c ? 'border-marka bg-marka/10 font-semibold' : 'border-zinc-300 dark:border-zinc-700'}`}
              >
                {c === 'erkek' ? 'Erkek' : 'Kadın'}
              </button>
            ))}
          </div>
        </Alan>
        <div className="grid grid-cols-3 gap-2">
          <Alan etiket="Doğum yılı">
            <SayiGirdisi deger={form.dogumYili} min={1920} max={BU_YIL} degisti={(v) => guncelle({ dogumYili: v })} />
          </Alan>
          <Alan etiket="Boy (cm)">
            <SayiGirdisi deger={form.boyCm} min={100} max={250} degisti={(v) => guncelle({ boyCm: v })} />
          </Alan>
          <Alan etiket="Kilo (kg)">
            <SayiGirdisi deger={form.kiloKg} min={30} max={300} adim={0.1} degisti={(v) => guncelle({ kiloKg: v })} />
          </Alan>
        </div>
        <Alan etiket="Aktivite seviyesi">
          <Secim deger={form.aktivite} secenekler={AKTIVITE_ETIKETI} degisti={(v) => guncelle({ aktivite: v })} />
        </Alan>
        <Alan etiket="Hedef">
          <Secim deger={form.hedef} secenekler={HEDEF_ETIKETI} degisti={(v) => guncelle({ hedef: v })} />
        </Alan>
      </Kart>

      <Kart baslik="Günlük hedefler">
        <label className="mb-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.hedefModu === 'elle'}
            onChange={(e) => guncelle({ hedefModu: e.target.checked ? 'elle' : 'otomatik', elleHedef: form.elleHedef ?? oneri })}
            className="size-4 accent-marka"
          />
          Hedefleri kendim gireceğim
        </label>
        {form.hedefModu === 'otomatik' ? (
          <HedefOzeti hedef={oneri} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['kcal', 'Kalori (kcal)'],
                ['protein', 'Protein (g)'],
                ['karbonhidrat', 'Karbonhidrat (g)'],
                ['yag', 'Yağ (g)'],
              ] as [keyof Makrolar, string][]
            ).map(([k, etiket]) => (
              <Alan key={k} etiket={etiket}>
                <SayiGirdisi deger={elleHedef[k]} min={0} max={10000} degisti={(v) => guncelle({ elleHedef: { ...elleHedef, [k]: v } })} />
              </Alan>
            ))}
          </div>
        )}
      </Kart>

      <button type="submit" className="mb-2 w-full rounded-xl bg-marka py-3 font-semibold text-white">
        Kaydet
      </button>
      {kaydedildi && <p className="mb-4 text-center text-sm text-marka">Kaydedildi ✓</p>}
    </form>
  )
}

function HedefOzeti({ hedef }: { hedef: Makrolar }) {
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        [hedef.kcal, 'kcal', 'text-marka'],
        [hedef.protein, 'g protein', 'text-protein'],
        [hedef.karbonhidrat, 'g karb.', 'text-karbonhidrat'],
        [hedef.yag, 'g yağ', 'text-yag'],
      ].map(([deger, etiket, renk]) => (
        <div key={etiket} className="rounded-xl bg-zinc-100 py-2 dark:bg-zinc-800">
          <div className={`text-lg font-bold ${renk}`}>{Number.isFinite(deger) ? deger : "–"}</div>
          <div className="text-xs text-zinc-500">{etiket}</div>
        </div>
      ))}
    </div>
  )
}

function Alan({ etiket, children }: { etiket: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-400">{etiket}</span>
      {children}
    </label>
  )
}

const GIRDI_SINIFI = 'w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-base dark:border-zinc-700'

function SayiGirdisi(props: { deger: number; min: number; max: number; adim?: number; degisti: (v: number) => void }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      required
      min={props.min}
      max={props.max}
      step={props.adim ?? 1}
      value={Number.isNaN(props.deger) ? '' : props.deger}
      onChange={(e) => props.degisti(e.target.valueAsNumber)}
      className={GIRDI_SINIFI}
    />
  )
}

function Secim<T extends AktiviteSeviyesi | Hedef>(props: { deger: T; secenekler: Record<T, string>; degisti: (v: T) => void }) {
  return (
    <select value={props.deger} onChange={(e) => props.degisti(e.target.value as T)} className={GIRDI_SINIFI}>
      {(Object.entries(props.secenekler) as [T, string][]).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  )
}
