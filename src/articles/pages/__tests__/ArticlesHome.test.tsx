import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticlesHome } from '../ArticlesHome'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticlesHome', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: [] })
  })

  it('renders articles home page', async () => {
    renderWithRouter(<ArticlesHome />)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })
})

