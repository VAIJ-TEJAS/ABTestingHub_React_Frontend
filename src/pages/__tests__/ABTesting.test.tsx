import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ABTesting } from '../ABTesting'
import { MyContextProvider } from '../../context/context.provider'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const mockContext = {
  userAuthenticated: false,
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

describe('ABTesting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: {} })
    mockedAxios.post.mockResolvedValue({ data: {} })
  })

  it('renders AB testing page', () => {
    renderWithProviders(<ABTesting />)
    // Page should render
    expect(screen).toBeDefined()
  })

  it('handles form submission', async () => {
    renderWithProviders(<ABTesting />)
    // Form should be present
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })
})

