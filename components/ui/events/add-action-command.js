import label from '../../../cypress/fixtures/label.json'
import navigationSelectors from '../../../selectors/navigation/left-navigation-selectors.json'
import generalSelectors from '../../../selectors/general-selectors.json'
import dashboardSelectors from '../../../selectors/dashboard-selectors.json'

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
 * @param {required} actionType
 * @param {optional} customText
 * @param {optional} filePath
 * @param {optional} eventName
 * @param {optional} eventDescription
 *
 * @example
 * cy.createAction (actionType, customText, filePath, eventName, eventDescription)
 */

Cypress.Commands.add('createAction', (actionType, customText, filePath, eventName, eventDescription) => {
  Cypress.log({
    name: 'createActionCommand'
  })
  cy.get(generalSelectors.textSelector).contains(label.actions).click({force : true})
  cy.waitForNetworkIdle(3000, { log: false })
  cy.get(dashboardSelectors.dashboardButton).contains(label.addAction).click({force : true}).wait(2000).realClick({force : true})
  cy.get(navigationSelectors.textContainer).contains(actionType).realClick()
  cy.get(dashboardSelectors.messageBox).type(customText)
  cy.get(dashboardSelectors.textInput).type(filePath)
  cy.get(generalSelectors.textSelector).contains(label.okay).realClick()
  cy.get(generalSelectors.textSelector).contains(label.next).realClick()
  cy.get(generalSelectors.textSelector).contains(label.nameLabel).should('be.visible')
  cy.get(dashboardSelectors.textInput).eq(1).type(eventName)
  cy.get(dashboardSelectors.eventDescription).eq(2).type(eventDescription)
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(generalSelectors.button).contains(label.next).realClick()
  cy.get(dashboardSelectors.button).contains(label.create).realClick()
})

