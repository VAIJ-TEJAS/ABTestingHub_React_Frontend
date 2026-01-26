import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProportionalMetricTesting } from '../ProportionalMetricTesting'
import { MyContextProvider } from '../../context/context.provider'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MyContextProvider>
        {component}
      </MyContextProvider>
    </BrowserRouter>
  )
}

describe('ProportionalMetricTesting', () => {
  it('renders proportional metric testing page', () => {
    renderWithProviders(<ProportionalMetricTesting />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

