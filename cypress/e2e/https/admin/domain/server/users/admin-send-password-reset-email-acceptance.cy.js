import label from '../../../../../../fixtures/label.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
/**
 * @description
 * This spec file contains test to verify that admin user can send password reset email
 *
 * @file
 * cypress/e2e/admin/server/users/admin-send-password-reset-email-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing server} > users > edit > send reset password email
 *
 * @assertions
 * To Verify admin can send password reset email
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 * - an existing user should exist for editing
 */

describe('Login > {existing server} > users > edit > send reset password email', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
  })

  it('Verify admin can send password reset email', () => {
    cy.editUser(label.autoUserName, label.sendPassResetEmail, false, label.password)
    cy.get(userSelectors.successMessage).should('be.visible')
  })
})
