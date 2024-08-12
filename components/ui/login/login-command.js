import loginSelectors from '../../../selectors/login-selectors.json'
import label from '../../../cypress/fixtures/label.json'
/**
 * Login Command
 *
 * This command is used for login
 *
 * This command takes login URL and admin credentials as parameter
 *
 * @location
 * Login
 *
 * @params
 * @param {required} URL  // A variable containing url
 * @param {required} username  // A variable containing username
 * @param {required} password  // A variable containing password
 *
 * @example
 * cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
 */

Cypress.Commands.add('login', (baseUrl, username, password) => {
//   const baseUrl = Cypress.env('baseUrl')}
  cy.postApiLogin()
  cy.waitForNetworkIdlePrepare({
    method: 'POST',
    pattern: '**WebApi/Login**',
    alias: 'postApiLogin',
    log: false
  })
  cy.visit(Cypress.env('baseUrl'))
  let loginURL
  if (baseUrl.includes(':')) {
    loginURL = `${Cypress.env('baseUrl')}${baseUrl}`
  } else {
    loginURL = `${Cypress.env('baseUrl')}`
  }
  // Visit the URL
  cy.visit(loginURL)
  // Find and fill in the username and password fields
  cy.get(loginSelectors.inputUsername).type(username)
  cy.get(loginSelectors.inputPassword).type(password)
  cy.get(loginSelectors.loginButton).contains(label.login).click()
  // cy.waitForNetworkIdle('@postApiLogin', 500).its('callCount').should('equal', 1)
  cy.get(loginSelectors.profileIcon).should('be.visible')
  cy.waitApiResponseStatusCode('@postApiLogin', 200)
})
