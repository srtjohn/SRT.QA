import serverSelectors from '../../../../../selectors/server-selectors.json'
import label from '../../../../fixtures/label.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains tests to ensure that user must provide the Manual Directory Configuration values before moving to the next page
 *
 * @issueID - NX-i1131
 *
 * @breadcrumb
 * Login > Add New > Server > Database > Server Info > Add New
 *
 * @assertions
 * - To verify that admin user cannot navigate to next without manually configuring the directory
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('Login > Add New > Server > Database > Server Info > Add New', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverName = `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`

  beforeEach(() => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('Verify that the user cannot navigate to the next page, until he/she configures directories manually', () => {
    cy.get(generalSelectors.textSelector).contains(label.autoDomainName).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(serverSelectors.titleAddNew).first().click()
    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(generalSelectors.textSelector).contains(label.databaseText).should('be.visible')
    cy.get(generalSelectors.button).contains(label.next).realClick()

    cy.get(generalSelectors.textSelector).contains(label.serverNameText).next(htmlTagSelectors.div).type(serverName)

    cy.get(serverSelectors.serviceCheckboxContainer).eq(1).within(() => {
      cy.get(htmlTagSelectors.div).realClick()
    })

    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.wait(2000)
    cy.get(serverSelectors.serverTypeDropdown).each(($outerContainer) => {
      cy.wrap($outerContainer).clear()
    })

    cy.get(generalSelectors.button).contains(label.next).realClick()
    cy.get(serverSelectors.serverNameReqMessage).each($el => {
      cy.wrap($el).should('contain.text', label.required)
    })

    cy.get(serverSelectors.serverTypeDropdown).each(($outerContainer) => {
      cy.wrap($outerContainer).should('exist')
    })
    cy.get(generalSelectors.close).click()
  })
})
