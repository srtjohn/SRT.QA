import label from '../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../../../../selectors/navigation/left-navigation-selectors.json'
import htmlSelectors from '../../../../../../selectors/htlm-tag-selectors.json'

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
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.homeTabs).contains(label.productInfo).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(htmlSelectors.tableBody).eq(2).within(() => {
      cy.get(htmlSelectors.tableData).eq(4).contains(label.download).should('have.attr', 'href').and('eq', label.ReleaseNotesURL)
      cy.get(htmlSelectors.tableData).eq(5).contains(label.download).should('have.attr', 'href').and('eq', label.downloadURL)
    })
  })
})
