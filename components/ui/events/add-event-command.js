import label from '../../../cypress/fixtures/label.json'
import userSelectors from '../../../selectors/user/user-selectors.json'
import htmlSelectors from '../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import dashboardSelectors from '../../../selectors/dashboard-selectors.json'
import navigationSelectors from '../../../selectors/navigation/left-navigation-selectors.json'

/**
 * event creation command
 *
 * This command is used to create an event
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
 * cy.createEvent(eventType, subEvent, finalEvent)
 */

Cypress.Commands.add('createEvent', (eventType, subEvent, finalEvent = false) => {
  Cypress.log({
    name: 'createEventCommand'
  })
  // navigate to events
  cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
  cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(userSelectors.addButton).should('be.visible').click()
  cy.get(userSelectors.btnLabel).contains(label.addEvent).click()
  cy.get(htmlSelectors.div).contains(eventType).parent().prev(htmlSelectors.div).click()
  cy.get(dashboardSelectors.muiTypography).contains(subEvent).click()
  if (finalEvent) {
    cy.get(htmlSelectors.div).contains(subEvent).parent().prev(htmlSelectors.div).click()
    cy.get(dashboardSelectors.muiTypography).contains(finalEvent).click()
  }
  cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
})
