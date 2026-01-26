import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PrivacyPolicy } from '../PrivacyPolicy'

describe('PrivacyPolicy', () => {
  it('renders privacy policy page', () => {
    render(<PrivacyPolicy />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

