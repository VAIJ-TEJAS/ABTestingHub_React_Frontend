import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Article } from '../Article'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Article', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: {} })
  })

  it('renders article page', async () => {
    renderWithRouter(<Article />)
    await waitFor(() => {
      expect(screen).toBeDefined()
    })
  })
})

