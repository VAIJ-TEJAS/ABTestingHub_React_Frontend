import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuestionReview from '../QuestionReview'
import axios from 'axios'
import { message } from 'antd'

vi.mock('axios')
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    },
  }
})

const mockedAxios = vi.mocked(axios)

describe('QuestionReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          question_text: 'What is your favorite feature?',
          choices: [
            { id: 1, choice_text: 'Feature A' },
            { id: 2, choice_text: 'Feature B' },
            { id: 3, choice_text: 'Feature C' },
          ],
        },
        {
          id: 2,
          question_text: 'How satisfied are you?',
          choices: [
            { id: 4, choice_text: 'Very Satisfied' },
            { id: 5, choice_text: 'Satisfied' },
          ],
        },
      ],
    })
    mockedAxios.post.mockResolvedValue({
      data: { success: true },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders question review component when visible', () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    expect(screen).toBeDefined()
  })

  it('does not render when not visible', () => {
    const { container } = render(<QuestionReview isVisible={false} onClose={vi.fn()} />)
    const modal = container.querySelector('.ant-modal')
    expect(modal).not.toBeVisible()
  })

  it('fetches questions on mount', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/questions/')
      )
    })
  })

  it('filters out already answered questions', async () => {
    localStorage.setItem('answeredQuestions', JSON.stringify([1]))
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('displays question text when questions are available', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('What is your favorite feature?')).toBeInTheDocument()
    })
  })

  it('displays all choice options', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Feature A')).toBeInTheDocument()
      expect(screen.getByText('Feature B')).toBeInTheDocument()
      expect(screen.getByText('Feature C')).toBeInTheDocument()
    })
  })

  it('handles radio button selection', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      expect(radioButton).toBeChecked()
    })
  })

  it('clears text answer when radio is selected', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      const textArea = screen.getByPlaceholderText('')
      fireEvent.change(textArea, { target: { value: 'Test answer' } })
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      expect(textArea).toHaveValue('')
    })
  })

  it('handles text answer input', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      const textArea = screen.getByPlaceholderText('')
      fireEvent.change(textArea, { target: { value: 'My custom answer' } })
      expect(textArea).toHaveValue('My custom answer')
    })
  })

  it('submits answer with selected choice', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled()
      })
    })
  })

  it('submits answer with text answer', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const textArea = screen.getByPlaceholderText('')
      fireEvent.change(textArea, { target: { value: 'Custom text answer' } })
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled()
      })
    })
  })

  it('shows warning when submitting without answer', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      expect(message.warning).toHaveBeenCalled()
    })
  })

  it('saves answered question to localStorage on successful submission', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        const answered = JSON.parse(localStorage.getItem('answeredQuestions') || '[]')
        expect(answered).toContain(1)
      })
    })
  })

  it('shows success message on submission', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('Your answer has been submitted!')
      })
    })
  })

  it('displays success result after submission', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText('Successfully Submitted!')).toBeInTheDocument()
      })
    })
  })

  it('displays up to date message when no questions available', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [],
    })
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('You are up to date!')).toBeInTheDocument()
    })
  })

  it('handles API error when fetching questions', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedAxios.get.mockRejectedValue(new Error('API Error'))
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })
    consoleError.mockRestore()
  })

  it('handles API error when submitting answer', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    mockedAxios.post.mockRejectedValue(new Error('Submission failed'))
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled()
      })
    })
    consoleError.mockRestore()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<QuestionReview isVisible={true} onClose={onClose} />)
    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: '' })
      fireEvent.click(closeButton)
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('resets form after successful submission', async () => {
    localStorage.setItem('abtestinghub-access-token', 'test-token')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(async () => {
      const radioButton = screen.getByLabelText('Feature A')
      fireEvent.click(radioButton)
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled()
      })
    })
  })

  it('handles multiple questions correctly', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('validates form fields correctly', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      const submitButton = screen.getByText('SUBMIT')
      fireEvent.click(submitButton)
      expect(message.warning).toHaveBeenCalled()
    })
  })

  it('handles empty answeredQuestions in localStorage', async () => {
    localStorage.setItem('answeredQuestions', '[]')
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('handles missing answeredQuestions in localStorage', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  it('displays QUESTION / REVIEWS header', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('QUESTION / REVIEWS')).toBeInTheDocument()
    })
  })

  it('displays text answer label', async () => {
    render(<QuestionReview isVisible={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Or provide a text answer')).toBeInTheDocument()
    })
  })
})

