import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('renders footer component', () => {
    render(<Footer />)
    expect(screen.getByText('YOUR STATISTICAL SOLUTION HUB')).toBeInTheDocument()
  })

  it('renders tools section', () => {
    render(<Footer />)
    expect(screen.getByText('TOOLS')).toBeInTheDocument()
    expect(screen.getByText('Continuous Metric Testing Tool')).toBeInTheDocument()
    expect(screen.getByText('Proportional Metric Testing Tool')).toBeInTheDocument()
    expect(screen.getByText('A/B Testing Calculator')).toBeInTheDocument()
  })

  it('renders company section', () => {
    render(<Footer />)
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2024 - All Rights Reserved/)).toBeInTheDocument()
  })

  it('has correct links for tools', () => {
    render(<Footer />)
    const continuousLink = screen.getByText('Continuous Metric Testing Tool').closest('a')
    expect(continuousLink).toHaveAttribute('href', '/continuous-metric-testing')
  })

  it('has correct links for company', () => {
    render(<Footer />)
    const aboutLink = screen.getByText('About Us').closest('a')
    expect(aboutLink).toHaveAttribute('href', '/about-us')
  })
})

