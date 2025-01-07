import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can trigger SE-10117 system event to configure backup
 *
 * @issueID - NX-I1151 and NX-I1191
 *
 * @breadcrumb
 * Login > {existing server} > events > show system events > SE-10117 (config backup)
 *
 * @assertions
 * To verify that admin can trigger SE-10117 system event to configure backup
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing server} > events > show system events > SE-10117 (config backup)', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // navigate to events
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
    // show system events
    cy.get(dashboardSelectors.filterIcon).eq(0).should('be.visible').click()
    cy.get(dashboardSelectors.modalTitle).contains(label.eventHandlersFilter).should('be.visible')
    cy.get(dashboardSelectors.dialog).within(() => {
      cy.get(generalSelectors.checkbox).realClick()
      cy.get(generalSelectors.button).contains(label.add).realClick()
    })
    // click on edit icon for event SE-10117
    cy.contains(htmlSelectors.tableData, label.backupEventName).should('be.visible')
      .next(htmlSelectors.tableData).should('be.visible')
      .next(htmlSelectors.tableData).should('be.visible')
      .next(htmlSelectors.tableData).should('be.visible')
      .within(() => {
        cy.get(generalSelectors.button).click()
      })
  })
  // the it block code will be written once the issue is resolved
  it('admin can trigger SE-10117 system event to configure backup', () => {
    cy.get(generalSelectors.button).contains(label.next).click()
    cy.get(generalSelectors.button).contains(label.next).click()
    cy.get(generalSelectors.button).contains(label.finish).click()
  })
})
