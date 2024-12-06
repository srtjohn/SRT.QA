import label from '../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../../../../selectors/navigation/left-navigation-selectors.json'

/**
 * @description
 * This spec file contains test to verify product info tab data
 *
 * @file
 * cypress/e2e/admin/server/productinfo/admin-product-info-ui-validations-acceptance.cy
 *
 * @breadcrumb
 * Login > home > product info tab
 *
 * @assertions
 * verify product info tab columns name
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

describe('Login > home > product info tab', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify product info tab columns name', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.home).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.homeTabs).contains(label.productInfo).click()
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.product)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.version)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.releaseNotes)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.releaseDate)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.licenseType)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.downloadUrlLabel)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.expiration)
    cy.checkTextVisibility(dashboardSelectors.contentHeader, label.registrationCode)
  })
})
