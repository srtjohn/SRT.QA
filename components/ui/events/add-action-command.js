import label from '../../../cypress/fixtures/label.json'
import userSelectors from '../../../selectors/user/user-selectors.json'
import htmlSelectors from '../../../selectors/htlm-tag-selectors.json'
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
  cy.get(dashboardSelectors.muiTypography).contains(label.actions).click()
  cy.get(userSelectors.btnLabel).contains(label.addAction).click()
  cy.get(htmlSelectors.div).contains(actionType).click()
  cy.get(dashboardSelectors.fileLogText).type(customText)
  cy.get(dashboardSelectors.filePath).type(filePath)
  cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
  cy.get(generalSelectors.labelSelector).contains(label.next).click()
  cy.get(dashboardSelectors.eventName).type(eventName)
  cy.get(dashboardSelectors.eventDescription).type(eventDescription)
  cy.waitForNetworkIdle(1000, { log: false })
  cy.get(generalSelectors.labelSelector).contains(label.next).click()
  cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.create).click()
})
