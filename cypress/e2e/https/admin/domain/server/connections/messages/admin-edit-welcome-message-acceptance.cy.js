import serverSelectors from '../../../../../../../../selectors/server-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
import navigationSelectors from '../../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../../fixtures/label.json'
import generalSelectors from '../../../../../../../../selectors/general-selectors.json'
import htmlTagSelectors from '../../../../../../../../selectors/htlm-tag-selectors.json'
import userSelectors from '../../../../../../../../selectors/user/user-selectors.json'
import loginSelectors from '../../../../../../../../selectors/login-selectors.json'

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
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(serverSelectors.serverName).contains(label.autoServerName).should('be.visible')
    // navigate to connections
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.connections).should('be.visible').click()
    // clicking on messages tab
    cy.get(generalSelectors.roleTab).contains(label.messages).should('be.visible').click()
    // clicking on edit button
    cy.get(htmlTagSelectors.div).contains(label.welcomeMessage).parent().parent(htmlTagSelectors.div)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist').click()
    // Writing customized welcome text message
    cy.get(generalSelectors.idText).click().clear().type(customizedMessage)
    cy.get(generalSelectors.typeButton).contains(label.edit).should('be.visible').click()
    cy.get(userSelectors.successMessage).should('be.visible')
    // Sign out
    cy.get(htmlTagSelectors.span).contains(label.englishLang).parent().parent(generalSelectors.typeButton).next(htmlTagSelectors.button).click()
    cy.get(generalSelectors.roleMenu).contains(label.signOut).click()
  }

  it('verify that admin can edit welcome message and verify the edited message during user login', () => {
    // set customized message
    setCustomizedMessage(welcomeMessageText)
    // verify the custom message on user login
    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(userDetails.Username)
    cy.get(loginSelectors.inputPassword).type(userDetails.Password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.get(userSelectors.successMessage).should('contain', welcomeMessageText)
  })

  afterEach('verifying welcome message', () => {
    // change it to default message
    setCustomizedMessage(defaultWelcomeMessageText)
  })
})
