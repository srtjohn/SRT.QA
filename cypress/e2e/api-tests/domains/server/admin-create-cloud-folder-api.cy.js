/**
 * @description
 * This spec file contains test to ensure admin can create a cloud folder at server level through API
 *
 * @assertions
 * To verify that admin can create a cloud folder through API
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
  const serverDetails = {
    serverName: `qa auto server${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const cloudFolderDetails = {
    cloudName: `qa auto cloud folder ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }

  beforeEach('login through api', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      // Check if response type is api auth response
      expect($response.ResponseType).to.equal('ApiAuthResponse')
      // Check if ErrorStr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // Check if IsAdmin is true
      expect($response.Response.AuthInfo.IsAdmin).to.equal(true)
      // Check if BearerToken exists in SessionInfo
      expect($response.Response.SessionInfo.BearerToken).to.exist
      // Check if BearerToken is not empty
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
  })

  it('verify that admin can create a cloud folder through API', () => {
    cy.postCreateCloudFolderApiRequest(serverDetails, cloudFolderDetails).then(($response) => {
      // Check if response type is Api Cloud Folder List
      expect($response.ResponseType).to.equal('ApiCloudFolderList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')

      const cloud = $response.Response.CloudFolderList.map(name => name.CloudName)
      expect(cloud).to.include(cloudFolderDetails.cloudName)
    })
  })

  afterEach('delete server through API', () => {
    // calling delete function
    cy.deleteCloudFolderApiRequest(serverDetails, cloudFolderDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
  })
})
