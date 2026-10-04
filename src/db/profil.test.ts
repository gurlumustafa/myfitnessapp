import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { profilKaydet, type ProfilFormu } from './profil'

const form: ProfilFormu = {
  cinsiyet: 'erkek', dogumYili: new Date().getFullYear() - 25, boyCm: 180, kiloKg: 80,
  aktivite: 'orta', hedef: 'koru', hedefModu: 'otomatik',
}

describe('profilKaydet', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('otomatik modda hedefleri hesaplar ve ilk kilo kaydını ekler', async () => {
    const p = await profilKaydet(form)
    expect(p.gunlukHedef.kcal).toBe(2798)
    expect(await db.kiloKayitlari.count()).toBe(1)
  })

  it('elle modda girilen hedefleri kullanır', async () => {
    const elleHedef = { kcal: 2000, protein: 150, karbonhidrat: 200, yag: 67 }
    const p = await profilKaydet({ ...form, hedefModu: 'elle', elleHedef })
    expect(p.gunlukHedef).toEqual(elleHedef)
  })

  it('aynı gün kilo değişirse yeni kayıt açmaz, mevcut kaydı günceller', async () => {
    await profilKaydet(form)
    await profilKaydet({ ...form, kiloKg: 79 })
    const kayitlar = await db.kiloKayitlari.toArray()
    expect(kayitlar).toHaveLength(1)
    expect(kayitlar[0].kiloKg).toBe(79)
  })
})
