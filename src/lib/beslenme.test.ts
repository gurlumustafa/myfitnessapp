import { describe, expect, it } from 'vitest'
import { bazalMetabolizma, gunlukHarcama, makroTopla, onerilenHedefler } from './beslenme'

const ornek = { cinsiyet: 'erkek', yas: 25, boyCm: 180, kiloKg: 80, aktivite: 'orta', hedef: 'koru' } as const

describe('beslenme hesapları', () => {
  it('Mifflin-St Jeor ile bazal metabolizmayı hesaplar', () => {
    expect(bazalMetabolizma(ornek)).toBe(1805)
    expect(bazalMetabolizma({ ...ornek, cinsiyet: 'kadin' })).toBe(1639)
  })

  it('aktivite çarpanını uygular', () => {
    expect(gunlukHarcama(ornek)).toBeCloseTo(2797.75)
  })

  it('makro hedeflerini kaloriyle tutarlı üretir', () => {
    const h = onerilenHedefler(ornek)
    expect(h.kcal).toBe(2798)
    expect(h.protein).toBe(144)
    const hesaplananKcal = h.protein * 4 + h.karbonhidrat * 4 + h.yag * 9
    expect(Math.abs(hesaplananKcal - h.kcal)).toBeLessThan(15)
  })

  it('kilo verme hedefinde kaloriyi düşürür ve proteini artırır', () => {
    const h = onerilenHedefler({ ...ornek, hedef: 'kilo_ver' })
    expect(h.kcal).toBe(2298)
    expect(h.protein).toBe(160)
  })

  it('kaloriyi 1200 altına düşürmez', () => {
    const h = onerilenHedefler({ cinsiyet: 'kadin', yas: 60, boyCm: 150, kiloKg: 45, aktivite: 'hareketsiz', hedef: 'kilo_ver' })
    expect(h.kcal).toBe(1200)
  })

  it('makroları toplar', () => {
    const t = makroTopla([
      { kcal: 100, protein: 10, karbonhidrat: 5, yag: 2 },
      { kcal: 50, protein: 1, karbonhidrat: 10, yag: 0 },
    ])
    expect(t).toEqual({ kcal: 150, protein: 11, karbonhidrat: 15, yag: 2 })
  })
})
