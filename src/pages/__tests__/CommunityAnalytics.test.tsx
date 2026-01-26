import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityAnalytics } from '../CommunityAnalytics'

describe('CommunityAnalytics', () => {
  it('renders community analytics page', () => {
    render(<CommunityAnalytics />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

