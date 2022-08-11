import Goals from "@pages/Goals";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { worker } from "../../../src/mocks/worker";

const withReactQuery = (ui: ReactNode) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe("Goal page", () => {
  beforeEach(() => {
    cy.mount(withReactQuery(<Goals />));
  });

  it('should render correct statistics', () => {
  });
});