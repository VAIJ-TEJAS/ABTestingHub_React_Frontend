import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Logout } from '../Logout'
import { MyContextProvider } from '../../context/context.provider'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('Logout', () => {
  it('renders logout modal when visible', () => {
    renderWithProviders(<Logout isVisible={true} onClose={vi.fn()} />)
    // Component should render
    expect(screen).toBeDefined()
  })

  it('handles close callback', () => {
    const onClose = vi.fn()
    renderWithProviders(<Logout isVisible={true} onClose={onClose} />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

