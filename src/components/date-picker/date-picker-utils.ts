export const pad = (n: number) => String(n).padStart(2, '0')

export function fmtDate(d: Date, f: string) {
  return f
    .replace('YYYY', String(d.getFullYear()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()))
}

export function prsDate(s: string, f: string): Date | null {
  if (!s) return null
  if (f.startsWith('YYYY-MM-DD HH')) {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
    if (m) {
      const [_, y, M, d, h, mi, se] = m.map(Number)
      const date = new Date(y, M - 1, d, h, mi, se)
      if (date.getFullYear() === y && date.getMonth() === M - 1 && date.getDate() === d) return date
    }
  }
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) {
    const [_, y, M, d] = m.map(Number)
    const date = new Date(y, M - 1, d)
    if (date.getFullYear() === y && date.getMonth() === M - 1 && date.getDate() === d) return date
  }
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function weekStart(d: Date) {
  const x = new Date(d)
  x.setDate(x.getDate() - x.getDay())
  x.setHours(0, 0, 0, 0)
  return x
}

export function weekNumber(d: Date) {
  const s = weekStart(d)
  const y = new Date(s.getFullYear(), 0, 1)
  return Math.ceil(((s.getTime() - y.getTime()) / 86400000 + 1) / 7)
}

export function calDays(y: number, m: number) {
  const f = new Date(y, m, 1).getDay()
  const p = new Date(y, m, 0).getDate()
  const l = new Date(y, m + 1, 0).getDate()
  const d: { date: Date; cur: boolean }[] = []
  for (let i = f - 1; i >= 0; i--) d.push({ date: new Date(y, m - 1, p - i), cur: false })
  for (let i = 1; i <= l; i++) d.push({ date: new Date(y, m, i), cur: true })
  for (let i = 1; d.length < 42; i++) d.push({ date: new Date(y, m + 1, i), cur: false })
  return d
}

export const WDS = ['日', '一', '二', '三', '四', '五', '六']
export const MNS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
export const QNS = ['第一季度', '第二季度', '第三季度', '第四季度']
