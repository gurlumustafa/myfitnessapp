import { onerilenHedefler } from '../lib/beslenme'
import { tarihMetni } from '../lib/tarih'
import { db } from './db'
import type { Makrolar, Profil } from './types'

export type ProfilFormu = Omit<Profil, 'id' | 'gunlukHedef'> & { elleHedef?: Makrolar }

export function yasHesapla(dogumYili: number, bugun = new Date()): number {
  return bugun.getFullYear() - dogumYili
}

/** Profili kaydeder; otomatik moddaysa hedefleri yeniden hesaplar, kilo değiştiyse bugüne kilo kaydı ekler. */
export async function profilKaydet(form: ProfilFormu): Promise<Profil> {
  const { elleHedef, ...bilgiler } = form
  const gunlukHedef =
    form.hedefModu === 'elle' && elleHedef
      ? elleHedef
      : onerilenHedefler({ ...bilgiler, yas: yasHesapla(bilgiler.dogumYili) })
  const profil: Profil = { id: 'ben', ...bilgiler, gunlukHedef }

  await db.transaction('rw', db.profil, db.kiloKayitlari, async () => {
    const onceki = await db.profil.get('ben')
    await db.profil.put(profil)
    if (!onceki || onceki.kiloKg !== profil.kiloKg) {
      await kiloKaydet(profil.kiloKg)
    }
  })
  return profil
}

/** Aynı güne ait kilo kaydı varsa günceller, yoksa ekler. */
export async function kiloKaydet(kiloKg: number, tarih = tarihMetni()): Promise<void> {
  const mevcut = await db.kiloKayitlari.where('tarih').equals(tarih).first()
  if (mevcut?.id) await db.kiloKayitlari.update(mevcut.id, { kiloKg })
  else await db.kiloKayitlari.add({ tarih, kiloKg })
}
