import dashboardSelectors from '../../../selectors/dashboard-selectors.json'
import label from '../../../cypress/fixtures/label.json'

/**
 *
 * This command is used to delete a virtual directory
 *
 * @params
 * actual path and virtual folder name
 *
 * @example
 * cy.deleteVirtualDirectory()
 */

Cypress.Commands.add('deleteVirtualDirectory', () => {
  cy.log({
    name: 'deleteVirtualDirectory'
  })
  cy.get(dashboardSelectors.dashBoardList).contains(label.delete).should('be.visible').click()
  cy.get(dashboardSelectors.dashBoardList).contains(label.confirmDelete).should('be.visible').click()
})
