import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  fetchAnecdotes: async () => {
    const res = await fetch(baseUrl)
    const data = await res.json()
    set({ anecdotes: data })
  },
  createAnecdote: async (content) => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, votes: 0 })
    })
    const data = await res.json()
    set((state) => ({ anecdotes: state.anecdotes.concat(data) }))
  },
  voteAnecdote: async (id) => {
    set((state) => {
      const anecdoteToVote = state.anecdotes.find((a) => a.id === id)
      const updated = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      
      fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })

      return {
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a))
      }
    })
  },
  deleteAnecdote: async (id) => {
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
    set((state) => ({
      anecdotes: state.anecdotes.filter((a) => a.id !== id)
    }))
  },
  setFilter: (filter) => set({ filter })
}))

export default useAnecdoteStore