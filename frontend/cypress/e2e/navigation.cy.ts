describe('Navigation', () => {
  it('should redirect to log in page', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/login')
  })
})
