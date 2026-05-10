import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppLogo, LogoMark } from './AppLogo'

describe('AppLogo', () => {
  it('renders the ULTodo brand lockup by default', () => {
    render(<AppLogo />)

    expect(screen.getByRole('img', { name: 'ULTodo logo' })).toBeInTheDocument()
    expect(screen.getByText('ULTodo')).toBeInTheDocument()
  })

  it('can render the logo mark without the wordmark', () => {
    render(<AppLogo showWordmark={false} />)

    expect(screen.getByRole('img', { name: 'ULTodo logo' })).toBeInTheDocument()
    expect(screen.queryByText('ULTodo')).not.toBeInTheDocument()
  })

  it('uses the warm productivity mark geometry', () => {
    const { container } = render(<LogoMark />)

    expect(container.querySelector('circle')).toBeInTheDocument()
    expect(container.querySelectorAll('path')).toHaveLength(3)
  })
})
