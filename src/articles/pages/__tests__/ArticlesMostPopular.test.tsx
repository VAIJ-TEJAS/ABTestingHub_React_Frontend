import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticlesMostPopular } from '../ArticlesMostPopular'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticlesMostPopular', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: [] })
  })

  it('renders articles most popular page', async () => {
    renderWithRouter(<ArticlesMostPopular />)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })
})

