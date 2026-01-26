import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamCard } from '../TeamCard'

describe('TeamCard', () => {
  it('renders team card', () => {
    render(<TeamCard name="Test Name" role="Test Role" picture="/test.jpg" />)
    expect(screen.getByText('Test Name')).toBeInTheDocument()
  })

  it('renders role', () => {
    render(<TeamCard name="Test Name" role="Developer" picture="/test.jpg" />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })
})

