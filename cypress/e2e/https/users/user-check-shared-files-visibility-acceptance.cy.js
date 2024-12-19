import label from '../../../fixtures/label.json'
import generalSelectors from '../../../../selectors/general-selectors.json'
import userDirSelectors from '../../../../selectors/user-dir-selectors.json'
import navigationSelectors from '../../../../selectors/navigation/left-navigation-selectors.json'
import htmlSelectors from '../../../../selectors/htlm-tag-selectors.json'

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
    cy.login(' ', firstUserDetails.username, firstUserDetails.password)
    cy.waitForNetworkIdle(1500, { log: false })
    cy.get(userDirSelectors.quickSend).selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop', force: true })
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(userDirSelectors.quickSendDialog).within(() => {
      cy.get(generalSelectors.textEdit).eq(0).click({ force: true }).type(sharedDirName)
      
      cy.get(generalSelectors.textEdit).eq(1).click().type(`${secondUserDetails.username}{enter}`)
    })
    cy.get(generalSelectors.button).contains(label.next).click({ force: true })
    cy.get(generalSelectors.button).contains(label.next).click({ force: true })
    cy.get(generalSelectors.button).contains(label.finish).click({ force: true })

    // login as second user
    cy.login('', secondUserDetails.username, firstUserDetails.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.sharedWithMe).click({ force: true })
    cy.get(htmlSelectors.tableData).contains(sharedDirName).should('be.visible')
  })
  afterEach('deleting users', () => {
    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, firstUserDetails.serverName, firstUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, secondUserDetails.serverName, secondUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
