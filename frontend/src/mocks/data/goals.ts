import type { GoalCategory, Goal } from '../../api/goals'

export const mockGoalCateogories: GoalCategory[] = [
  {
    id: 1,
    name: 'Personal Development'
  },
  {
    id: 2,
    name: 'Academic Engagement'
  },
  {
    id: 3,
    name: 'Improve Employability'
  }
]

export const mockGoals: Goal[] = [
  {
    id: 1,
    categories: [mockGoalCateogories[0], mockGoalCateogories[1]],
    title: 'Improve Maths',
    description: 'Solve complex algebra problems',
    creation_date: '2022-07-15',
    goal_review_date: '2022-08-01',
    last_update_date: '2022-08-01',
    status: 'ACHIEVED'
  },
  {
    id: 2,
    categories: [mockGoalCateogories[0], mockGoalCateogories[2]],
    title: 'Improve communication in English',
    description: 'I want to fluently comminucate with others in English',
    creation_date: '2022-07-15',
    goal_review_date: '2022-08-15',
    last_update_date: '2022-08-15',
    status: 'IN PROGRESS'
  }
]
