import loginSelectors from '../../../../../../selectors/login-selectors.json'
/**
 * @description
 * This spec file contains tests to ensure that the submit button is enabled or disable based on the
 * credentials's validity
 *
 * @file
 * ui/cypress/e2e/login/submit-button/submit-button-working-acceptance.cy.js
 *
 * @breadcrumb
 * - Login to the application
 *
 * @assertions
 * - To verify that submit button is enabled only if user provide both username and password
 * - To verify that submit button is disabled if user does not provide both username and password
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid and invalid credentials
 *
 */

describe('Submit Button Functionality Test', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach(() => {
    cy.postApiLogin()
    cy.waitForNetworkIdlePrepare({
      method: 'POST',
      pattern: '**WebApi/Login**',
      alias: 'postApiLogin',
      log: false
    })
    cy.visit(adminData.adminBaseUrl)
  })

  it('verify that submit button is enabled only if user provide both username and password', () => {
    cy.get(loginSelectors.inputUsername).type(userInfo.username)
    cy.get(loginSelectors.inputPassword).type(userInfo.password)
    cy.get(loginSelectors.loginButton).should('be.enabled')
  })

  it('verify that submit button is disabled if user does not provide both username and password', () => {
    cy.get(loginSelectors.loginButton).should('be.disabled')
  })
})
