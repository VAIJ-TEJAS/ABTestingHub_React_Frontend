import { describe, it, expect } from 'vitest'
import type { ITest, TestStatus, CalculationStatus } from '../test.types'

describe('Test Types', () => {
  it('defines ITest interface correctly', () => {
    const test: ITest = {
      id: 1,
      name: 'Test Hypothesis',
      description: 'Test Description',
      status: 'INPR' as TestStatus,
    }
    expect(test.id).toBe(1)
    expect(test.name).toBe('Test Hypothesis')
  })

  it('defines TestStatus enum correctly', () => {
    const status: TestStatus = 'APPR'
    expect(status).toBe('APPR')
  })

  it('defines CalculationStatus enum correctly', () => {
    const status: CalculationStatus = CalculationStatus.SAVED
    expect(status).toBe(CalculationStatus.SAVED)
  })
})

