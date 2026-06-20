import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach } from 'vitest'
import App from '../App'
import AnecdoteList from './AnecdoteList'
import Filter from './Filter'
import useAnecdoteStore from '../useAnecdoteStore'

const mockAnecdotes = [
  { id: '1', content: 'First anecdote text', votes: 2 },
  { id: '2', content: 'Second anecdote text', votes: 5 },
  { id: '3', content: 'Third anecdote text', votes: 0 }
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockAnecdotes),
    })
  ))
})

test('6.12: state is initialized with backend anecdotes', async () => {
  render(<App />)
  const item = await screen.findByText('First anecdote text')
  expect(item).toBeDefined()
  const items = useAnecdoteStore.getState().anecdotes
  expect(items).toHaveLength(3)
})

test('6.13: component displays anecdotes sorted by votes', () => {
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes })
  render(<AnecdoteList />)
  const divs = screen.getAllByText(/anecdote text/)
  expect(divs[0].textContent).toBe('Second anecdote text')
  expect(divs[1].textContent).toBe('First anecdote text')
  expect(divs[2].textContent).toBe('Third anecdote text')
})

test('6.14: component displays a properly filtered list of anecdotes', async () => {
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes })
  render(
    <div>
      <Filter />
      <AnecdoteList />
    </div>
  )
  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'Second')
  expect(screen.queryByText('First anecdote text')).toBeNull()
  expect(screen.getByText('Second anecdote text')).toBeDefined()
})

test('6.15: voting increases the number of votes', async () => {
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes })
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ id: '1', content: 'First anecdote text', votes: 3 }),
    })
  ))
  render(<AnecdoteList />)
  const buttons = screen.getAllByRole('button', { name: 'vote' })
  await userEvent.click(buttons[1])
  const updatedAnecdotes = useAnecdoteStore.getState().anecdotes
  const targeted = updatedAnecdotes.find(a => a.id === '1')
  expect(targeted.votes).toBe(3)
})