import Dexie, { type EntityTable } from 'dexie'
import type {
  Antrenman, AntrenmanSeti, Ayar, Egzersiz, KiloKaydi, Ogun, OgunKalemi, Profil,
  Program, ProgramEgzersizi, ProgramGunu, Yiyecek,
} from './types'

// Tüm veriler telefonun tarayıcısındaki IndexedDB'de durur.
// Şema değişikliğinde sürüm numarasını artırıp yeni bir .version() bloğu ekleyin; eskisini silmeyin.
export class FitnessDB extends Dexie {
  profil!: EntityTable<Profil, 'id'>
  kiloKayitlari!: EntityTable<KiloKaydi, 'id'>
  yiyecekler!: EntityTable<Yiyecek, 'id'>
  ogunler!: EntityTable<Ogun, 'id'>
  ogunKalemleri!: EntityTable<OgunKalemi, 'id'>
  egzersizler!: EntityTable<Egzersiz, 'id'>
  programlar!: EntityTable<Program, 'id'>
  programGunleri!: EntityTable<ProgramGunu, 'id'>
  programEgzersizleri!: EntityTable<ProgramEgzersizi, 'id'>
  antrenmanlar!: EntityTable<Antrenman, 'id'>
  antrenmanSetleri!: EntityTable<AntrenmanSeti, 'id'>
  ayarlar!: EntityTable<Ayar, 'anahtar'>

  constructor(ad = 'myfitnessapp') {
    super(ad)
    this.version(1).stores({
      profil: 'id',
      kiloKayitlari: '++id, tarih',
      yiyecekler: '++id, ad, favori',
      ogunler: '++id, tarih, [tarih+tur]',
      ogunKalemleri: '++id, ogunId, tarih',
      egzersizler: '++id, ad, kasGrubu',
      programlar: '++id, aktif',
      programGunleri: '++id, programId',
      programEgzersizleri: '++id, programGunuId, egzersizId',
      antrenmanlar: '++id, tarih, programGunuId',
      antrenmanSetleri: '++id, antrenmanId, egzersizId',
      ayarlar: 'anahtar',
    })
  }
}

export const db = new FitnessDB()
