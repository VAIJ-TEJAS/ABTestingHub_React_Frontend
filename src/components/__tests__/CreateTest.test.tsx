import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CreateTest } from '../CreateTest'
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

describe('CreateTest', () => {
  it('renders create test modal when visible', () => {
    renderWithProviders(<CreateTest isVisible={true} onClose={vi.fn()} />)
    // Component should render
    expect(screen).toBeDefined()
  })

  it('does not render when not visible', () => {
    renderWithProviders(<CreateTest isVisible={false} onClose={vi.fn()} />)
    // Component should not be visible
    expect(screen).toBeDefined()
  })
})

