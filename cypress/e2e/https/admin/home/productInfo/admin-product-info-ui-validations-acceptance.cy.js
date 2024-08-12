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
    cy.get(dashboardSelectors.homeTabs).contains(label.productInfo).click()
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.product)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.version)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.productEdition)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.active)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.licenseType)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.licenseStatus)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.expiration)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.registrationCode)
    cy.checkTextVisibility(dashboardSelectors.productInfoColName, label.delete)
  })
})
