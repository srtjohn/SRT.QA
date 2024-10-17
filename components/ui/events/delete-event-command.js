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
  cy.get(htmlSelectors.div).contains(eventName).should('be.visible').click()
  cy.get(userSelectors.deleteButton).should('be.visible').click()
  // verify if event is deleted
  cy.get(htmlSelectors.div).contains(eventName).should('not.exist')
})
