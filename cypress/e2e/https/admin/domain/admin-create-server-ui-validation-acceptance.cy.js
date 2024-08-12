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
    cy.get(serverSelectors.addButtonContainer).contains(label.addNew).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.waitUntil(() => cy.get(serverSelectors.spinner).should('not.be.visible'))
    cy.contains(htmlTagSelectors.span, label.StartServerAutomatically)
      .prev(htmlTagSelectors.span).click()
  })

  afterEach(() => {
    cy.get(generalSelectors.closeModal).click()
  })

  it('verify ui validation for creating new server', () => {
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.serverNameReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.serverDataDirReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.serverLogDirReqMessage).should('have.text', label.required)
  })

  it('verify ui validation for Manual Directory Configuration', () => {
    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverNameText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).type(serverDetails.serverName)
    })
    cy.contains(htmlTagSelectors.span, label.manuallyConfigDirLocations)
      .prev(htmlTagSelectors.span).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.serverBackDir).clear()
    cy.get(serverSelectors.systemDatabaseCacheDirectory).clear()
    cy.get(serverSelectors.reportsDirectory).clear()
    cy.get(serverSelectors.temporaryCacheDirectory).clear()
    cy.get(serverSelectors.quickSendCacheDirectory).clear()
    cy.get(serverSelectors.aVQuarantineDirectory).clear()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.serverBackDirReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.systemDatabaseCacheDirectoryReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.reportsDirectoryReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.temporaryCacheDirectoryReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.quickSendCacheDirectoryReqMessage).should('have.text', label.required)
    cy.get(serverSelectors.aVQuarantineDirectoryReqMessage).should('have.text', label.required)
  })
})
