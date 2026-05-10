import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimerProgressRing } from './PomodoroPage'

const getProgressCircle = (container: HTMLElement) => {
  const circles = container.querySelectorAll('circle')
  const progressCircle = circles.item(1)
  if (!progressCircle) throw new Error('Progress circle not found')
  return progressCircle
}

describe('TimerProgressRing', () => {
  it('starts empty instead of showing a left-side clipped slice', () => {
    const { container } = render(<TimerProgressRing progress={0} />)

    const ring = screen.getByRole('img', { name: 'Timer progress 0%' })
    const progressCircle = getProgressCircle(container)

    expect(ring.getAttribute('style') ?? '').not.toContain('clip')
    expect(progressCircle.getAttribute('stroke-dashoffset')).toBe(progressCircle.getAttribute('stroke-dasharray'))
  })

  it('maps elapsed progress onto a circular arc', () => {
    const { container } = render(<TimerProgressRing progress={0.25} />)

    screen.getByRole('img', { name: 'Timer progress 25%' })
    const progressCircle = getProgressCircle(container)
    const dashArray = Number(progressCircle.getAttribute('stroke-dasharray'))
    const dashOffset = Number(progressCircle.getAttribute('stroke-dashoffset'))

    expect(dashOffset).toBeCloseTo(dashArray * 0.75)
  })
})
