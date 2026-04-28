import { Globe2, Minus, Plus, SlidersHorizontal, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTaskStore } from '@/features/tasks/task-store'
import type { Language } from '@/features/settings/settings-types'

export function SettingsPage() {
  const { t } = useTranslation()
  const store = useTaskStore()

  const setLanguage = (language: Language) => {
    void store.setSettings({ language })
  }

  return (
    <div className="px-5 pb-8 pt-6 lg:mx-auto lg:max-w-2xl lg:px-8 lg:pt-10">
      <section className="mb-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[.12em] text-ink-3">{t('settings.eyebrow')}</p>
        <h1 className="font-serif text-[38px] italic leading-[.95] tracking-[-.05em] text-ink">{t('settings.title')}</h1>
      </section>

      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent-ink"><Globe2 size={18} /></span>
          <div>
            <h2 className="text-base font-bold text-ink">{t('settings.language')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">{t('settings.languageHint')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--hair)] bg-paper-2 p-1">
          <Button variant={store.settings.language === 'en' ? 'dark' : 'ghost'} onClick={() => setLanguage('en')}>EN · {t('settings.english')}</Button>
          <Button variant={store.settings.language === 'ko' ? 'dark' : 'ghost'} onClick={() => setLanguage('ko')}>KO · {t('settings.korean')}</Button>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-paper-2 text-ink-2"><SlidersHorizontal size={18} /></span>
          <div>
            <h2 className="text-base font-bold text-ink">{t('settings.today')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">{t('settings.todayHint')}</p>
          </div>
        </div>
        <Stepper value={store.settings.todayCount} min={1} max={7} onChange={(todayCount) => store.setSettings({ todayCount })} suffix="" />
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-paper-2 text-ink-2"><Timer size={18} /></span>
          <div>
            <h2 className="text-base font-bold text-ink">{t('settings.pomodoro')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">{t('settings.focusMinutes')} / {t('settings.breakMinutes')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <LabeledStepper label={t('settings.focusMinutes')} value={store.settings.pomodoroMinutes} min={5} max={60} onChange={(pomodoroMinutes) => store.setSettings({ pomodoroMinutes })} suffix={t('common.minutes')} />
          <LabeledStepper label={t('settings.breakMinutes')} value={store.settings.breakMinutes} min={1} max={30} onChange={(breakMinutes) => store.setSettings({ breakMinutes })} suffix={t('common.minutes')} />
        </div>
      </Card>

      <p className="rounded-2xl border border-[var(--hair)] bg-paper px-4 py-3 text-xs leading-relaxed text-ink-3"><strong className="text-ink-2">{t('settings.scope')}.</strong> {t('settings.scopeHint')}</p>
    </div>
  )
}

function LabeledStepper({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void | Promise<unknown> }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper-2 px-3 py-2">
      <span className="text-sm font-semibold text-ink-2">{label}</span>
      <Stepper value={value} min={min} max={max} suffix={suffix} onChange={onChange} />
    </div>
  )
}

function Stepper({ value, min, max, suffix, onChange }: { value: number; min: number; max: number; suffix: string; onChange: (value: number) => void | Promise<unknown> }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="soft" size="icon" onClick={() => onChange(Math.max(min, value - 1))}><Minus size={14} /></Button>
      <span className="min-w-12 text-center font-mono text-sm font-semibold text-ink">{value}{suffix ? ` ${suffix}` : ''}</span>
      <Button variant="soft" size="icon" onClick={() => onChange(Math.min(max, value + 1))}><Plus size={14} /></Button>
    </div>
  )
}
