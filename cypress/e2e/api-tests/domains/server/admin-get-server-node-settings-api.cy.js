import label from '../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can get server node settings through API
 *
 * @assertions
 * To verify that admin can get server node settings through API
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
    serverName: label.ApiTestingAutomation,
    serverNodeName: `qa auto server node ${Cypress.dayjs().format('ssmmhhMMYY')}`
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
    // creating a server node
    cy.createServerNodeApiRequest(serverDetails).then(($response) => {
      // Check if response type is Api Server Params Nodes Poco
      expect($response.ResponseType).to.equal('ApiServerParamsNodesPoco')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check server node name
      expect($response.Response.ServerNodeName).to.equal(serverDetails.serverNodeName)
      // initializing serverNodeGUID
      serverDetails.serverNodeGUID = $response.Response.ServerNodeGUID
    })
  })

  it('verify that admin get server node settings through API', () => {
    cy.getServerNodeSettingsApiRequest(serverDetails).then(($response) => {
      // Check if response type is Api Server Nodes List
      expect($response.ResponseType).to.equal('ApiServerParamsNodesPoco')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check server node name and server node GUID
      expect($response.Response.ServerNodeName).to.equal(serverDetails.serverNodeName)
      expect($response.Response.ServerNodeGUID).to.equal(serverDetails.serverNodeGUID)
    })
  })

  afterEach('delete server node through API', () => {
    // calling delete function
    cy.deleteServerNodeApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
