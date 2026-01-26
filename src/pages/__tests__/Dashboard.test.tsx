import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from '../Dashboard'
import { MyContextProvider } from '../../context/context.provider'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const mockContext = {
  conversionSymbol: '$',
}

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

vi.mock('../../components/Confirmation', () => ({
  confirmation: vi.fn().mockResolvedValue(true),
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Test Hypothesis',
          description: 'Test Description',
          status: 'INPR',
          revenue_impact: 1000,
        },
      ],
    })
  })

  it('renders dashboard', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('TOTAL HYPOTHESIS:')).toBeInTheDocument()
    })
  })

  it('renders statistic cards', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('TOTAL HYPOTHESIS:')).toBeInTheDocument()
      expect(screen.getByText('IN PROGRESS:')).toBeInTheDocument()
      expect(screen.getByText('RESULT SUMMARY:')).toBeInTheDocument()
      expect(screen.getByText('OVERALL REVENUE:')).toBeInTheDocument()
    })
  })

  it('renders new hypothesis button', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('NEW HYPOTHESIS')).toBeInTheDocument()
    })
  })

  it('fetches tests data on mount', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('renders search input', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })
  })
})

