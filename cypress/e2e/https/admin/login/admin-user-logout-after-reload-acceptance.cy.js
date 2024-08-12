import label from '../../../../../cypress/fixtures/label.json'
/**
 * @description
 * This spec file contains tests to ensure that user stays logged in the site after a reload
 *
 * @file
 * ui/cypress/e2e/login/user-logout-after-reload-acceptance.cy.js
 *
 * @breadcrumb
 * - Login to the application
 *
 * @assertions
 * - To verify that admin user stays login after reloading a website
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

// This is skipped because the functionality of session login is coming in next release

describe.skip('Login Functionality Test', () => {
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
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.waitForNetworkIdle('@postApiLogin', 500).its('callCount').should('equal', 1)
    cy.url().should('include', label.homeUrlText)
    cy.waitApiResponseStatusCode('@postApiLogin', 200)
  })

  it('Reload the server', () => {
    cy.reload()
    cy.contains(label.login).should('not.be.visible')
  })
})
