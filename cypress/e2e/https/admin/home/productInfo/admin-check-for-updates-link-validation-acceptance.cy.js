import label from '../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../../../../selectors/navigation/left-navigation-selectors.json'

/**
 * @description
 * This spec file contains test to verify check for updates link validation
 *
 * @file
 * cypress\e2e\admin\server\productinfo\admin-check-for-updates-link-validation.cy.js
 *
 * @breadcrumb
 * Login > home > product info tab > check for updates
 *
 * @assertions
 * verify link validation for check for updates
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

describe('Login > home > product info tab > check for updates', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify link validation for check for updates', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.home).click()
    cy.get(dashboardSelectors.homeTabs).contains(label.productInfo).click()
    cy.get(dashboardSelectors.fabLabel).eq(0).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.RelaseNotes).should('have.attr', 'href').and('eq', label.ReleaseNotesURL)
    cy.get(dashboardSelectors.muiTypography).contains(label.download).should('have.attr', 'href').and('eq', label.downloadURL)
  })
})
