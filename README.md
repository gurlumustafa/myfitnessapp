# myfitnessapp

Kişisel makro ve antrenman takip uygulaması. iPhone'da ana ekrana eklenen bir PWA olarak çalışır; veriler telefonun içinde (IndexedDB) durur, sunucu yoktur.

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:5173 (aynı Wi-Fi'deki telefondan da açılır)
npm test           # birim testleri
npm run build      # tip kontrolü + üretim derlemesi (dist/)
npm run lint
```

## Yayına alma (Cloudflare Pages)

- Build komutu: `npm run build`
- Çıktı klasörü: `dist`

iPhone'da Safari ile adresi açıp **Paylaş > Ana Ekrana Ekle** ile kurulur.

## Aşamalar

1. ✅ Temel: proje iskeleti, veritabanı şeması, sekme menüsü, profil ve hedefler
2. Beslenme: öğün girişi, sık kullanılan yiyecekler
3. AI: Ollama ile makro tahmini ve öğün önerisi
4. Antrenman: egzersizler, programlar, antrenman kaydı
5. Raporlar: günlük, haftalık, aylık
6. Kurulum ve cilalama: veri yedeği, iyileştirmeler
