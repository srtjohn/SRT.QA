import navigationSelectors from '../../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../../selectors/user/user-selectors.json'
import label from '../../../../../../../fixtures/label.json'
import loginSelectors from '../../../../../../../../selectors/login-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlSelectors from '../../../../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../../../../selectors/dashboard-selectors.json'
import generalSelectors from '../../../../../../../../selectors/general-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when a user is deleted, another account's login is disabled
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when a user is deleted, another account's login is disabled
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

// this test suite is skipped because it leads to disabling of all the users
describe.skip('Login > {existing server} > events > create new event', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const deleteUserDetails = {
    username: `qa-auto-event-delete-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const LoginUserDetails = {
    username: `qa-auto-event-Login-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: deleteUserDetails.password,
    serverName: label.autoServerName
  }
  const actionType = 'Disable user account'
  const eventName = `qa-auto-event-${Cypress.dayjs().format('ssmmhhMMYY')}`
  const errorMessage = 'Invalid username or password.'

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      deleteUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(deleteUserDetails).then(($response) => {
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(deleteUserDetails.username)
      LoginUserDetails.bearerToken = deleteUserDetails.bearerToken
    })
    cy.postCreateUserApiRequest(LoginUserDetails).then(($response) => {
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(LoginUserDetails.username)
    })
    // check if disable user can login
    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(LoginUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(LoginUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.myFilesText).should('be.visible')
    // login
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // navigate to events
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
    cy.waitForNetworkIdle(1000, { log: false })
  })
  it('creating new event', () => {
    cy.get(userSelectors.addButton).should('be.visible').click()
    cy.get(userSelectors.btnLabel).contains(label.addEvent).click()
    cy.get(htmlSelectors.div).contains(label.userEvents).parent().prev(htmlSelectors.div).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.userAccountDeleted).click()
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    // adding condition
    cy.get(htmlSelectors.div).contains(label.userAccountDeleted).parent().prev(htmlSelectors.div).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.conditions).click()
    cy.get(userSelectors.btnLabel).contains(label.addCondition).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.userNameLabel).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.matchContainer).within(() => {
      cy.get(htmlSelectors.input).eq(0).click().clear().type(deleteUserDetails.username)
    })
    cy.get(dashboardSelectors.matchContainer).within(() => {
      cy.get(userSelectors.addButton).click()
    })
    cy.get(htmlSelectors.tableRow).contains(deleteUserDetails.username).prev(htmlSelectors.tableData).should('be.visible').within(() => {
      cy.get(generalSelectors.inputTypeCheckbox).click()
    })
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    // adding action
    cy.get(dashboardSelectors.muiTypography).contains(label.actions).click()
    cy.get(userSelectors.btnLabel).contains(label.addAction).click()
    cy.get(htmlSelectors.div).contains(actionType).click()
    cy.get(htmlSelectors.label).contains(label.usernameLabel).next(htmlSelectors.div).within(() => {
      cy.get(htmlSelectors.input).click().clear().type(LoginUserDetails.username)
    })
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.get(htmlSelectors.label).contains(label.nameLabel).next(htmlSelectors.div).should('be.visible').within(() => {
      cy.get(htmlSelectors.input).click().clear().type(eventName)
    })
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.waitForNetworkIdle(3000, { log: false })
    // testing the created action
    cy.get(htmlSelectors.button).contains(label.testActions).click()
    cy.get(htmlSelectors.label).contains(label.userName).next(htmlSelectors.div).should('be.visible').click()
    cy.get(htmlSelectors.li).contains(LoginUserDetails.username).click()
    cy.get(generalSelectors.labelSelector).contains(label.test).click()
    cy.get(userSelectors.successMessage).should('exist')
    cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.create).click()

    // deleting user
    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(LoginUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(LoginUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.get(dashboardSelectors.muiTypography).should('contain', errorMessage)
  })

  afterEach('deleting event and user', () => {
    // deleting the event
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.events).should('be.visible').click()
    cy.get(htmlSelectors.div).contains(eventName).should('be.visible').click()
    cy.get(userSelectors.deleteButton).should('be.visible').click()
    // verify if event is deleted or not
    cy.get(htmlSelectors.div).contains(eventName).should('not.exist')
    // calling delete user function
    cy.deleteUserApiRequest(deleteUserDetails.bearerToken, deleteUserDetails.serverName, deleteUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
    cy.deleteUserApiRequest(LoginUserDetails.bearerToken, LoginUserDetails.serverName, LoginUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
