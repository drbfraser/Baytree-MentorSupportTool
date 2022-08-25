import GoalListItem from "@components/goals/GoalListItem";
import { GoalProvider } from "@context/GoalContext";
import goalHandlers from "@mocks/api/goals";
import { mockGoals } from "@mocks/data/goals";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

beforeEach(() => {
  cy.window().should((window) => window.msw.worker.use(...goalHandlers));
});

const customMount = (ui: ReactNode) => {
  const client = new QueryClient();
  cy.mount(
    <QueryClientProvider client={client}>
      <GoalProvider>
        {ui}
      </GoalProvider>
    </QueryClientProvider>
  )
}

describe("Goal without details", () => {
  it('should render title', () => {
    const goal = mockGoals[0];
    customMount(
      <GoalListItem goal={goal} />
    );
    cy.contains(goal.title);
    cy.contains(goal.status);
  });
});

describe("Active goal details", () => {
  const goal = mockGoals[0];
  
  beforeEach(() => {
    customMount(
      <GoalListItem goal={goal} expanded />
    );
  })
  
  it('should render title', () => {
    cy.contains(goal.title);
    cy.contains("achieved", {matchCase: false});
  });

  it('should contain description', () => {
    cy.contains(goal.description);
  });

  it('should contain categories', () => {
    goal.categories.forEach(category => {
      cy.contains(category.name);
    })
  });

  it('should not contain action buttons', () => {
    cy.get('button.edit-button').should('not.exist');
    cy.get('button.complete-button').should('not.exist');
  })
});

describe("Active goal details", () => {
  const goal = mockGoals[1];
  
  beforeEach(() => {
    customMount(
      <GoalListItem goal={goal} expanded />
    );
  })
  
  it('should render title', () => {
    cy.contains(goal.title);
    cy.contains("in progress", {matchCase: false});
  });

  it('should contain description', () => {
    cy.contains(goal.description);
  });

  it('should contain categories', () => {
    goal.categories.forEach(category => {
      cy.contains(category.name);
    })
  });

  it('should contain action buttons', () => {
    cy.get('button.edit-button').should('exist');
    cy.get('button.complete-button').should('exist');
  })
});