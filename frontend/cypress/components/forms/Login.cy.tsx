import Login from "@pages/Login";

describe('Login page', () => {
  beforeEach(() => {
    cy.mountWithRouter(<Login />)
  })

  it('should render title', () => {
    cy.contains('log in to mentor portal', {matchCase: false})
  })

  it('should render disabled button', () => {
    cy.get('button').should('be.disabled')
  })

  it('should enable button after typing', () => {
    cy.get('input[name="email"]').type("abc@example.com")
    cy.get('input[name="password"]').type("abcd123")
    cy.get('button').should('be.enabled')
  })
})