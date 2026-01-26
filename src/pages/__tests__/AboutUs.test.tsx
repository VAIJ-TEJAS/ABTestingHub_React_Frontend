import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutUs } from '../AboutUs'

describe('AboutUs', () => {
  it('renders about us page', () => {
    render(<AboutUs />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('renders mission section', () => {
    render(<AboutUs />)
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
  })

  it('renders what we do section', () => {
    render(<AboutUs />)
    expect(screen.getByText('What We Do')).toBeInTheDocument()
  })

  it('displays mission text', () => {
    render(<AboutUs />)
    expect(screen.getByText(/democratize AB testing/)).toBeInTheDocument()
  })
})

