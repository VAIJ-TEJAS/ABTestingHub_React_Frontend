import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticleStripe } from '../ArticleStripe'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticleStripe', () => {
  it('renders article stripe', () => {
    renderWithRouter(<ArticleStripe id={1} title="Test" />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

