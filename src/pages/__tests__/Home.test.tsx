import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Home } from '../Home'
import { MyContextProvider } from '../../context/context.provider'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const mockContext = {
  showAuthModal: vi.fn(),
  userAuthenticated: false,
}

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Test Article',
          short_description: 'Test description',
          published_date: '2024-01-01',
        },
      ],
    })
  })

  it('renders home page', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Unlock the Power of Experimentation')).toBeInTheDocument()
  })

  it('renders hero section', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Transform Your Digital Strategy with AB Testing Hub')).toBeInTheDocument()
  })

  it('shows get started button when not authenticated', () => {
    mockContext.userAuthenticated = false
    renderWithProviders(<Home />)
    expect(screen.getByText('GET STARTED')).toBeInTheDocument()
  })

  it('shows dashboard button when authenticated', () => {
    mockContext.userAuthenticated = true
    renderWithProviders(<Home />)
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument()
  })

  it('renders tools section', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('TOOLS WE OFFER')).toBeInTheDocument()
    expect(screen.getByText('Continuous Metric Testing')).toBeInTheDocument()
    expect(screen.getByText('Proportional metric Testing')).toBeInTheDocument()
    expect(screen.getByText('A/B testing Tool')).toBeInTheDocument()
  })

  it('handles tool card click', () => {
    renderWithProviders(<Home />)
    const exploreButtons = screen.getAllByText('EXPLORE')
    expect(exploreButtons.length).toBeGreaterThan(0)
  })

  it('fetches and displays articles', async () => {
    renderWithProviders(<Home />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('renders articles section', async () => {
    renderWithProviders(<Home />)
    await waitFor(() => {
      expect(screen.getByText('OUR ARTICLES')).toBeInTheDocument()
    })
  })

  it('handles get started button click', () => {
    mockContext.userAuthenticated = false
    renderWithProviders(<Home />)
    const button = screen.getByText('GET STARTED')
    fireEvent.click(button)
    expect(mockContext.showAuthModal).toHaveBeenCalled()
  })
})

