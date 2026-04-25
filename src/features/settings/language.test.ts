import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from './settings-types'

describe('language setting', () => {
  it('defaults to English and supports Korean', () => {
    expect(DEFAULT_SETTINGS.language).toBe('en')
    const next = { ...DEFAULT_SETTINGS, language: 'ko' as const }
    expect(next.language).toBe('ko')
  })
})
