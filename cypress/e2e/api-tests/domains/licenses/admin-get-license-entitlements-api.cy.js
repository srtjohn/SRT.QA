/**
 * @description
 * This spec file contains test to ensure admin can get license entitlements through api
 *
 * @assertions
 * To verify that admin can get license information
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

let bearerToken = null
describe('GET /api/Licenses/Entitlements', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
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
      bearerToken = $response.Response.SessionInfo.BearerToken
    })
  })

  it('verify that admin can get license entitlements through API', () => {
    cy.getLicenseEntitlementsApiRequest(bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // Check if file sharing is enabled
      expect($response.Response.FileSharing).to.equal(true)
    })
  })
})
