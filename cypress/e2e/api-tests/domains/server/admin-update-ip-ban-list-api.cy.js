/**
 * @description
 * This spec file contains test to ensure that admin can update IP ban list through API
 *
 * @assertions
 * To verify that admin can update IP ban list through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 *
 */

describe('PATCH /api/Servers/IPBans', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: `qa auto server ${Cypress.dayjs().format('ssmmhhMMYYY')}`
  }
  const ipToBan = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
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
    // create new server
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      serverDetails.serverGUID = $response.Response.ServerNodeGUID
    })
  })

  it('updating keyName', () => {
    cy.updateIPBanListApiRequest(serverDetails, ipToBan).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiIPBanInfo')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
    cy.getIPBanListApiRequest(serverDetails).then(($response) => {
      // Check if response type is api ip ban info
      expect($response.ResponseType).to.equal('ApiIPBanInfo')
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // Check if ip address banned
      expect($response.Response.IPBans[0].IpAddress).to.equal(ipToBan)
    })
  })

  afterEach('delete server through API', () => {
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
  })
})
