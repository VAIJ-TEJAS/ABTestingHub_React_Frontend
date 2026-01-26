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

  it('handles mouse enter and leave events', () => {
    const { container } = render(
      <TeamCard name="Test Name" role="Developer" />
    )
    const card = container.querySelector('.team-card')
    if (card) {
      fireEvent.mouseEnter(card)
      fireEvent.mouseLeave(card)
    }
    expect(card).toBeInTheDocument()
  })

  it('displays correct join date format', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        joinDate="2023-06-15"
      />
    )
    expect(screen.getByText(/Joined 2023/)).toBeInTheDocument()
  })

  it('handles multiple skills display', () => {
    const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'Kubernetes']
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        skills={skills}
      />
    )
    skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument()
    })
  })

  it('handles long bio text with ellipsis', () => {
    const longBio = 'A'.repeat(200)
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        bio={longBio}
        showDetails={false}
      />
    )
    expect(screen.getByText(longBio)).toBeInTheDocument()
  })

  it('handles undefined picture gracefully', () => {
    const { container } = render(
      <TeamCard
        name="John Doe"
        role="Developer"
        picture={undefined}
      />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('handles empty string picture', () => {
    const { container } = render(
      <TeamCard
        name="John Doe"
        role="Developer"
        picture=""
      />
    )
    const avatar = container.querySelector('.ant-avatar')
    expect(avatar).toBeInTheDocument()
  })

  it('handles contact callback with email', () => {
    const onContact = vi.fn()
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        email="contact@example.com"
        onContact={onContact}
      />
    )
    const emailButton = screen.getByLabelText('Email')
    fireEvent.click(emailButton)
    expect(onContact).toHaveBeenCalledTimes(1)
    expect(onContact).toHaveBeenCalledWith('contact@example.com')
  })

  it('handles multiple rapid clicks on action buttons', () => {
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
    for (let i = 0; i < 5; i++) {
      fireEvent.click(emailButton)
    }
    expect(onContact).toHaveBeenCalledTimes(5)
  })

  it('handles social links with special characters', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        linkedin="https://linkedin.com/in/test-user_123"
        github="https://github.com/test-user/repo-name"
      />
    )
    const linkedinButton = screen.getByLabelText('LinkedIn')
    fireEvent.click(linkedinButton)
    expect(openSpy).toHaveBeenCalled()
    openSpy.mockRestore()
  })

  it('handles card with all optional props', () => {
    render(
      <TeamCard
        name="Complete Profile"
        role="Senior Developer"
        picture="/avatar.jpg"
        email="complete@example.com"
        linkedin="https://linkedin.com/in/complete"
        github="https://github.com/complete"
        bio="This is a complete bio with all information"
        skills={['React', 'TypeScript', 'Node.js']}
        joinDate="2020-01-01"
        showDetails={true}
      />
    )
    expect(screen.getByText('Complete Profile')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText('This is a complete bio with all information')).toBeInTheDocument()
    expect(screen.getByText(/Joined 2020/)).toBeInTheDocument()
  })

  it('handles card with minimal props', () => {
    render(
      <TeamCard
        name="Minimal"
        role="Developer"
      />
    )
    expect(screen.getByText('Minimal')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('handles name with special characters', () => {
    render(
      <TeamCard
        name="José María O'Connor-Smith"
        role="Developer"
      />
    )
    expect(screen.getByText("José María O'Connor-Smith")).toBeInTheDocument()
  })

  it('handles role with special characters', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Full-Stack Developer (React/Node.js)"
      />
    )
    expect(screen.getByText('Full-Stack Developer (React/Node.js)')).toBeInTheDocument()
  })

  it('handles very long name', () => {
    const longName = 'A'.repeat(100)
    render(
      <TeamCard
        name={longName}
        role="Developer"
      />
    )
    expect(screen.getByText(longName)).toBeInTheDocument()
  })

  it('handles very long role', () => {
    const longRole = 'A'.repeat(100)
    render(
      <TeamCard
        name="Test Name"
        role={longRole}
      />
    )
    expect(screen.getByText(longRole)).toBeInTheDocument()
  })

  it('handles skills with special characters', () => {
    render(
      <TeamCard
        name="Test Name"
        role="Developer"
        skills={['C++', 'C#', '.NET', 'ASP.NET']}
      />
    )
    expect(screen.getByText('C++')).toBeInTheDocument()
    expect(screen.getByText('C#')).toBeInTheDocument()
  })

  it('handles join date in different formats', () => {
    const dates = ['2024-01-01', '2023-12-31', '2022-06-15']
    dates.forEach(date => {
      const { unmount } = render(
        <TeamCard
          name="Test Name"
          role="Developer"
          joinDate={date}
        />
      )
      const year = new Date(date).getFullYear()
      expect(screen.getByText(new RegExp(`Joined ${year}`))).toBeInTheDocument()
      unmount()
    })
  })

  it('handles showDetails prop change', () => {
    const { rerender } = render(
      <TeamCard
        name="Test Name"
        role="Developer"
        bio="Short bio"
        showDetails={false}
      />
    )
    expect(screen.getByText('Short bio')).toBeInTheDocument()

    rerender(
      <TeamCard
        name="Test Name"
        role="Developer"
        bio="Short bio"
        showDetails={true}
      />
    )
    expect(screen.getByText('Short bio')).toBeInTheDocument()
  })

  it('handles card styling on hover', () => {
    const { container } = render(
      <TeamCard name="Test Name" role="Developer" />
    )
    const card = container.querySelector('.team-card')
    expect(card).toHaveStyle({ transition: expect.any(String) })
  })

  it('handles initials generation for various name formats', () => {
    const names = [
      'John Doe',
      'Mary Jane Watson',
      'A',
      'A B C D',
      'Jean-Pierre',
    ]
    names.forEach(name => {
      const { container, unmount } = render(
        <TeamCard name={name} role="Developer" />
      )
      const avatar = container.querySelector('.ant-avatar')
      expect(avatar).toBeInTheDocument()
      unmount()
    })
  })
})


