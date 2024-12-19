import label from '../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../../../../selectors/navigation/left-navigation-selectors.json'
import productInfoSelectors from '../../../../../../selectors/productinfo/product-info-selectors.json'
import userSelectors from '../../../../../../selectors/user/user-selectors.json'
import generalSelectors from '../../../../../../selectors/general-selectors.json'

/**
 * @description
 * This spec file contains test to verify that user can enter only valid registration code
 *
 * @file
 * cypress/e2e/admin/server/productinfo/admin-product-info-ui-validations-acceptance.cy
 *
 * @breadcrumb
 * Login > home > product info tab
 *
 * @assertions
 * verify that user can not enter invalid registration code
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

  it('verify that user can not enter invalid registration code', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.home).click()
    cy.get(dashboardSelectors.homeTabs).contains(label.productInfo).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(generalSelectors.button).contains(label.addLicense).click()
    cy.get(productInfoSelectors.registrationCodeField).type(label.helpEnglish)
    cy.get(generalSelectors.modalSelector).within(() => {
      cy.get(generalSelectors.button).contains(label.save).realClick({ force: true })
    })
    cy.get(userSelectors.successMessage).should('be.visible')
  })
})
