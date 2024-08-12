import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import label from '../../../cypress/fixtures/label.json'
import serverSelectors from '../../../selectors/server-selectors.json'
import navigationSelectors from '../../../selectors/navigation/left-navigation-selectors.json'
import dashboardSelectors from '../../../selectors/dashboard-selectors.json'

/**
* @description
* The addServerKey Command  is used to add a server key
*
* @example
* cy.addServerKey(hostKeyDetails)
*/

Cypress.Commands.add('addServerKey', (hostKeyDetails) => {
  Cypress.log({
    name: 'addServerKey'
  })
  // clicking on new button to add a new key
  cy.get(generalSelectors.typeButton).contains(label.new).should('be.visible').click()
  // clicking on key type dropdown
  cy.get(generalSelectors.inputLabel).contains(label.keyType).parent(htmlTagSelectors.div).within(() => {
    cy.get(generalSelectors.roleButton).click()
  })
  // choosing key type from dropdown options
  cy.get(`[data-value='${hostKeyDetails.keyType}']`).click()
  // clicking on key size dropdown
  cy.get(generalSelectors.inputLabel).contains(label.keySize).parent(htmlTagSelectors.div).within(() => {
    cy.get(generalSelectors.roleButton).click()
  })
  // choosing key size from dropdown options
  cy.get(generalSelectors.roleListBox).contains(hostKeyDetails.keySize).click()
  // entering key name
  cy.get(serverSelectors.hostKeyNameInput).type(hostKeyDetails.keyName)
  // clicking add button
  cy.get(dashboardSelectors.muiDialogPaperWidthXs).within(() => cy.get(htmlTagSelectors.span).contains(label.add).click())
  // click to close the SSH host key management modal
  cy.get(generalSelectors.labelSelector).contains(label.closeText).click()
  // navigating back to domain name
  cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
})
