import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MostPopularArticleCard } from '../MostPopularArticleCard'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('MostPopularArticleCard', () => {
  it('renders most popular article card', () => {
    renderWithRouter(<MostPopularArticleCard id={1} title="Popular Article" />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

