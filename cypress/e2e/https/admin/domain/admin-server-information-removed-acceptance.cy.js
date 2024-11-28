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
    cy.get(generalSelectors.close).click()
  })

  it('verify that server information is removed when user navigates back from services to database during server creation', () => {
    cy.get(generalSelectors.textSelector).contains(label.autoDomainName).click()
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(serverSelectors.titleAddNew).click()

    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(generalSelectors.textSelector).contains(label.databaseText).should('be.visible')
    cy.get(generalSelectors.button).contains(label.next).realClick()

    cy.get(generalSelectors.textSelector).contains(label.serverNameText).next(htmlTagSelectors.div).type(serverName)

    cy.get(serverSelectors.serviceCheckboxContainer).first().within(() => {
      cy.get(htmlTagSelectors.div).realClick()
    })
    cy.get(generalSelectors.textSelector).contains(label.serverDescriptionText).next(htmlTagSelectors.div).type(label.serverDescription)

    cy.get(generalSelectors.button).contains(label.next).realClick()

    cy.get(serverSelectors.serverPageHeading).contains(label.selectServices).should('be.visible')
    cy.get(generalSelectors.button).should('be.visible').contains(label.back).realClick()
    cy.get(generalSelectors.textSelector).contains(label.serverNameText).next(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).invoke('val').should('equal', serverName)
    })
    // Select Database
    cy.get(generalSelectors.button).should('be.visible').contains(label.back).realClick()
    cy.get(serverSelectors.serverPageHeading).contains(label.selectDatabase).should('be.visible')
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(serverSelectors.serverPageHeading).contains(label.enterServerInfo).should('be.visible')
    cy.get(htmlTagSelectors.tableData).should('not.contain', serverName)
  })
})
