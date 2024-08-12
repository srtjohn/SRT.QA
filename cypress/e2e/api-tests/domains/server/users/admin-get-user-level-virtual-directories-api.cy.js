import label from '../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can get list of virtual directories at user level through API
 *
 * @assertions
 * To verify that admin can get the list virtual directories at user level through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('GET /api/Servers', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const createUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.ApiTestingAutomation
  }
  const serverDetails = {
    serverName: label.ApiTestingAutomation
  }
  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: 'gpdirone',
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------'
  }

  beforeEach('login through api', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      // Check if response type is api auth response
      expect($response.ResponseType).to.equal('ApiAuthResponse')
      // Check if ErrorStr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // Check if IsAdmin is true
      expect($response.Response.AuthInfo.IsAdmin).to.equal(true)
      // Check if BearerToken exists in SessionInfo
      expect($response.Response.SessionInfo.BearerToken).to.exist
      // Check if BearerToken is not empty
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      // Check if response type is ApiUserParamsPoco
      expect($response.ResponseType).to.equal('ApiUserParamsPoco')
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(createUserDetails.username)
      // initializing userGUID
      createUserDetails.UserGUID = $response.Response.UserGUID
    })
    cy.postCreateUserVirtualDirectoryApiRequest(createUserDetails, virtualDirectoryDetails).then(($response) => {
      // Check if response type is ApiUserParamsPoco
      expect($response.ResponseType).to.equal('ApiVirtualFolderPoco')
      // Check if virtual directory is created for new user
      expect($response.Response.UserGroupGUID).to.equal(createUserDetails.UserGUID)
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
      // initializing virtualFolderGUID
      createUserDetails.Id = $response.Response.Id
    })
  })

  it('verify that admin can get information about virtual directories through API', () => {
    cy.getUsersVirtualDirectoriesApiRequest(serverDetails, createUserDetails).then(($response) => {
      // Check if response type is api virtual directory folder response
      expect($response.ResponseType).to.equal('ApiVirtualFolderResponse')
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.equal('Success')
      // Check if virtual folder id  exist in virtual directory list or not
      const VirtualFolders = $response.Response.VirtualFolderList.map(VirtualFolders => label.Id in VirtualFolders)
      expect(VirtualFolders).to.include(true)
    })
  })

  afterEach('delete user through API', () => {
    // deleting virtual directory
    cy.deleteUserVirtualDirectoryApiRequest(createUserDetails).then(($response) => {
    // check if ErrorStr Is success
      expect($response.Result.ErrorStr).to.eq('Success')
      cy.deleteUserApiRequest(createUserDetails.bearerToken, serverDetails.serverName, createUserDetails.username).then(($response) => {
        // check if ErrorStr is Success
        expect($response.Result.ErrorStr).to.eq('Success')
      })
    })
  })
})
