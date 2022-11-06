import Login from "@pages/Login";

describe('Login Page Component Test', () => {
  beforeEach(() => {
    cy.mountWithRouter(<Login />)
  })

  it('should render login title', () => {
    cy.contains('Log in to Mentor Portal', {matchCase: true})
  })

  it('should render disabled button', () => {
    cy.get('button').should('be.disabled')
  })
  
  it('should render forgot password button', () => {
    cy.contains("a", "Forgot Password?").should("have.attr", "href", "/ResetPassword");
  })

  it('should enable button after typing', () => {
    cy.get('input[name="email"]').type("abc@example.com")
    cy.get('input[name="password"]').type("abcd123")
    cy.get('button').should('be.enabled')
  })
})