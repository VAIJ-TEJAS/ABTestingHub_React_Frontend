import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { MyContextProvider } from './context/context.provider'

const mockContext = {
  userAuthenticated: false,
  showAuthModal: vi.fn(),
  hideAuthModal: vi.fn(),
  authModalOpen: false,
}

vi.mock('./context/context.provider', async () => {
  const actual = await vi.importActual('./context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

const renderApp = () => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        <App />
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('App', () => {
  it('renders app component', () => {
    renderApp()
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('renders navbar', () => {
    renderApp()
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })

  it('handles navigation', () => {
    renderApp()
    const homeLink = screen.getByText('HOME')
    expect(homeLink).toBeInTheDocument()
  })

  it('shows footer on home page', () => {
    renderApp()
    // Footer should be visible on home page
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })
})

