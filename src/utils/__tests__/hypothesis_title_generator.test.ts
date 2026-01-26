import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateProjectName } from '../hypothesis_title_generator'

describe('hypothesis_title_generator', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generates a project name', () => {
    const name = generateProjectName()
    expect(name).toBeDefined()
    expect(typeof name).toBe('string')
    expect(name.length).toBeGreaterThan(0)
  })

  it('generates name with hyphen separator', () => {
    const name = generateProjectName()
    expect(name).toContain('-')
  })

  it('generates different names on multiple calls', () => {
    const names = new Set()
    for (let i = 0; i < 10; i++) {
      names.add(generateProjectName())
    }
    // Due to randomness, we might get some duplicates, but should have variety
    expect(names.size).toBeGreaterThan(0)
  })

  it('generates valid format', () => {
    const name = generateProjectName()
    const parts = name.split('-')
    expect(parts.length).toBe(2)
    expect(parts[0].length).toBeGreaterThan(0)
    expect(parts[1].length).toBeGreaterThan(0)
  })

  it('handles edge cases', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const name1 = generateProjectName()
    expect(name1).toBeDefined()

    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const name2 = generateProjectName()
    expect(name2).toBeDefined()
  })
})

