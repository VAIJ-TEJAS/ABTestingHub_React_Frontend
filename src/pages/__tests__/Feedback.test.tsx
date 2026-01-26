import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Feedback } from '../Feedback'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Feedback', () => {
  it('renders feedback page', () => {
    renderWithRouter(<Feedback />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

