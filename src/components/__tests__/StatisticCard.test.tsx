import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatisticCard } from '../StatisticCard'

describe('StatisticCard', () => {
  it('renders statistic card with title', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="TEST TITLE"
      />
    )
    expect(screen.getByText('TEST TITLE')).toBeInTheDocument()
  })

  it('renders with amount', () => {
    render(
      <StatisticCard
        amount={1234}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="TEST TITLE"
      />
    )
    expect(screen.getByText('TEST TITLE')).toBeInTheDocument()
  })

  it('renders with prefix', () => {
    render(
      <StatisticCard
        amount={1000}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="REVENUE"
        prefix="$"
      />
    )
    expect(screen.getByText('REVENUE')).toBeInTheDocument()
  })

  it('handles zero amount', () => {
    render(
      <StatisticCard
        amount={0}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="ZERO TEST"
      />
    )
    expect(screen.getByText('ZERO TEST')).toBeInTheDocument()
  })

  it('handles large amounts', () => {
    render(
      <StatisticCard
        amount={999999}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="LARGE AMOUNT"
      />
    )
    expect(screen.getByText('LARGE AMOUNT')).toBeInTheDocument()
  })
})

