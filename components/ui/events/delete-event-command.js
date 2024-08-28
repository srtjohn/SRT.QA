import userSelectors from '../../../selectors/user/user-selectors.json'
import htmlSelectors from '../../../selectors/htlm-tag-selectors.json'

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

Cypress.Commands.add('deleteEvent', (eventName) => {
  Cypress.log({
    name: 'deleteEventCommand'
  })
  cy.get(htmlSelectors.div).contains(eventName).should('be.visible').click()
  cy.get(userSelectors.deleteButton).should('be.visible').click()
  // verify if event is deleted
  cy.get(htmlSelectors.div).contains(eventName).should('not.exist')
})
