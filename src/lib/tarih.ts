/** Yerel saate göre "YYYY-MM-DD" döndürür (toISOString UTC'ye çevirdiği için kullanılmaz). */
export function tarihMetni(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const g = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${g}`
}
