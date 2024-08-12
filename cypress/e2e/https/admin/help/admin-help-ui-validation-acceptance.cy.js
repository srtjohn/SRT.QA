import label from '../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../selectors/dashboard-selectors.json'

/**
 * @description
 * This spec file contains test to verify help menu options
 *
 * @file
 * cypress/e2e/admin/server/help/admin-help-ui-validation-acceptance.cy.js
 *
 * @breadcrumb
 * Login > help
 *
 * @assertions
 * verify that help menu should have options
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

describe('Login > help', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that help menu should have options', () => {
    cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.helpEnglish).click()
    cy.checkTextVisibility(dashboardSelectors.dashBoardList, label.contents)
    cy.checkTextVisibility(dashboardSelectors.dashBoardList, label.releaseNotes)
    cy.checkTextVisibility(dashboardSelectors.dashBoardList, label.versionHistory)
  })
})
