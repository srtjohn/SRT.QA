import label from '../../../fixtures/label.json'
import loginSelectors from '../../../../selectors/login-selectors.json'
import htmlTagSelectors from '../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that virtual directory root folder permissions are not visible
 *
 * @IssueID - NX-I1305
 *
 * @file
 * cypress/e2e/admin/server/users/admin-check-virtual-directory-permissions-acceptance.cy.js
 *
 * @breadcrumb
 * User Login > check permissions
 *
 * @assertions
 * To verify that options for a virtual directory are not visible
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('login > add new virtual directory ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const CreateUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }

  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: 'gpdirone',
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------'
  }

  beforeEach('login and new virtual directory', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      CreateUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(CreateUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(CreateUserDetails.username)
      // initializing AuthGUID
      CreateUserDetails.AuthGUID = $response.Response.AuthGUID
    })

    cy.postCreateUserVirtualDirectoryApiRequest(CreateUserDetails, virtualDirectoryDetails).then(($response) => {
      expect($response.Response.UserGroupGUID).to.equal(CreateUserDetails.AuthGUID)
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })

  it('verifying permissions visibility', () => {
  // checking permissions

    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(CreateUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(CreateUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.contains(userDirSelectors.roleCell, virtualDirectoryDetails.Path)
      .prev(htmlTagSelectors.div).click()
    cy.get(userDirSelectors.permissionHead).should('be.visible')
    cy.get(`${userDirSelectors.permissionHead} ${userDirSelectors.gridItem}`).eq(1).find(userDirSelectors.gridItem).eq(0).find(htmlTagSelectors.span).should('not.exist')
  })
  afterEach('deleting new folder and user', () => {
    // calling delete user function
    cy.deleteUserApiRequest(CreateUserDetails.bearerToken, CreateUserDetails.serverName, CreateUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
