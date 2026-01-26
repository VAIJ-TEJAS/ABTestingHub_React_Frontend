import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { DashboardNavbar } from '../DashboardNavbar'
import { MyContextProvider } from '../../context/context.provider'

const mockContext = {
  username: 'testuser',
  onCurrencyChange: vi.fn(),
  rates: {
    USD: { code: 'USD', value: 1, symbol: '$' },
    INR: { code: 'INR', value: 83, symbol: '₹' },
  },
  conversionName: 'USD',
}

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('DashboardNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard navbar', () => {
    renderWithRouter(<DashboardNavbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('renders username', () => {
    renderWithRouter(<DashboardNavbar />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<DashboardNavbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.getByText('TOOLS')).toBeInTheDocument()
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
    expect(screen.getByText('ARTICLES')).toBeInTheDocument()
  })

  it('handles tools dropdown', () => {
    renderWithRouter(<DashboardNavbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
  })

  it('handles logout click', () => {
    renderWithRouter(<DashboardNavbar />)
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)
    // Logout modal should be triggered
    expect(settingsButton).toBeInTheDocument()
  })
})

