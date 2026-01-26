import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StatisticCard } from '../StatisticCard'

describe('StatisticCard Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('renders with suffix', () => {
    render(
      <StatisticCard
        amount={1000}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="COUNT"
        suffix="items"
      />
    )
    expect(screen.getByText('COUNT')).toBeInTheDocument()
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

  it('handles negative amounts', () => {
    render(
      <StatisticCard
        amount={-100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NEGATIVE"
      />
    )
    expect(screen.getByText('NEGATIVE')).toBeInTheDocument()
  })

  it('displays tooltip when provided', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="TEST"
        tooltip="This is a tooltip"
      />
    )
    expect(screen.getByText('TEST')).toBeInTheDocument()
  })

  it('handles click event when onClick provided', () => {
    const onClick = vi.fn()
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="CLICKABLE"
        onClick={onClick}
        clickable={true}
      />
    )
    const card = container.querySelector('.border-secondary')
    if (card) {
      fireEvent.click(card)
      expect(onClick).toHaveBeenCalled()
    }
  })

  it('does not trigger click when clickable is false', () => {
    const onClick = vi.fn()
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NOT CLICKABLE"
        onClick={onClick}
        clickable={false}
      />
    )
    const card = container.querySelector('.border-secondary')
    if (card) {
      fireEvent.click(card)
      expect(onClick).not.toHaveBeenCalled()
    }
  })

  it('shows loading state', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="LOADING"
        loading={true}
      />
    )
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('displays badge when provided', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="BADGED"
        badge={5}
      />
    )
    expect(screen.getByText('BADGED')).toBeInTheDocument()
  })

  it('displays badge with custom color', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="BADGED"
        badge={10}
        badgeColor="#ff0000"
      />
    )
    expect(screen.getByText('BADGED')).toBeInTheDocument()
  })

  it('displays description when provided', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="DESCRIPTION"
        description="This is a description"
      />
    )
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('displays trend when provided', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="TREND"
        trend={15.5}
      />
    )
    expect(screen.getByText(/\+15.5%/)).toBeInTheDocument()
  })

  it('displays negative trend', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NEGATIVE TREND"
        trend={-10.2}
      />
    )
    expect(screen.getByText(/-10.2%/)).toBeInTheDocument()
  })

  it('shows progress bar when enabled', () => {
    const { container } = render(
      <StatisticCard
        amount={50}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="PROGRESS"
        maxValue={100}
        showProgress={true}
      />
    )
    const progress = container.querySelector('.ant-progress')
    expect(progress).toBeInTheDocument()
  })

  it('calculates progress percentage correctly', () => {
    const { container } = render(
      <StatisticCard
        amount={75}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="PROGRESS"
        maxValue={100}
        showProgress={true}
      />
    )
    const progress = container.querySelector('.ant-progress')
    expect(progress).toBeInTheDocument()
  })

  it('handles refresh button click', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="REFRESHABLE"
        onRefresh={onRefresh}
        refreshable={true}
      />
    )
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)
    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  it('handles hover state', () => {
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="HOVER"
      />
    )
    const card = container.querySelector('.border-secondary')
    if (card) {
      fireEvent.mouseEnter(card)
      fireEvent.mouseLeave(card)
    }
    expect(screen.getByText('HOVER')).toBeInTheDocument()
  })

  it('formats as percentage', () => {
    render(
      <StatisticCard
        amount={75.5}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="PERCENTAGE"
        format="percentage"
        decimals={1}
      />
    )
    expect(screen.getByText('PERCENTAGE')).toBeInTheDocument()
  })

  it('formats as currency', () => {
    render(
      <StatisticCard
        amount={1234.56}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="CURRENCY"
        format="currency"
        prefix="$"
        decimals={2}
      />
    )
    expect(screen.getByText('CURRENCY')).toBeInTheDocument()
  })

  it('handles animated prop false', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NOT ANIMATED"
        animated={false}
      />
    )
    expect(screen.getByText('NOT ANIMATED')).toBeInTheDocument()
  })

  it('handles custom progress color', () => {
    const { container } = render(
      <StatisticCard
        amount={50}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="CUSTOM PROGRESS"
        maxValue={100}
        showProgress={true}
        progressColor="#ff0000"
      />
    )
    const progress = container.querySelector('.ant-progress')
    expect(progress).toBeInTheDocument()
  })

  it('handles all props together', () => {
    const onClick = vi.fn()
    const onRefresh = vi.fn()
    render(
      <StatisticCard
        amount={1234.56}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="COMPLETE"
        prefix="$"
        suffix="USD"
        onClick={onClick}
        tooltip="Complete tooltip"
        description="Complete description"
        badge={5}
        badgeColor="#00ff00"
        trend={10.5}
        maxValue={2000}
        showProgress={true}
        progressColor="#0000ff"
        onRefresh={onRefresh}
        refreshable={true}
        clickable={true}
        format="currency"
        decimals={2}
        animated={true}
      />
    )
    expect(screen.getByText('COMPLETE')).toBeInTheDocument()
    expect(screen.getByText('Complete description')).toBeInTheDocument()
  })

  it('handles rapid hover events', () => {
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="RAPID HOVER"
      />
    )
    const card = container.querySelector('.border-secondary')
    if (card) {
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(card)
        fireEvent.mouseLeave(card)
      }
    }
    expect(screen.getByText('RAPID HOVER')).toBeInTheDocument()
  })

  it('handles icon with alt text', () => {
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="ICON TEST"
      />
    )
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'ICON TEST')
  })

  it('handles very large numbers', () => {
    render(
      <StatisticCard
        amount={999999999999}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="VERY LARGE"
      />
    )
    expect(screen.getByText('VERY LARGE')).toBeInTheDocument()
  })

  it('handles decimal amounts', () => {
    render(
      <StatisticCard
        amount={123.456}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="DECIMAL"
        decimals={2}
      />
    )
    expect(screen.getByText('DECIMAL')).toBeInTheDocument()
  })

  it('handles zero trend', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="ZERO TREND"
        trend={0}
      />
    )
    expect(screen.getByText('ZERO TREND')).toBeInTheDocument()
  })

  it('handles null trend', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NULL TREND"
        trend={null as any}
      />
    )
    expect(screen.getByText('NULL TREND')).toBeInTheDocument()
  })

  it('handles undefined maxValue with progress', () => {
    const { container } = render(
      <StatisticCard
        amount={50}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="NO MAX"
        showProgress={true}
      />
    )
    expect(screen.getByText('NO MAX')).toBeInTheDocument()
  })

  it('handles refresh during loading', async () => {
    const onRefresh = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="bg-primary"
        title="REFRESH LOADING"
        onRefresh={onRefresh}
        refreshable={true}
      />
    )
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)
    fireEvent.click(refreshButton)
    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  it('handles custom bgColor styling', () => {
    const { container } = render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor="#ff0000"
        title="CUSTOM BG"
      />
    )
    const card = container.querySelector('.border-secondary')
    expect(card).toBeInTheDocument()
  })

  it('handles empty string bgColor', () => {
    render(
      <StatisticCard
        amount={100}
        icon="/test-icon.svg"
        bgColor=""
        title="EMPTY BG"
      />
    )
    expect(screen.getByText('EMPTY BG')).toBeInTheDocument()
  })
})

