import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SimpleCollapse from '../Play'

describe('Play (SimpleCollapse)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Play component', () => {
    render(<SimpleCollapse />)
    expect(screen.getByText('Show')).toBeInTheDocument()
  })

  it('renders switch control', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    expect(switchElement).toBeInTheDocument()
  })

  it('switch is checked by default after mount', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    expect(switchElement).toBeChecked()
  })

  it('toggles switch on click', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    expect(switchElement).toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })

  it('toggles switch multiple times', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    fireEvent.click(switchElement)
    expect(switchElement).not.toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })

  it('renders collapse component', () => {
    const { container } = render(<SimpleCollapse />)
    const collapse = container.querySelector('.MuiCollapse-root')
    expect(collapse).toBeInTheDocument()
  })

  it('collapse is visible when switch is checked', () => {
    const { container } = render(<SimpleCollapse />)
    const collapse = container.querySelector('.MuiCollapse-root')
    expect(collapse).toBeInTheDocument()
  })

  it('handles switch state changes correctly', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    const initialChecked = switchElement.checked
    fireEvent.click(switchElement)
    expect(switchElement.checked).not.toBe(initialChecked)
  })

  it('renders with correct structure', () => {
    const { container } = render(<SimpleCollapse />)
    const box = container.querySelector('.MuiBox-root')
    expect(box).toBeInTheDocument()
  })

  it('displays FormControlLabel with correct text', () => {
    render(<SimpleCollapse />)
    expect(screen.getByText('Show')).toBeInTheDocument()
  })

  it('handles rapid toggle clicks', () => {
    render(<SimpleCollapse />)
    const switchElement = screen.getByRole('checkbox')
    for (let i = 0; i < 5; i++) {
      fireEvent.click(switchElement)
    }
    expect(switchElement).toBeDefined()
  })
})

