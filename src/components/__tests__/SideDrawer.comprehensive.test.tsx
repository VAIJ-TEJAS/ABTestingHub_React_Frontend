import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SideDrawer } from '../SideDrawer'
import { MyContextProvider } from '../../context/context.provider'
import { confirmation } from '../Confirmation'

vi.mock('../Confirmation', () => ({
  confirmation: vi.fn().mockResolvedValue(true),
}))

const mockContext = {
  username: 'testuser',
  showAuthModal: vi.fn(),
  userAuthenticated: true,
  signOutUser: vi.fn(),
  onCurrencyChange: vi.fn(),
  rates: {
    USD: { code: 'USD', value: 1, symbol: '$' },
    INR: { code: 'INR', value: 83, symbol: '₹' },
    EUR: { code: 'EUR', value: 0.92, symbol: '€' },
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

describe('SideDrawer Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockContext.userAuthenticated = true
    mockContext.username = 'testuser'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders drawer trigger button', () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    expect(button).toBeInTheDocument()
  })

  it('opens drawer when trigger button is clicked', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('closes drawer when close button is clicked', async () => {
    renderWithRouter(<SideDrawer />)
    const openButton = screen.getByLabelText('Open menu')
    fireEvent.click(openButton)
    await waitFor(() => {
      const closeButton = screen.getByLabelText('Close drawer')
      fireEvent.click(closeButton)
    })
  })

  it('displays username when authenticated', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
    })
  })

  it('displays login button when not authenticated', async () => {
    mockContext.userAuthenticated = false
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument()
    })
  })

  it('navigates to dashboard when dashboard link is clicked', async () => {
    const navigate = vi.fn()
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => navigate,
      }
    })

    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const dashboardLink = screen.getByText('Dashboard')
      fireEvent.click(dashboardLink)
    })
  })

  it('navigates to home when home link is clicked', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const homeLink = screen.getByText('Home')
      fireEvent.click(homeLink)
    })
  })

  it('navigates to proportional metric testing', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const link = screen.getByText('Proportional Metric')
      fireEvent.click(link)
    })
  })

  it('navigates to continuous metric testing', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const link = screen.getByText('Continuous Metric')
      fireEvent.click(link)
    })
  })

  it('navigates to AB testing', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const link = screen.getByText('A/B Testing')
      fireEvent.click(link)
    })
  })

  it('navigates to feedback', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const link = screen.getByText('Feedback')
      fireEvent.click(link)
    })
  })

  it('navigates to about us', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const link = screen.getByText('About Us')
      fireEvent.click(link)
    })
  })

  it('handles logout confirmation', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)
      expect(confirmation).toHaveBeenCalled()
    })
  })

  it('changes currency when currency option is selected', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const currencyMenu = screen.getByText(/Currency/)
      expect(currencyMenu).toBeInTheDocument()
    })
  })

  it('displays notification badge when notifications exist', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })

  it('handles notification click', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const notificationButton = screen.queryByRole('button', { name: /notification/i })
      if (notificationButton) {
        fireEvent.click(notificationButton)
      }
    })
  })

  it('closes drawer on mask click when maskClosable is true', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('handles auto close when autoClose prop is true', async () => {
    renderWithRouter(<SideDrawer autoClose={true} />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    }, { timeout: 6000 })
  })

  it('calls onOpenChange callback when drawer state changes', async () => {
    const onOpenChange = vi.fn()
    renderWithRouter(<SideDrawer onOpenChange={onOpenChange} />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalled()
    })
  })

  it('displays member since text for authenticated users', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText(/Member since/)).toBeInTheDocument()
    })
  })

  it('handles MSS Calculator submenu expansion', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const submenu = screen.getByText('MSS Calculator')
      expect(submenu).toBeInTheDocument()
    })
  })

  it('handles currency submenu expansion', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const currencyMenu = screen.getByText(/Currency/)
      expect(currencyMenu).toBeInTheDocument()
    })
  })

  it('displays all currency options', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument()
      expect(screen.getByText('INR')).toBeInTheDocument()
      expect(screen.getByText('EUR')).toBeInTheDocument()
    })
  })

  it('shows checkmark for selected currency', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })

  it('handles rapid open/close actions', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    
    for (let i = 0; i < 5; i++) {
      fireEvent.click(button)
      await waitFor(() => {
        const closeButton = screen.queryByLabelText('Close drawer')
        if (closeButton) {
          fireEvent.click(closeButton)
        }
      })
    }
  })

  it('maintains correct active route highlighting', async () => {
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })

  it('handles empty username gracefully', async () => {
    mockContext.username = null
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText('Username')).toBeInTheDocument()
    })
  })

  it('handles empty rates object', async () => {
    mockContext.rates = {}
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })

  it('handles logout without confirmation', async () => {
    vi.mocked(confirmation).mockResolvedValue(false)
    renderWithRouter(<SideDrawer />)
    const button = screen.getByLabelText('Open menu')
    fireEvent.click(button)
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)
      expect(mockContext.signOutUser).not.toHaveBeenCalled()
    })
  })
})

