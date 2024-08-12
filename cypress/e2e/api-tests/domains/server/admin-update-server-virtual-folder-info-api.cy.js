import label from '../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to update virtual directory information
 *
 * @assertions
 * To verify that admin can update virtual directory details
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('update virtual directory', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: label.ApiTestingAutomation
  }
  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: `qa auto Directory${Cypress.dayjs().format('ssmmhhMMYY')}`,
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------',
    newPath: 'updatedVirtualDirectory'
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
      virtualDirectoryDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    // creating a new virtual Directory
    cy.postCreateServerLevelVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
    // Check if response type is Api Virtual Folder Poco
      expect($response.ResponseType).to.equal('ApiVirtualFolderPoco')
      // Check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.equal('Success')
      virtualDirectoryDetails.Id = $response.Response.Id
      virtualDirectoryDetails.LinkId = $response.Response.LinkId
    })
  })

  it('update virtual directory information', () => {
    cy.updateVirtualDirectoryInfoApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
    // Check if response type is Api Virtual Folder Poco
      expect($response.ResponseType).to.equal('ApiVirtualFolderPoco')
      // Check if ErrorStr is success or not
      expect($response.Result.ErrorStr).to.equal('Success')
      // check updated path
      expect($response.Response.Path).to.equal(virtualDirectoryDetails.newPath)
    })
  })

  afterEach('delete virtual directory through API', () => {
    // calling delete function
    cy.deleteUpdatedVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
    // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
