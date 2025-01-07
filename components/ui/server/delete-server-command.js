import serverSelectors from '../../../selectors/server-selectors.json'
import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import label from '../../../cypress/fixtures/label.json'

/**
 * Server Deletion Command
 *
 * This command is used to delete a server
 *
 * This command takes server name as a parameter
 *
 * @location
 * Login > Delete Server
 *
 * @params
 * @param {required} serverName  // A variable containing server name
 *
 * @example
 * cy.deleteServer(serverName)
 */

Cypress.Commands.add('deleteServer', (serverName) => {
  cy.contains(htmlTagSelectors.tableData, serverName)
    .next(htmlTagSelectors.tableData).should('exist')
    .next(htmlTagSelectors.tableData).should('exist')
    .next(htmlTagSelectors.tableData).should('exist')
    .next(htmlTagSelectors.tableData).within(() => {
      cy.get(generalSelectors.button).realClick()
    })
  cy.get(serverSelectors.serverDeleteButton).realClick()
  cy.get(generalSelectors.button).contains(label.confirm).realClick()
})
