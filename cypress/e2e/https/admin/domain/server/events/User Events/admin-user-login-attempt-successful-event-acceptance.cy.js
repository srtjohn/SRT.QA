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
 * This spec file contains test to verify that admin can create an event when a user login is successful
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when a user login is successful
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
  const loginUserDetails = {
    username: `qa-auto-event-login-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const disableUserDetails = {
    username: `qa-auto-event-disable-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: loginUserDetails.password,
    serverName: label.autoServerName
  }
  const actionType = 'Disable user account'
  const eventName = `qa-auto-event-${Cypress.dayjs().format('ssmmhhMMYY')}`
  const errorMessage = 'Invalid username or password.'

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      loginUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(loginUserDetails).then(($response) => {
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(loginUserDetails.username)
      disableUserDetails.bearerToken = loginUserDetails.bearerToken
    })
    cy.postCreateUserApiRequest(disableUserDetails).then(($response) => {
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(disableUserDetails.username)
    })
    // check if disable user can login
    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(disableUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(disableUserDetails.password)
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
    cy.get(dashboardSelectors.muiTypography).contains(label.userLoginAttemptSuccess).click()
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    // adding condition
    cy.get(htmlSelectors.div).contains(label.userLoginAttemptSuccess).parent().prev(htmlSelectors.div).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.conditions).click()
    cy.get(userSelectors.btnLabel).contains(label.addCondition).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.userNameLabel).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.matchContainer).within(() => {
      cy.get(htmlSelectors.input).eq(0).click().clear().type(loginUserDetails.username)
    })
    cy.get(dashboardSelectors.matchContainer).within(() => {
      cy.get(userSelectors.addButton).click()
    })
    cy.get(htmlSelectors.tableRow).contains(loginUserDetails.username).prev(htmlSelectors.tableData).should('be.visible').within(() => {
      cy.get(generalSelectors.inputTypeCheckbox).click()
    })
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    // adding action
    cy.get(dashboardSelectors.muiTypography).contains(label.actions).click()
    cy.get(userSelectors.btnLabel).contains(label.addAction).click()
    cy.get(htmlSelectors.div).contains(actionType).click()
    cy.get(htmlSelectors.label).contains(label.usernameLabel).next(htmlSelectors.div).within(() => {
      cy.get(htmlSelectors.input).click().clear().type(disableUserDetails.username)
    })
    cy.get(generalSelectors.labelSelector).contains(label.okayLabel).click()
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.get(htmlSelectors.label).contains(label.nameLabel).next(htmlSelectors.div).should('be.visible').within(() => {
      cy.get(htmlSelectors.input).click().clear().type(eventName)
    })
    cy.get(generalSelectors.labelSelector).contains(label.next).click()
    cy.waitForNetworkIdle(3000, { log: false })
    // creating event
    cy.get(dashboardSelectors.dashboardButtonLabel).contains(label.create).click()

    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(loginUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(loginUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.get(dashboardSelectors.muiTypography).contains(label.myFilesText).should('be.visible')
    cy.get(loginSelectors.inputUsername).type(disableUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(disableUserDetails.password)
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
    cy.deleteUserApiRequest(disableUserDetails.bearerToken, disableUserDetails.serverName, disableUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
      // deleting user
      cy.deleteUserApiRequest(loginUserDetails.bearerToken, loginUserDetails.serverName, loginUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
        expect($response.Result.ErrorStr).to.eq('Success')
      })
    })
  })
})
