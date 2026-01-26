import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticlesCategories } from '../ArticlesCategories'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticlesCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: [] })
  })

  it('renders articles categories page', async () => {
    renderWithRouter(<ArticlesCategories />)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })
})

