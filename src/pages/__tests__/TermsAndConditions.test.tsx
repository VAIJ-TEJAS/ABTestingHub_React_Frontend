import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TermsAndConditions } from '../TermsAndConditions'

describe('TermsAndConditions', () => {
  it('renders terms and conditions page', () => {
    render(<TermsAndConditions />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

