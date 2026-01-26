import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from '../Navbar'
import { MyContextProvider } from '../../context/context.provider'

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => ({
      userAuthenticated: false,
      showAuthModal: vi.fn(),
    }),
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

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navbar component', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('renders logo', () => {
    renderWithRouter(<Navbar />)
    const logo = screen.getByRole('link', { name: '' })
    expect(logo).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.getByText('TOOLS')).toBeInTheDocument()
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
  })

  it('shows login button when user is not authenticated', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
  })

  it('handles navigation click', () => {
    renderWithRouter(<Navbar />)
    const homeLink = screen.getByText('HOME')
    fireEvent.click(homeLink)
    expect(homeLink).toBeInTheDocument()
  })

  it('handles dropdown hover', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
  })

  it('renders tools dropdown items', () => {
    renderWithRouter(<Navbar />)
    const toolsButton = screen.getByText('TOOLS')
    fireEvent.mouseEnter(toolsButton)
    expect(screen.getByText('Proportional Metric')).toBeInTheDocument()
    expect(screen.getByText('Continuous Metric')).toBeInTheDocument()
    expect(screen.getByText('A/B Testing')).toBeInTheDocument()
  })
})

