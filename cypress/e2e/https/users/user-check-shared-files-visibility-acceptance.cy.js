import label from '../../../fixtures/label.json'
import loginSelectors from '../../../../selectors/login-selectors.json'
import userDirSelectors from '../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that shared files are visible in shared with me tab
 *
 * @IssueID - NX-I1253
 *
 * @file
 * cypress/e2e/admin/server/users/admin-check-shared-files-visibility-acceptance.cy.js
 *
 * @breadcrumb
 * User Login > check permissions
 *
 * @assertions
 * To verify that shared files are visible in shared with me tab
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('login', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const firstUserDetails = {
    username: `qa-auto-first-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const secondUserDetails = {
    username: `qa-auto-second-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: firstUserDetails.password,
    serverName: label.autoServerName
  }
  const sharedDirName = 'NX-I1253'
  const fileName = 'local.txt'

  function login (username) {
    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(username)
    cy.get(loginSelectors.inputPassword).type(firstUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
  }

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      firstUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(firstUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(firstUserDetails.username)
      secondUserDetails.bearerToken = firstUserDetails.bearerToken
    })
    cy.postCreateUserApiRequest(secondUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(secondUserDetails.username)
    })
  })

  it('verify that shared files are visible in shared with me tab', () => {
    login(firstUserDetails.username)
    cy.get(userDirSelectors.quickSendQue).eq(0).selectFile(`cypress/fixtures/${fileName}`, { force: true }, { action: 'drag-drop' })
    cy.get(userDirSelectors.quickSendDialog).eq(1).within(() => {
      cy.get(userDirSelectors.shareAsField).click({ force: true }).type(sharedDirName)
      cy.get(userDirSelectors.toField).click()
      cy.get(userDirSelectors.toField).type(`${secondUserDetails.username}{enter}`)
      cy.get(userDirSelectors.buttonList).contains(label.next).click({ force: true })
      cy.get(userDirSelectors.buttonList).contains(label.next).click({ force: true })
      cy.get(userDirSelectors.buttonList).contains(label.sendText).click({ force: true })
    })
    // login as second user
    login(secondUserDetails.username)
    cy.get(userDirSelectors.buttonList).contains(label.sharedWithMe).click({ force: true })
    cy.get(userDirSelectors.parentUsers).contains(sharedDirName).should('be.visible').parent(userDirSelectors.gridItem)
      .prev(userDirSelectors.gridItem).click({ force: true })
    cy.get(userDirSelectors.parentUsers).contains(fileName).should('be.visible')
  })
  afterEach('deleting users', () => {
    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, firstUserDetails.serverName, firstUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, secondUserDetails.serverName, secondUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
