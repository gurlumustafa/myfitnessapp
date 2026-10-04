# myfitnessapp

Mustafa'nın kişisel fitness uygulaması: iPhone'a "Ana Ekrana Ekle" ile kurulan bir PWA. Sunucu yok; bütün veriler cihazdaki IndexedDB'de.

## Kurallar

- Arayüz metinleri, değişken/fonksiyon adları ve commit mesajları Türkçe.
- Yığın: React + Vite + TypeScript, Tailwind CSS v4, Dexie (IndexedDB), react-router, Zod, Vitest.
- Mobil öncelikli tasarım; ekranlar `max-w-lg` içinde, alt sekme menüsü sabit.
- AI yalnızca Mustafa'nın bilgisayarındaki Ollama ile konuşur (Claude/OpenAI API kullanılmaz). Sözleşme `src/ai/types.ts` içindeki `AIProvider`.
- Tarihler yerel saatle `YYYY-MM-DD` metni (`src/lib/tarih.ts`); `toISOString()` kullanmayın.
- `useLiveQuery` "bulunamadı" ile "yükleniyor"u ayırt edemez; tek kayıt sorgularında `.then((x) => x ?? null)` kullanın.

## Yapı

- `src/db/types.ts`: tüm veri tipleri. `src/db/db.ts`: Dexie şeması. Şema değişince yeni `.version(n)` ekleyin, eskisini değiştirmeyin.
- `src/lib/`: saf hesaplama fonksiyonları (testleri yanında `*.test.ts`).
- `src/pages/`: sekme ekranları. `src/components/`: ortak bileşenler.

## Kontroller

PR açmadan önce: `npm test`, `npm run build`, `npm run lint`.
