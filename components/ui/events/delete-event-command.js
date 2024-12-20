import userSelectors from '../../../selectors/user/user-selectors.json'
import htmlSelectors from '../../../selectors/htlm-tag-selectors.json'
import navigationSelectors from '../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../cypress/fixtures/label.json'

/**
 * event delete command
 *
 * This command is used to delete an event
 *
 * @location
 * Login > {existing server} > events
 *
 * @params
 * parameters on enter event information page
 * @param {required} eventType
 * @param {optional} subEvent
 * @param {optional} finalEvent
 *
 * @example
 * cy.deleteEvent(eventName)
 */

Cypress.Commands.add('deleteEvent', (eventName, home = false) => {
  Cypress.log({
    name: 'deleteEventCommand'
  })
  if (home) {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
  }
  cy.get(htmlSelectors.tableData).contains(eventName).prev().should('be.visible').click({ force: true })
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(userSelectors.titleDelete).eq(0).should('be.visible').click()
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(userSelectors.button).contains(label.confirm).should('be.visible').realClick()
  // verify if event is deleted
  cy.get(htmlSelectors.tableData).contains(eventName).should('not.exist')
})
