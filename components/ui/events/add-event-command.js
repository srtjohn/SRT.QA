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

Cypress.Commands.add('createEvent', (eventType, subEvent, finalEvent = false, home = false) => {
  Cypress.log({
    name: 'createEventCommand'
  })
  // navigate to events
  if (!home) {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
  }
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(userSelectors.addButton).eq(0).should('be.visible').click()
  cy.get(dashboardSelectors.contentModal).within(()=>{
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).realClick()
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(dashboardSelectors.dashboardButton).contains(label.addEvent).realClick({force : true})
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(htmlSelectors.span).then((resp)=>{
      console.log(resp.text())
      if(!resp.text().includes(label.addEvent)){
        cy.get(dashboardSelectors.dashboardButton).contains(label.addEvent).realClick({force : true})
      }
      else{
        cy.log('open')
      }
    })
    cy.get(navigationSelectors.textContainer).contains(eventType).realClick().parent(htmlSelectors.div).parent().prev().realClick()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(navigationSelectors.navbarTextSelector).contains(subEvent).click()
    if (finalEvent) {
      cy.get(navigationSelectors.navbarTextSelector).contains(subEvent).realClick().parent(htmlSelectors.div).parent().prev().realClick()
      cy.get(navigationSelectors.textLabelSelector).contains(finalEvent).click()
    }
    cy.get(generalSelectors.button).contains(label.okay).click()
  })
  
  
  
})
