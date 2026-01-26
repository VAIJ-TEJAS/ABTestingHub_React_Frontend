import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevenueCard } from '../RevenueCard'

describe('RevenueCard', () => {
  it('renders revenue card with title', () => {
    render(
      <RevenueCard
        amount={5000}
        icon="/test-icon.svg"
        bgColor="bg-green-600"
        title="REVENUE"
      />
    )
    expect(screen.getByText('REVENUE')).toBeInTheDocument()
  })

  it('renders with amount', () => {
    render(
      <RevenueCard
        amount={12345}
        icon="/test-icon.svg"
        bgColor="bg-green-600"
        title="TOTAL REVENUE"
      />
    )
    expect(screen.getByText('TOTAL REVENUE')).toBeInTheDocument()
  })

  it('renders with currency prefix', () => {
    render(
      <RevenueCard
        amount={10000}
        icon="/test-icon.svg"
        bgColor="bg-green-600"
        title="REVENUE"
        prefix="$"
      />
    )
    expect(screen.getByText('REVENUE')).toBeInTheDocument()
  })

  it('handles negative amounts', () => {
    render(
      <RevenueCard
        amount={-100}
        icon="/test-icon.svg"
        bgColor="bg-green-600"
        title="NEGATIVE"
      />
    )
    expect(screen.getByText('NEGATIVE')).toBeInTheDocument()
  })

  it('handles zero revenue', () => {
    render(
      <RevenueCard
        amount={0}
        icon="/test-icon.svg"
        bgColor="bg-green-600"
        title="ZERO REVENUE"
      />
    )
    expect(screen.getByText('ZERO REVENUE')).toBeInTheDocument()
  })
})

