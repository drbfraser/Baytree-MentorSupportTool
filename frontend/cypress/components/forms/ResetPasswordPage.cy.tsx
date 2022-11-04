import ResetPassword from "@pages/ResetPassword";

describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.mountWithRouter(<ResetPassword />)
  })

  it('should render title', () => {
    cy.contains('reset password', {matchCase: false})
  })

  it('should render disabled button', () => {
    cy.get('button').should('be.disabled')
  })
})