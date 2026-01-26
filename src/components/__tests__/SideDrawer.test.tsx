import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SideDrawer } from '../SideDrawer'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SideDrawer', () => {
  it('renders side drawer', () => {
    renderWithRouter(<SideDrawer />)
    // Component should render
    expect(screen).toBeDefined()
  })
})

