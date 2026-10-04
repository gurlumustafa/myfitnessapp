import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link } from 'react-router'
import Kart from '../components/Kart'
import MakroCubugu from '../components/MakroCubugu'
import { db } from '../db/db'
import { makroTopla } from '../lib/beslenme'
import { tarihMetni } from '../lib/tarih'

export default function Bugun() {
  const [simdi] = useState(() => new Date())
  const bugun = tarihMetni(simdi)
  const profil = useLiveQuery(() => db.profil.get('ben').then((p) => p ?? null))
  const kalemler = useLiveQuery(() => db.ogunKalemleri.where('tarih').equals(bugun).toArray(), [bugun])

  if (profil === undefined || kalemler === undefined) return null

  const tarihBasligi = simdi.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  if (!profil) {
    return (
      <>
        <h1 className="mb-4 text-2xl font-bold">Hoş geldin 👋</h1>
        <Kart>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Günlük kalori ve makro hedeflerini hesaplayabilmem için önce profilini oluştur.
          </p>
          <Link to="/ayarlar" className="block rounded-xl bg-marka py-3 text-center font-semibold text-white">
            Profilimi oluştur
          </Link>
        </Kart>
      </>
    )
  }

  const t = makroTopla(kalemler)
  const h = profil.gunlukHedef
  return (
    <>
      <p className="text-sm text-zinc-500">{tarihBasligi}</p>
      <h1 className="mb-4 text-2xl font-bold">Bugün</h1>
      <Kart baslik="Kalan">
        <div className="mb-4 text-center">
          <div className="text-4xl font-bold">{Math.round(h.kcal - t.kcal)}</div>
          <div className="text-sm text-zinc-500">kcal kaldı</div>
        </div>
        <MakroCubugu etiket="Kalori" tuketilen={t.kcal} hedef={h.kcal} birim="kcal" renk="bg-marka" />
        <MakroCubugu etiket="Protein" tuketilen={t.protein} hedef={h.protein} birim="g" renk="bg-protein" />
        <MakroCubugu etiket="Karbonhidrat" tuketilen={t.karbonhidrat} hedef={h.karbonhidrat} birim="g" renk="bg-karbonhidrat" />
        <MakroCubugu etiket="Yağ" tuketilen={t.yag} hedef={h.yag} birim="g" renk="bg-yag" />
      </Kart>
      <Kart baslik="Öğünler">
        <p className="text-sm text-zinc-500">Öğün ekleme bir sonraki aşamada geliyor.</p>
      </Kart>
    </>
  )
}
