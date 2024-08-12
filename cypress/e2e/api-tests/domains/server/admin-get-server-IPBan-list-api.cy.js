import label from '../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can get IPBan list of a server through API
 *
 * @assertions
 * To verify that admin can get the IPBan list of a server through API
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
    serverName: label.ApiTestingAutomation
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
  })

  it('verify that admin can get the IPBan list through API', () => {
    cy.getIPBanListApiRequest(serverDetails).then(($response) => {
      // Check if response type is api ip ban info
      expect($response.ResponseType).to.equal('ApiIPBanInfo')
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.equal('Success')
      // Check if IPbans list exist  or not
      expect($response.Response).to.have.keys(label.IPBans)
    })
  })

  afterEach('logout through API', () => {
    // calling logout function
    cy.postLogoutAuthenticateApiRequest(serverDetails.bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
