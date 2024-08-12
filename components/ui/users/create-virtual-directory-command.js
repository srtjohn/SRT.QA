import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
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
  cy.get(generalSelectors.inputLabel).contains(label.actualPath).parent(htmlTagSelectors.div).type(virtualDirectoryDetails.actualPath)
  cy.get(generalSelectors.inputLabel).contains(label.newPath).parent(htmlTagSelectors.div).type(virtualDirectoryDetails.virtualFolderName)
  // adding virtual directory
  cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.add).click()
})
