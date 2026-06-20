import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotify } from '../NotificationContext'

const baseUrl = 'http://localhost:3001/anecdotes'

export const useAnecdoteQuery = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: async () => {
      const res = await fetch(baseUrl)
      if (!res.ok) {
        throw new Error('Server communication problem')
      }
      return res.json()
    },
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: async (content) => {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 })
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create anecdote')
      }
      return res.json()
    },
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      notify(error.message)
    }
  })

  const voteMutation = useMutation({
    mutationFn: async (anecdote) => {
      const res = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 })
      })
      return res.json()
    },
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${updatedAnecdote.content}' voted`)
    }
  })

  return {
    anecdotes: anecdotesQuery.data,
    isLoading: anecdotesQuery.isPending,
    isError: anecdotesQuery.isError,
    createAnecdote: createMutation.mutate,
    voteAnecdote: voteMutation.mutate
  }
}