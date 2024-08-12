import serverSelectors from '../../../selectors/server-selectors.json'
import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'

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
  cy.contains(htmlTagSelectors.div, serverName).parents(serverSelectors.parent)
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).should('exist')
    .next(htmlTagSelectors.div).click()
  cy.get(serverSelectors.serverDeleteButton).click()
})
