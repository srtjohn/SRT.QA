import label from '../../../../../cypress/fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can get list of directory access through API
 *
 * @assertions
 * To verify that admin can get list of directory access through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 *
 */

describe('GET /api/Servers', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: label.ApiTestingAutomation
  }
  const DirectoryDetails = {
    Path: 'testDirectory',
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------',
    Level: 'Svr'
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
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    // creating new Directory access
    cy.postCreateServerLevelDirAccessApiRequest(serverDetails, DirectoryDetails).then(($response) => {
      // Check if response type is Api DirAccess Poco
      expect($response.ResponseType).to.equal('ApiDirAccessPoco')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // initializing directory parameters
      DirectoryDetails.DirectoryId = $response.Response.Id
    })
  })

  it('verify that admin can get directory access list through API', () => {
    cy.getServerLevelDirAccessApiRequest(serverDetails).then(($response) => {
      // Check if response type is Api DirAccess Response
      expect($response.ResponseType).to.equal('ApiDirAccessResponse')
      // Check if ErrorStr is equal to success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if directory Id is present or not
      const DirectoryId = $response.Response.DirAccessList.map(directory => directory.Id)
      expect(DirectoryId).to.include(DirectoryDetails.DirectoryId)
      // check directory is created at server level
      const directoryLevel = $response.Response.DirAccessList.map(directory => directory.Level)
      expect(directoryLevel).to.include(DirectoryDetails.Level)
      // verify Path
      const directoryPath = $response.Response.DirAccessList.map(directory => directory.Path)
      expect(directoryPath).to.include(DirectoryDetails.Path)
    })
  })

  afterEach('delete directory access through API', () => {
    // calling delete function
    cy.deleteServerLevelDirAccessApiRequest(serverDetails, DirectoryDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
