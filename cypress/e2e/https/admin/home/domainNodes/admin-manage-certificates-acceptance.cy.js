import label from '../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../../../../selectors/navigation/left-navigation-selectors.json'
import manageCertificate from '../../../../../../selectors/domainNodes/manage-certificates.json'

import { slowCypressDown } from 'cypress-slow-down'
/**
 * @description
 * This spec file contains test to verify manage certificates
 *
 * @file
 * cypress\e2e\admin\server\domainNodes\admin-manage-certificates-acceptance.cy.js
 *
 * @breadcrumb
 * Login > home > domain nodes > manage certificate
 *
 * @assertions
 * verify manage certificates dialogs
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - admin user should have valid credentials
 */

slowCypressDown(100)

describe('Login > home > domain nodes > manage certificate', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify manage certificates dialogs', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.home).click()
    cy.get(dashboardSelectors.homeTabs).contains(label.domainNodes).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.manageCert).click()

    cy.get(manageCertificate.gridRoot).contains(label.update).click()
    cy.checkTextVisibility(manageCertificate.dialog, label.updateHeading)
    cy.get(manageCertificate.dashboardButtonLabel).contains(label.cancel).click()

    cy.get(manageCertificate.gridRoot).contains(label.export).click()
    cy.checkTextVisibility(manageCertificate.dialog, label.exportHeading)
    cy.get(manageCertificate.dashboardButtonLabel).contains(label.cancel).click()

    cy.get(manageCertificate.gridRoot).contains(label.delete).click()
    cy.checkTextVisibility(manageCertificate.dialog, label.deleteHeading)
    cy.get(manageCertificate.dashboardButtonLabel).contains(label.cancel).click()
  })
})
