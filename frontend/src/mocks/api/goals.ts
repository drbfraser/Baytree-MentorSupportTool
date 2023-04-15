import type { DefaultBodyType, PathParams } from 'msw'
import { rest } from 'msw'
import type {
  GoalCategory,
  GoalDetail,
  GoalResult,
  GoalStatistics
} from '../../api/goals'
import { API_BASE_URL } from '../../api/url'
import { mockGoalCateogories, mockGoals } from '../data/goals'

const goalUrl = `${API_BASE_URL}/goals`

export const getGoalCategories = rest.get<
  DefaultBodyType,
  PathParams<string>,
  GoalCategory[]
>(`${goalUrl}/categories`, (req, res, ctx) => {
  return res(ctx.json(mockGoalCateogories))
})

export const getGoals = rest.get<
  DefaultBodyType,
  PathParams<string>,
  GoalResult
>(goalUrl, (req, res, ctx) => {
  return res(
    ctx.json({
      count: mockGoals.length,
      results: mockGoals
    })
  )
})

export const getStatistics = rest.get<
  DefaultBodyType,
  PathParams<string>,
  GoalStatistics
>(`${goalUrl}/statistics`, (req, res, ctx) => {
  const active = mockGoals.filter((g) => g.status === 'IN PROGRESS').length
  const complete = mockGoals.filter((g) => g.status === 'ACHIEVED').length

  return res(ctx.json({ active, complete }))
})

export const getGoalDetail = rest.get<
  DefaultBodyType,
  PathParams<'goalId'>,
  GoalDetail
>(`${goalUrl}/:goalId/`, (req, res, ctx) => {
  const goalId = +req.params.goalId
  if (goalId < 1 || goalId > mockGoals.length) return res(ctx.status(404))
  return res(ctx.json(mockGoals[goalId - 1]))
})

const goalHandlers = [getGoalCategories, getGoals, getStatistics, getGoalDetail]
export default goalHandlers
