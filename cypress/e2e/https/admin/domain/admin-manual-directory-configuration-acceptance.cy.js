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
    cy.get(serverSelectors.addButtonContainer).contains(label.addNew).click()

    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()
    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()

    cy.get(serverSelectors.serverNameInputContainer).contains(label.serverNameText).parent(htmlTagSelectors.div).within(() => {
      cy.get(htmlTagSelectors.input).type(serverName)
    })

    cy.contains(htmlTagSelectors.span, label.StartServerAutomatically)
      .prev(htmlTagSelectors.span).click()

    cy.get(generalSelectors.inputTypeCheckbox).eq(1).click()

    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()

    cy.get(serverSelectors.gridContainerXS10).each(($outerContainer) => {
      cy.wrap($outerContainer).within(() => {
        cy.get(serverSelectors.textFieldRootContainer).within(() => {
          cy.get(serverSelectors.inputBaseContainer).within(() => {
            cy.get(serverSelectors.inputContainer).clear()
          })
        })
      })
    })

    cy.get(serverSelectors.nextButtonContainer).contains(label.next).click()

    cy.get(serverSelectors.gridContainerXS10)
      .find(serverSelectors.inputBaseContainer)
      .get(serverSelectors.inputContainer).should('exist')
    cy.get(generalSelectors.closeModal).click()
  })
})
