// Uygulamanın tüm veri tipleri. Tarihler "YYYY-MM-DD" biçiminde yerel tarih metni olarak tutulur.

export type Cinsiyet = 'erkek' | 'kadin'
export type AktiviteSeviyesi = 'hareketsiz' | 'az' | 'orta' | 'yuksek' | 'cok_yuksek'
export type Hedef = 'kilo_ver' | 'koru' | 'kilo_al'

export interface Makrolar {
  kcal: number
  protein: number // gram
  karbonhidrat: number // gram
  yag: number // gram
}

export interface Profil {
  id: 'ben'
  cinsiyet: Cinsiyet
  dogumYili: number
  boyCm: number
  kiloKg: number
  aktivite: AktiviteSeviyesi
  hedef: Hedef
  /** 'otomatik': hedefler profil bilgilerinden hesaplanır; 'elle': kullanıcı girer */
  hedefModu: 'otomatik' | 'elle'
  gunlukHedef: Makrolar
}

export interface KiloKaydi {
  id?: number
  tarih: string
  kiloKg: number
}

export type OgunTuru = 'kahvalti' | 'ogle' | 'aksam' | 'ara'

export interface Yiyecek {
  id?: number
  ad: string
  birim: 'g' | 'porsiyon'
  /** makroların karşılık geldiği miktar, örn. 100 g ya da 1 porsiyon */
  referansMiktar: number
  makrolar: Makrolar
  favori: boolean
}

export interface Ogun {
  id?: number
  tarih: string
  tur: OgunTuru
}

export interface OgunKalemi extends Makrolar {
  id?: number
  ogunId: number
  tarih: string
  yiyecekId?: number
  ad: string
  miktar: number
  birim: 'g' | 'porsiyon'
  kaynak: 'elle' | 'ai'
}

export type KasGrubu =
  | 'gogus' | 'sirt' | 'omuz' | 'on_kol' | 'arka_kol' | 'bacak' | 'kalca' | 'karin' | 'tum_vucut' | 'kardiyo'
export type EgzersizTuru = 'agirlik' | 'vucut_agirligi' | 'kardiyo'

export interface Egzersiz {
  id?: number
  ad: string
  kasGrubu: KasGrubu
  tur: EgzersizTuru
}

export interface Program {
  id?: number
  ad: string
  aktif: boolean
}

export interface ProgramGunu {
  id?: number
  programId: number
  sira: number
  ad: string
}

export interface ProgramEgzersizi {
  id?: number
  programGunuId: number
  egzersizId: number
  sira: number
  hedefSet: number
  hedefTekrar: string // örn. "8-12"
}

export interface Antrenman {
  id?: number
  tarih: string
  programGunuId?: number
  baslangic: number // epoch ms
  bitis?: number
  not?: string
}

export interface AntrenmanSeti {
  id?: number
  antrenmanId: number
  egzersizId: number
  setNo: number
  kiloKg?: number
  tekrar?: number
  rpe?: number
  sureSn?: number
  mesafeKm?: number
}

export interface Ayar {
  anahtar: string
  deger: unknown
}
