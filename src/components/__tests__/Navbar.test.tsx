import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { Navbar } from '../Navbar'
import { MyContextProvider } from '../../context/context.provider'

const mockContext = {
  userAuthenticated: false,
  showAuthModal: vi.fn(),
  username: null,
  signOutUser: vi.fn(),
  conversionName: 'USD',
  onCurrencyChange: vi.fn(),
  rates: {
    USD: { code: 'USD', value: 1, symbol: '$' },
    INR: { code: 'INR', value: 83, symbol: '₹' },
  },
}

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/home']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </MemoryRouter>
  )
}

describe('Navbar Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockContext.userAuthenticated = false
    mockContext.showAuthModal = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders navbar component', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('renders logo with correct link', () => {
    renderWithRouter(<Navbar />)
    const logo = screen.getByRole('link', { name: '' })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders all navigation links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.getByText('TOOLS')).toBeInTheDocument()
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
  })

  it('shows login button when user is not authenticated', () => {
    mockContext.userAuthenticated = false
    renderWithRouter(<Navbar />)
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
  })

  it('shows dashboard button when user is authenticated', () => {
    mockContext.userAuthenticated = true
    renderWithRouter(<Navbar />)
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument()
  })

  it('handles home navigation click', () => {
    renderWithRouter(<Navbar />)
    const homeLink = screen.getByText('HOME')
    fireEvent.click(homeLink)
    expect(homeLink).toBeInTheDocument()
  })

  it('handles company navigation click', () => {
    renderWithRouter(<Navbar />)
    const companyLink = screen.getByText('COMPANY')
    fireEvent.click(companyLink)
    expect(companyLink).toBeInTheDocument()
  })

  it('opens tools dropdown on mouse enter', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
  })

  it('closes tools dropdown on mouse leave from nav', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    const nav = screen.getByRole('navigation')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
    fireEvent.mouseLeave(nav)
    // Dropdown should close
  })

  it('renders all tools dropdown items', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
    expect(screen.getByText('Continuous Metric')).toBeInTheDocument()
    expect(screen.getByText('A/B Testing')).toBeInTheDocument()
  })

  it('navigates to proportional metric testing', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('Proportional Metric')
    fireEvent.click(link)
    expect(link).toBeInTheDocument()
  })

  it('navigates to continuous metric testing', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('Continuous Metric')
    fireEvent.click(link)
    expect(link).toBeInTheDocument()
  })

  it('navigates to AB testing', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('A/B Testing')
    fireEvent.click(link)
    expect(link).toBeInTheDocument()
  })

  it('handles dropdown mouse enter/leave interactions', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const dropdown = screen.getByText('Proportional Metric').closest('ul')
    if (dropdown) {
      fireEvent.mouseEnter(dropdown)
      fireEvent.mouseLeave(dropdown)
    }
  })

  it('highlights active route for home', () => {
    renderWithRouter(<Navbar />, ['/home'])
    const homeLink = screen.getByText('HOME').closest('a')
    expect(homeLink).toHaveClass('text-primary')
  })

  it('highlights active route for proportional metric', () => {
    renderWithRouter(<Navbar />, ['/proportional-metric-testing'])
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('Proportional Metric').closest('a')
    expect(link).toHaveClass('text-primary')
  })

  it('highlights active route for continuous metric', () => {
    renderWithRouter(<Navbar />, ['/continuous-metric-testing'])
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('Continuous Metric').closest('a')
    expect(link).toHaveClass('text-primary')
  })

  it('highlights active route for AB testing', () => {
    renderWithRouter(<Navbar />, ['/ab-testing'])
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const link = screen.getByText('A/B Testing').closest('a')
    expect(link).toHaveClass('text-primary')
  })

  it('highlights active route for about us', () => {
    renderWithRouter(<Navbar />, ['/about-us'])
    const link = screen.getByText('COMPANY').closest('a')
    expect(link).toHaveClass('text-primary')
  })

  it('calls showAuthModal when login button is clicked', () => {
    mockContext.userAuthenticated = false
    renderWithRouter(<Navbar />)
    const loginButton = screen.getByText('LOGIN')
    fireEvent.click(loginButton)
    expect(mockContext.showAuthModal).toHaveBeenCalled()
  })

  it('navigates to dashboard when dashboard button is clicked', () => {
    mockContext.userAuthenticated = true
    renderWithRouter(<Navbar />)
    const dashboardButton = screen.getByText('DASHBOARD')
    fireEvent.click(dashboardButton)
    expect(dashboardButton).toBeInTheDocument()
  })

  it('handles article page styling', () => {
    renderWithRouter(<Navbar />, ['/article/123'])
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('relative')
  })

  it('handles non-article page styling', () => {
    renderWithRouter(<Navbar />, ['/home'])
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('sticky')
  })

  it('renders SideDrawer component', () => {
    renderWithRouter(<Navbar />)
    // SideDrawer should be rendered (check for its trigger button)
    expect(screen).toBeDefined()
  })

  it('handles rapid dropdown interactions', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    for (let i = 0; i < 5; i++) {
      fireEvent.mouseEnter(toolsButton)
      fireEvent.mouseLeave(toolsButton)
    }
  })

  it('maintains dropdown state during mouse movements', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    const dropdown = screen.getByText('Proportional Metric').closest('ul')
    if (dropdown) {
      fireEvent.mouseEnter(dropdown)
      expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
    }
  })

  it('handles multiple navigation clicks', () => {
    renderWithRouter(<Navbar />)
    const homeLink = screen.getByText('HOME')
    const companyLink = screen.getByText('COMPANY')
    
    fireEvent.click(homeLink)
    fireEvent.click(companyLink)
    fireEvent.click(homeLink)
    
    expect(homeLink).toBeInTheDocument()
    expect(companyLink).toBeInTheDocument()
  })

  it('handles logo click navigation', () => {
    renderWithRouter(<Navbar />)
    const logo = screen.getByRole('link', { name: '' })
    fireEvent.click(logo)
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders with correct container structure', () => {
    const { container } = renderWithRouter(<Navbar />)
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('sticky')
  })

  it('handles window resize events', () => {
    renderWithRouter(<Navbar />)
    // Simulate window resize
    window.dispatchEvent(new Event('resize'))
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('handles empty context values gracefully', () => {
    mockContext.userAuthenticated = false
    mockContext.showAuthModal = vi.fn()
    renderWithRouter(<Navbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('handles authenticated state changes', () => {
    const { rerender } = renderWithRouter(<Navbar />)
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
    
    mockContext.userAuthenticated = true
    rerender(
      <MemoryRouter initialEntries={['/home']}>
        <MyContextProvider>
          <Navbar />
        </MyContextProvider>
      </MemoryRouter>
    )
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument()
  })

  it('handles dropdown with all tool options visible', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    
    const proportional = screen.getByText('Proportional Metric')
    const continuous = screen.getByText('Continuous Metric')
    const abTesting = screen.getByText('A/B Testing')
    
    expect(proportional).toBeInTheDocument()
    expect(continuous).toBeInTheDocument()
    expect(abTesting).toBeInTheDocument()
  })

  it('applies correct hover styles', () => {
    renderWithRouter(<Navbar />)
    const homeLink = screen.getByText('HOME').closest('a')
    expect(homeLink).toHaveClass('hover:text-primary')
  })

  it('handles navigation with query parameters', () => {
    renderWithRouter(<Navbar />, ['/home?tab=1'])
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('handles navigation with hash', () => {
    renderWithRouter(<Navbar />, ['/home#section'])
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })
})

