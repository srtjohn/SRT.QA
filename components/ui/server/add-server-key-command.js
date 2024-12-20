import htmlTagSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import label from '../../../cypress/fixtures/label.json'
import serverSelectors from '../../../selectors/server-selectors.json'

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
  cy.get(generalSelectors.button).contains(label.new).should('be.visible').click()
  // clicking on key type dropdown
  cy.get(generalSelectors.textSelector).contains(label.keyType).next().within(() => {
    cy.get(serverSelectors.serverTypeDropdown).click()
  })
  // choosing key type from dropdown options
  cy.get(generalSelectors.roleOption).contains(hostKeyDetails.keyType).click()
  // clicking on key size dropdown
  cy.get(generalSelectors.textSelector).contains(label.keySize).next().within(() => {
    cy.get(serverSelectors.serverTypeDropdown).click()
  })
  // choosing key size from dropdown options
  cy.get(generalSelectors.roleOption).contains(hostKeyDetails.keySize).click()
  // entering key name
  cy.get(generalSelectors.textSelector).contains(label.hostKeyname).next().within(() => {
    cy.get(htmlTagSelectors.input).click().type(hostKeyDetails.keyName)
  })
  // clicking add button
  cy.get(generalSelectors.button).contains(label.save).click()
})
