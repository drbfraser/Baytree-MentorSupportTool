import { Login } from "../../src/pages";

describe('Login page', () => {
  it('should render correctly', () => {
    cy.mountWithRouter(<Login />)
    cy.contains('log in to mentor portal', {matchCase: false})
    cy.get('button').should('be.disabled')
  })

  it('should enable button after typing', () => {
    cy.mountWithRouter(<Login />)
    cy.get('input[name="email"]').type("abc@example.com")
    cy.get('input[name="password"]').type("abcd123")
    cy.get('button').should('be.enabled')
  })
})