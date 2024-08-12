/**
 * @description
 * This spec file contains test to ensure admin can get state of a server through API
 *
 * @assertions
 * To verify that admin can get state of a server through API
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
    serverName: `qa auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
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
    // creating new server
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      serverDetails.ServerNodeGUID = $response.Response.ServerNodeGUID
    })
  })

  it('verify that admin can get the state of a Server through API', () => {
    cy.getServerState(serverDetails).then(($response) => {
      // Check if response type is api server info
      expect($response.ResponseType).to.equal('ApiServerInfo')
      // Check if ErrorStr is equal to success
      expect($response.Result.ErrorStr).to.equal('Success')
      // verify ServerNodeGUID
      expect($response.Response.ServerNodeGUID).to.equal(serverDetails.ServerNodeGUID)
      // verify server name
      expect($response.Response.ServerName).to.equal(serverDetails.serverName)
      // check if server is running
      expect($response.Response.RunAtStartup).to.equal(1)
    })
  })

  afterEach('delete server through API', () => {
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
