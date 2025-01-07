import label from '../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../selectors/dashboard-selectors.json'
import loginSelectors from '../../../../../selectors/login-selectors.json'
/**
 * @description
 * This spec file contains test to verify that profile menu on dashboard has three options
 *
 * @file
 * cypress/e2e/admin/server/profile/admin-profile-ui-validation-acceptance.cy
 *
 * @breadcrumb
 * Login > {existing server} > profile
 *
 * @assertions
 * verify that profile menu should have options
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

describe('Login > {existing server} > profile', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that profile menu should have options', () => {
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(loginSelectors.profileIcon).first().click({ force: true })
    cy.checkTextVisibility(dashboardSelectors.dashboardButton, label.myProfile)
    cy.checkTextVisibility(dashboardSelectors.dashboardButton, label.changePassword)
    cy.checkTextVisibility(dashboardSelectors.dashboardButton, label.signOut)
  })
})
