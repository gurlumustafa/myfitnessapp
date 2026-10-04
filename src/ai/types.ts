import type { Makrolar, OgunTuru } from '../db/types'

// AI katmanının sözleşmesi. Uygulama hangi modelin kullanıldığını bilmez, sadece bu arayüzle konuşur.
// İlk sürümde tek adaptör Ollama (3. aşamada yazılacak).

export interface MakroTahmini extends Makrolar {
  ad: string
  miktar: number
  birim: 'g' | 'porsiyon'
}

export interface GunBaglami {
  tarih: string
  hedef: Makrolar
  tuketilen: Makrolar
  kalan: Makrolar
  yenenler: { ogun: OgunTuru; ad: string; miktar: number; birim: string }[]
  tercihler?: string
}

export interface OgunOnerisi {
  baslik: string
  aciklama: string
  kalemler: MakroTahmini[]
}

export interface AIProvider {
  readonly ad: string
  baglantiyiTestEt(): Promise<boolean>
  makroTahminEt(ogunMetni: string): Promise<MakroTahmini[]>
  ogunOner(baglam: GunBaglami): Promise<OgunOnerisi[]>
}
