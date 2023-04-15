import ResetPasswordRequest from '@pages/ResetPasswordRequest'

describe('Forgot Password Component Test', () => {
  beforeEach(() => {
    cy.mountWithRouter(<ResetPasswordRequest />)
  })

  it('should render correct title', () => {
    cy.contains('Enter your email', { matchCase: true })
  })

  it('should render disabled button', () => {
    cy.get('button').should('be.disabled')
  })

  it('should render enabled button after typing', () => {
    cy.get('input[name="email"]').type('abc@example.com')
    cy.get('button').should('be.enabled')
  })
})
