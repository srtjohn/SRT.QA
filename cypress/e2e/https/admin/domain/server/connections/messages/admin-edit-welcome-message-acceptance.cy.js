import { slowCypressDown } from 'cypress-slow-down'
import navigationSelectors from '../../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../../fixtures/label.json'
import generalSelectors from '../../../../../../../../selectors/general-selectors.json'
import htmlTagSelectors from '../../../../../../../../selectors/htlm-tag-selectors.json'
import userSelectors from '../../../../../../../../selectors/user/user-selectors.json'
import dashboardSelectors from '../../../../../../../../selectors/dashboard-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can edit welcome message and verify the edited message during user login
 *
 * @file
 * ui/cypress/e2e/server/services/SSH/admin-edit-welcome-message-acceptance.cy.js
 *
 * @issueID NX-I1206
 *
 * @breadcrumb
 * Login > {existing server} > connections > messages
 *
 * @assertions
 * To verify that admin can edit welcome message and verify the edited message during user login
 */

slowCypressDown(100)

describe('Login > {existing server} > connections > messages ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const welcomeMessageText = `customized auto welcome message ${Cypress.dayjs().format('ssmmhhMMYY')}`
  const defaultWelcomeMessageText = 'default welcome message'

  const userDetails = Cypress.env('user')

  function setCustomizedMessage (customizedMessage) {
    // navigate to connections
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.connections).should('be.visible').click()
    // clicking on messages tab
    cy.get(generalSelectors.roleTab).contains(label.messages).should('be.visible').click()
    // clicking on edit button
    cy.get(htmlTagSelectors.tableData).contains(label.welcomeMessage)
      .next(htmlTagSelectors.tableData).next(htmlTagSelectors.tableData).within(() => {
        cy.get(generalSelectors.button).click()
      })
    // Writing customized welcome text message
    cy.get(dashboardSelectors.messageBox).clear().type(customizedMessage)
    cy.get(generalSelectors.button).contains(label.update).should('be.visible').click()
  }

  beforeEach(() => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that admin can edit welcome message and verify the edited message during user login', () => {
    // set customized message
    setCustomizedMessage(welcomeMessageText)
    // verify the custom message on user login
    cy.login('', userDetails.Username, userDetails.Password)
    cy.get(userSelectors.successMessage).should('contain', welcomeMessageText)
  })

  afterEach('verifying welcome message', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // change it to default message
    setCustomizedMessage(defaultWelcomeMessageText)
  })
})
