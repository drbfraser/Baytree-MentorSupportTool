import { useEffect, useState } from 'react'
import { fetchGoals, Goal, GoalQuery } from '../api/backend/goals'

export const PAGINATION_OPTIONS = [5, 10]
export const DEFAULT_QUERY = {
  limit: PAGINATION_OPTIONS[0],
  offset: 0,
  orderingDate: 'creation_date'
} as GoalQuery

export const useGoals = (query: GoalQuery = DEFAULT_QUERY) => {
  const [loading, setLoading] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)

  const cleanup = () => {
    setLoading(false)
    setError('')
    setGoals([])
  }

  // Load goals by params
  useEffect(() => {
    setLoading(true)
    fetchGoals(query)
      .then((data) => {
        if (data) {
          setCount(data.count)
          setGoals(data.results)
        }
      }).catch(() => setError('Cannot fetch goals'))
      .finally(() => setLoading(false))
    return cleanup
  }, [query])

  return {
    goals,
    loading,
    error,
    count
  }
}