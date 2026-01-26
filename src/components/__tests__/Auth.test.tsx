import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Auth } from '../Auth'
import { MyContextProvider } from '../../context/context.provider'
import axios from 'axios'

vi.mock('axios')
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }: any) => (
    <button onClick={() => onSuccess?.({ credential: 'test-token' })}>
      Google Login
    </button>
  ),
}))

const mockContext = {
  setUsername: vi.fn(),
  signInUser: vi.fn(),
  hideAuthModal: vi.fn(),
  authModalOpen: true,
}

vi.mock('../../context/context.provider', async () => {
  const actual = await vi.importActual('../../context/context.provider')
  return {
    ...actual,
    Context: () => mockContext,
  }
})

describe('Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(axios.post).mockResolvedValue({
      data: { token: 'test-token', user: { username: 'testuser' } },
    })
  })

  it('renders login form by default', () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    expect(screen.getByText('Login to AB Testing Hub')).toBeInTheDocument()
  })

  it('switches to signup view', () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    const signupLink = screen.getByText('Signup')
    fireEvent.click(signupLink)
    expect(screen.getByText('Signup to AB Testing Hub')).toBeInTheDocument()
  })

  it('switches back to signin view', () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    const signupLink = screen.getByText('Signup')
    fireEvent.click(signupLink)
    const signinLink = screen.getByText('Sign In')
    fireEvent.click(signinLink)
    expect(screen.getByText('Login to AB Testing Hub')).toBeInTheDocument()
  })

  it('handles form submission for sign in', async () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByText('LOGIN')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled()
    })
  })

  it('validates required fields', async () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    
    const submitButton = screen.getByText('LOGIN')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please input your email!')).toBeInTheDocument()
    })
  })

  it('handles Google login success', async () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    
    const googleButton = screen.getByText('Google Login')
    fireEvent.click(googleButton)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled()
    })
  })

  it('shows terms modal when clicking terms link', () => {
    render(
      <MyContextProvider>
        <Auth />
      </MyContextProvider>
    )
    
    const signupLink = screen.getByText('Signup')
    fireEvent.click(signupLink)
    
    const termsLink = screen.getByText('Terms and Conditions')
    fireEvent.click(termsLink)

    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument()
  })
})

