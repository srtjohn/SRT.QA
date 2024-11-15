/**
 * @description
 * This spec file contains test to ensure admin can get domain ip addresses through API
 *
 * @assertions
 * To verify that admin can get the ip addresses through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

let bearerToken = null
describe('GET /api/Domain/{domainGUID}/IpAddressList', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const domainGUID = Cypress.env('api').domainGUID

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
      bearerToken = $response.Response.SessionInfo.BearerToken
    })
  })

  it('verify that admin can get the ip addresses through API', () => {
    cy.getDomainIpAddressListApiRequest(bearerToken, domainGUID).then(($response) => {
      // verify domain GUID
      expect($response.Response.IpAddresses['::1']).to.equal('::1 (IPv6 Localhost)')
      // Check if response type is api result domain info poco
      expect($response.ResponseType).to.equal('ApiIpAddressList')
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })

  afterEach('logout through API', () => {
    // calling logout function
    cy.postLogoutAuthenticateApiRequest(bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
