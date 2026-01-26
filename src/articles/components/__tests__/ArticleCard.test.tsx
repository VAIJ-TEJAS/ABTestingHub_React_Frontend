import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ArticleCard } from '../ArticleCard'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticleCard', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article Title',
    short_description: 'Test description',
    published_date: '2024-01-01',
    cover_image: {
      id: 1,
      image: '/test-image.jpg',
    },
    author: {
      id: 1,
      name: 'Test Author',
      picture: '/author.jpg',
      role: 'Writer',
    },
  }

  it('renders article card', () => {
    renderWithRouter(<ArticleCard {...mockArticle} />)
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('renders article title', () => {
    renderWithRouter(<ArticleCard {...mockArticle} />)
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('renders author name', () => {
    renderWithRouter(<ArticleCard {...mockArticle} />)
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('handles missing title', () => {
    renderWithRouter(<ArticleCard id={1} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('handles missing author', () => {
    renderWithRouter(<ArticleCard id={1} title="Test" />)
    expect(screen.getByText('author')).toBeInTheDocument()
  })

  it('renders link to article', () => {
    renderWithRouter(<ArticleCard {...mockArticle} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/article/1')
  })
})

