import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import QuestionReview from '../QuestionReview'

describe('QuestionReview', () => {
  it('renders question review component', () => {
    render(<QuestionReview />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

