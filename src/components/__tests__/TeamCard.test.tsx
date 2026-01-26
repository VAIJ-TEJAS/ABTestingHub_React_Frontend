import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TeamCard } from '../TeamCard'

describe('TeamCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders team card with name', () => {
    render(<TeamCard name="Test Name" role="Test Role" picture="/test.jpg" />)
    expect(screen.getByText('Test Name')).toBeInTheDocument()
  })

  it('renders role as tag', () => {
    render(<TeamCard name="Test Name" role="Developer" picture="/test.jpg" />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('renders avatar with picture when provided', () => {
    const { container } = render(
      <TeamCard name="Test Name" role="Developer" picture="/test.jpg" />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('renders avatar with initials when picture not provided', () => {
    const { container } = render(
      <TeamCard name="John Doe" role="Developer" />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('displays bio when provided', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        bio="This is a test bio"
      />
    )
    expect(screen.getByText('This is a test bio')).toBeInTheDocument()
  })

  it('displays skills as tags', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        skills={['React', 'TypeScript', 'Node.js']}
      />
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('displays join date when provided', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        joinDate="2024-01-01"
      />
    )
    expect(screen.getByText(/Joined 2024/)).toBeInTheDocument()
  })

  it('handles email contact click', () => {
    const onContact = vi.fn()
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        email="test@example.com"
        onContact={onContact}
      />
    )
    const emailButton = screen.getByLabelText('Email')
    fireEvent.click(emailButton)
    expect(onContact).toHaveBeenCalledWith('test@example.com')
  })

  it('opens email client when email provided without callback', () => {
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' }

    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        email="test@example.com"
      />
    )
    const emailButton = screen.getByLabelText('Email')
    fireEvent.click(emailButton)

    window.location = originalLocation
  })

  it('opens LinkedIn in new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        linkedin="https://linkedin.com/in/test"
      />
    )
    const linkedinButton = screen.getByLabelText('LinkedIn')
    fireEvent.click(linkedinButton)
    expect(openSpy).toHaveBeenCalledWith('https://linkedin.com/in/test', '_blank')
    openSpy.mockRestore()
  })

  it('opens GitHub in new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        github="https://github.com/test"
      />
    )
    const githubButton = screen.getByLabelText('GitHub')
    fireEvent.click(githubButton)
    expect(openSpy).toHaveBeenCalledWith('https://github.com/test', '_blank')
    openSpy.mockRestore()
  })

  it('handles hover state', () => {
    const { container } = render(
      <TeamCard name="Test Name" role="Developer" />
    )
    const card = container.querySelector('.team-card')
    expect(card).toBeInTheDocument()
  })

  it('shows full bio when showDetails is true', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        bio="This is a very long bio that should be displayed in full when showDetails is true"
        showDetails={true}
      />
    )
    expect(
      screen.getByText(
        'This is a very long bio that should be displayed in full when showDetails is true'
      )
    ).toBeInTheDocument()
  })

  it('handles empty skills array', () => {
    render(<TeamCard name="Test Name" role="Developer" skills={[]} />)
    expect(screen.getByText('Test Name')).toBeInTheDocument()
  })

  it('generates correct initials from name', () => {
    const { container } = render(
      <TeamCard name="John Michael Smith" role="Developer" />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('handles single word name for initials', () => {
    const { container } = render(
      <TeamCard name="John" role="Developer" />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('renders all action buttons when all social links provided', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        email="test@example.com"
        linkedin="https://linkedin.com/test"
        github="https://github.com/test"
      />
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('renders only available action buttons', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        email="test@example.com"
      />
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByLabelText('LinkedIn')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('GitHub')).not.toBeInTheDocument()
  })
})


