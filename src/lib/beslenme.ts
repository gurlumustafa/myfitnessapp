import type { AktiviteSeviyesi, Cinsiyet, Hedef, Makrolar } from '../db/types'

export const AKTIVITE_CARPANI: Record<AktiviteSeviyesi, number> = {
  hareketsiz: 1.2,
  az: 1.375,
  orta: 1.55,
  yuksek: 1.725,
  cok_yuksek: 1.9,
}

export const AKTIVITE_ETIKETI: Record<AktiviteSeviyesi, string> = {
  hareketsiz: 'Hareketsiz (masa başı)',
  az: 'Az aktif (haftada 1-3 gün spor)',
  orta: 'Orta aktif (haftada 3-5 gün spor)',
  yuksek: 'Çok aktif (haftada 6-7 gün spor)',
  cok_yuksek: 'Aşırı aktif (ağır iş + spor)',
}

export const HEDEF_ETIKETI: Record<Hedef, string> = {
  kilo_ver: 'Kilo vermek',
  koru: 'Kiloyu korumak',
  kilo_al: 'Kilo / kas almak',
}

const HEDEF_KCAL_FARKI: Record<Hedef, number> = {
  kilo_ver: -500,
  koru: 0,
  kilo_al: 300,
}

export interface ProfilGirdisi {
  cinsiyet: Cinsiyet
  yas: number
  boyCm: number
  kiloKg: number
  aktivite: AktiviteSeviyesi
  hedef: Hedef
}

/** Bazal metabolizma hızı, Mifflin-St Jeor formülü (kcal/gün). */
export function bazalMetabolizma(p: Pick<ProfilGirdisi, 'cinsiyet' | 'yas' | 'boyCm' | 'kiloKg'>): number {
  const taban = 10 * p.kiloKg + 6.25 * p.boyCm - 5 * p.yas
  return p.cinsiyet === 'erkek' ? taban + 5 : taban - 161
}

/** Günlük toplam enerji harcaması (kcal/gün). */
export function gunlukHarcama(p: ProfilGirdisi): number {
  return bazalMetabolizma(p) * AKTIVITE_CARPANI[p.aktivite]
}

/**
 * Önerilen günlük hedefler:
 * kalori = harcama + hedef farkı (en az 1200),
 * protein = 1.8 g/kg (kilo verirken 2.0 g/kg), yağ = kalorinin %25'i, karbonhidrat = kalan.
 */
export function onerilenHedefler(p: ProfilGirdisi): Makrolar {
  const kcal = Math.max(1200, Math.round(gunlukHarcama(p) + HEDEF_KCAL_FARKI[p.hedef]))
  const protein = Math.round(p.kiloKg * (p.hedef === 'kilo_ver' ? 2.0 : 1.8))
  const yag = Math.round((kcal * 0.25) / 9)
  const karbonhidrat = Math.max(0, Math.round((kcal - protein * 4 - yag * 9) / 4))
  return { kcal, protein, karbonhidrat, yag }
}

export function makroTopla(liste: Makrolar[]): Makrolar {
  return liste.reduce(
    (t, m) => ({
      kcal: t.kcal + m.kcal,
      protein: t.protein + m.protein,
      karbonhidrat: t.karbonhidrat + m.karbonhidrat,
      yag: t.yag + m.yag,
    }),
    { kcal: 0, protein: 0, karbonhidrat: 0, yag: 0 },
  )
}
