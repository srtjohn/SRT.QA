import label from '../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains tests to ensure that user is able to login successfully.
 *
 * @file
 * ui/cypress/e2e/login/login-valid-credentials-acceptance.cy.js
 *
 * @breadcrumb
 * - Login to the application
 *
 * @assertions
 * - To verify that admin user can login successfully with correct credentials
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
describe('Login Functionality Test', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that admin user can login successfully with correct credentials', () => {
    cy.contains(label.home).should('be.visible')
  })
})
