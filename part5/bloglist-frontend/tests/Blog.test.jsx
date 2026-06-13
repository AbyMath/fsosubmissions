import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'

describe('Blog component', () => {
  const mockBlog = {
    id: '123',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      id: 'user123',
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockHandlers = {
    onLike: vi.fn(),
    onDelete: vi.fn()
  }

  it('renders blog title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={mockBlog}
        onLike={mockHandlers.onLike}
        onDelete={mockHandlers.onDelete}
        isOwner={true}
      />
    )

    expect(screen.getByText('Test Blog')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.queryByText('http://test.com')).not.toBeInTheDocument()
    expect(screen.queryByText(/likes\s*5/)).not.toBeInTheDocument()
  })

  it('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={mockBlog}
        onLike={mockHandlers.onLike}
        onDelete={mockHandlers.onDelete}
        isOwner={true}
      />
    )

    const viewButton = screen.getByRole('button', { name: 'view' })
    await user.click(viewButton)

    expect(screen.getByText('http://test.com')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onLike handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={mockBlog}
        onLike={mockHandlers.onLike}
        onDelete={mockHandlers.onDelete}
        isOwner={true}
      />
    )

    const viewButton = screen.getByRole('button', { name: 'view' })
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandlers.onLike).toHaveBeenCalledTimes(2)
  })

  it('shows delete button only for owner', () => {
    const { rerender } = render(
      <Blog
        blog={mockBlog}
        onLike={mockHandlers.onLike}
        onDelete={mockHandlers.onDelete}
        isOwner={true}
      />
    )

    const viewButton = screen.getByRole('button', { name: 'view' })
    expect(viewButton).toBeInTheDocument()

    rerender(
      <Blog
        blog={mockBlog}
        onLike={mockHandlers.onLike}
        onDelete={mockHandlers.onDelete}
        isOwner={false}
      />
    )

    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })
})