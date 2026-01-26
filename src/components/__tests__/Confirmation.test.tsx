import { describe, it, expect } from 'vitest'
import { confirmation } from '../Confirmation'

describe('Confirmation', () => {
  it('exports confirmation function', () => {
    expect(typeof confirmation).toBe('function')
  })

  it('confirmation is callable', () => {
    expect(() => confirmation('Test message')).not.toThrow()
  })
})

