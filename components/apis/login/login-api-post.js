/**
 * postApiLogin
 *
 * When navigating to the dashboard page, it helps to wait for the request to the Login endpoint
 *
 * @example
 * cy.postApiLogin()
 * cy.waitForNetworkIdle('@postApiLogin', 200);
 */

Cypress.Commands.add('postApiLogin', (variable = 'postApiLogin') => {
  Cypress.log({
    name: 'postApiLogin'
  })

  cy.intercept('POST', '**WebApi/Login**').as(variable)
})
