import serverSelectors from '../../../../../selectors/server-selectors.json'
import label from '../../../../fixtures/label.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains tests to verify that server information is removed
 * when user navigates back from services to database page during server creation
 *
 * @file
 * ui/cypress/e2e/server/server-information-acceptance.cy.js
 *
 * @breadcrumb
 * - Login > Add New > Server > Database > Server Info
 *
 * @assertions
 * - To verify that server information is removed when user navigates back from services to database during server creation
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(250)

// skip due to an existing bug NX-I1134
describe('Login > Add New > Server > Database > Server Info', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverName = `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`

  beforeEach(() => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  afterEach(() => {
    cy.get(generalSelectors.closeModal).click()
  })

  it('verify that server information is removed when user navigates back from services to database during server creation', () => {
    cy.get(serverSelectors.addButtonContainer).contains(label.addNew).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.waitUntil(() => cy.get(serverSelectors.spinner).should('not.be.visible'))
    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverNameText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).type(serverName)
    })
    cy.contains(htmlTagSelectors.span, label.StartServerAutomatically)
      .prev(htmlTagSelectors.span).click()

    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverDescriptionText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).type(label.serverDescription)
    })
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.serverPageHeading).contains(label.selectServices).should('be.visible')
    cy.get(serverSelectors.nextButtonContainer).should('be.visible').contains(label.back).click()
    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverNameText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).invoke('val').should('equal', serverName)
    })
    // Select Database
    cy.get(serverSelectors.nextButtonContainer).should('be.visible').contains(label.back).click()
    cy.get(serverSelectors.serverPageHeading).contains('Select Database').should('be.visible')
    cy.get(serverSelectors.nextButtonContainer).should('be.visible').contains(label.next).click()
    cy.waitUntil(() => cy.get(serverSelectors.spinner).should('not.be.visible'))
    cy.get(serverSelectors.serverPageHeading).contains('Enter Server Information').should('be.visible')
    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverNameText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).should('not.contain', serverName)
    })
  })
})
