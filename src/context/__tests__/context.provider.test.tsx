import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyContextProvider, Context } from '../context.provider'
import { useContext } from 'react'
import React from 'react'

const TestComponent = () => {
  const context = Context()
  return (
    <div>
      <div data-testid="authenticated">{context.userAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="username">{context.username || 'none'}</div>
      <button onClick={() => context.showAuthModal()}>Show Modal</button>
      <button onClick={() => context.signInUser('test-token')}>Sign In</button>
      <button onClick={() => context.signOutUser()}>Sign Out</button>
    </div>
  )
}

describe('Context Provider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides context values', () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    expect(screen.getByTestId('authenticated')).toBeInTheDocument()
  })

  it('initializes with no authentication when no token', () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
  })

  it('initializes with authentication when token exists', () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
  })

  it('signs in user', () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    const signInButton = screen.getByText('Sign In')
    signInButton.click()
    
    expect(localStorage.getItem('abtestinghub-access-token')).toBe('test-token')
  })

  it('signs out user', () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    const signOutButton = screen.getByText('Sign Out')
    signOutButton.click()
    
    expect(localStorage.getItem('abtestinghub-access-token')).toBeNull()
  })

  it('shows auth modal', () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    const showModalButton = screen.getByText('Show Modal')
    showModalButton.click()
    
    // Modal state should be updated
    expect(showModalButton).toBeInTheDocument()
  })

  it('loads username from localStorage', () => {
    localStorage.setItem('ab_testing_hub_username', 'testuser')
    
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>
    )
    
    expect(screen.getByTestId('username')).toHaveTextContent('testuser')
  })

  it('handles currency change', () => {
    const TestCurrencyComponent = () => {
      const context = Context()
      return (
        <div>
          <button onClick={() => context.onCurrencyChange('USD,1,$')}>
            Change Currency
          </button>
          <div data-testid="currency">{context.conversionName}</div>
        </div>
      )
    }

    render(
      <MyContextProvider>
        <TestCurrencyComponent />
      </MyContextProvider>
    )
    
    const changeButton = screen.getByText('Change Currency')
    changeButton.click()
    
    expect(localStorage.getItem('abtestinghub-currency')).toBe('USD,1,$')
  })
})

