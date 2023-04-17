import GoalsStatistics from '@components/goals/GoalsStatistics'
import { GoalProvider } from '@context/GoalContext'
import goalHandlers from '@mocks/api/goals'
import { mockGoals } from '@mocks/data/goals'
import { QueryClient, QueryClientProvider } from 'react-query'

describe('Goal staticstics', () => {
  beforeEach(() => {
    const client = new QueryClient()
    cy.mount(
      <QueryClientProvider client={client}>
        <GoalProvider>
          <GoalsStatistics />
        </GoalProvider>
      </QueryClientProvider>
    )
  })

  it('should render corectly if the API is error', () => {
    cy.findByRole('button', { name: /all/i })
      .findByTestId('goal-count')
      .contains(0)
    cy.findByRole('button', { name: /active/i })
      .findByTestId('goal-count')
      .contains(0)
    cy.findByRole('button', { name: /complete/i })
      .findByTestId('goal-count')
      .contains(0)
  })

  it('should render correctly if the API is not error', () => {
    cy.window().then((window) => window.msw.worker.use(...goalHandlers))
    cy.findByRole('button', { name: /all/i })
      .findByTestId('goal-count')
      .contains(mockGoals.length)
    cy.findByRole('button', { name: /active/i })
      .findByTestId('goal-count')
      .contains(mockGoals.filter((g) => g.status === 'IN PROGRESS').length)
    cy.findByRole('button', { name: /complete/i })
      .findByTestId('goal-count')
      .contains(mockGoals.filter((g) => g.status === 'ACHIEVED').length)
  })
})
