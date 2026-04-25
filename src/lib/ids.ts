export function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}_${crypto.randomUUID()}`
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/gi, '-').replace(/^-+|-+$/g, '')
}
