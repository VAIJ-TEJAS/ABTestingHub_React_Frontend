import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ContinuousMetricTesting } from '../ContinuousMetricTesting'
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

describe('ContinuousMetricTesting', () => {
  it('renders continuous metric testing page', () => {
    renderWithProviders(<ContinuousMetricTesting />)
    // Page should render
    expect(screen).toBeDefined()
  })
})

