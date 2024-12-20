import label from '../../../fixtures/label.json'
import htmlTagSelectors from '../../../../selectors/htlm-tag-selectors.json'

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
  const createUserDetails = {
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
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      // initializing AuthGUID
      createUserDetails.AuthGUID = $response.Response.AuthGUID
    })

    cy.postCreateUserVirtualDirectoryApiRequest(createUserDetails, virtualDirectoryDetails).then(($response) => {
      expect($response.Response.UserGroupGUID).to.equal(createUserDetails.AuthGUID)
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })

  it('verifying permissions visibility', () => {
    cy.login('', createUserDetails.username, createUserDetails.password)

    // actions button should not be visible
    cy.get(htmlTagSelectors.tableData).contains(virtualDirectoryDetails.Path).parent()
      .next().next().next().next().invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal('')
      })
  })

  afterEach('deleting new folder and user', () => {
    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
