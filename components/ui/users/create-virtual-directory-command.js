import dashboardSelectors from '../../../selectors/dashboard-selectors.json'
import label from '../../../cypress/fixtures/label.json'

/**
 *
 * This command is used to create a virtual directory at all levels
 *
 * @params
 * actual path and virtual folder name
 *
 * @example
 * cy.createVirtualDirectory(virtualDirectoryDetails)
 */

Cypress.Commands.add('createVirtualDirectory', (virtualDirectoryDetails) => {
  cy.log({
    name: 'createVirtualDirectory'
  })
  cy.get(dashboardSelectors.textInput).eq(1).type(virtualDirectoryDetails.actualPath, { scrollBehavior: false })
  cy.get(dashboardSelectors.textInput).eq(2).type(virtualDirectoryDetails.virtualFolderName, { scrollBehavior: false })
  // adding virtual directory
  cy.get(dashboardSelectors.dashboardButton).contains(label.save).click({ scrollBehavior: false })
})
