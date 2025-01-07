import userSelectors from '../../../selectors/user/user-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
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
  cy.get(userSelectors.titleDelete).should('be.visible').click({ force: true })
  cy.get(generalSelectors.button).contains(label.confirm).should('be.visible').click()
})
