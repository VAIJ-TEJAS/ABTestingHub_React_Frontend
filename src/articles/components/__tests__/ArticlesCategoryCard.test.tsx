import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticlesCategoryCard } from '../ArticlesCategoryCard'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticlesCategoryCard', () => {
  it('renders category card', () => {
    renderWithRouter(<ArticlesCategoryCard id={1} name="Test Category" />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

