import serverSelectors from '../../../../../selectors/server-selectors.json'
import label from '../../../../fixtures/label.json'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
/**
 * @description
 * This spec file contains test to verify ui validation for creating new server
 *
 * @file
 * ui/cypress/e2e/server/admin-create-server-ui-validation-acceptance.cy.js
 *
 * @breadcrumb
 * Login > Add new server
 *
 * @assertions
 * To verify  ui validation for creating new server
 * To verify user can delete a server
 * To verify ui validation for Manual Directory Configuration
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('login > add new server ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverType: 'New standalone or primary cluster server.',
    selectDatabase: 'SQLite Database',
    serverName: `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(generalSelectors.textSelector).contains(label.autoDomainName).click()
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(serverSelectors.titleAddNew).first().click()
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(generalSelectors.textSelector).contains(label.databaseText).should('be.visible')
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.contains(generalSelectors.textSelector, label.StartServerAutomatically)
      .prev(htmlTagSelectors.div).click()
  })

  afterEach(() => {
    cy.get(generalSelectors.close).click()
  })

  it('verify ui validation for creating new server', () => {
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(serverSelectors.serverNameReqMessage).should('contain.text', label.required)
  })

  it('verify ui validation for Manual Directory Configuration', () => {
    cy.get(generalSelectors.textSelector).contains(label.serverNameText).next(htmlTagSelectors.div).type(serverDetails.serverName)
    cy.get(serverSelectors.serviceCheckboxContainer).first().within(() => {
      cy.get(htmlTagSelectors.div).click()
    })
    cy.get(serverSelectors.serviceCheckboxContainer).eq(1).within(() => {
      cy.get(htmlTagSelectors.div).click()
    })
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(serverSelectors.serverTypeDropdown).each($el => {
      cy.wrap($el).clear()
    })
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(serverSelectors.serverNameReqMessage).each($el => {
      cy.wrap($el).should('contain.text', label.required)
    })
  })
})
