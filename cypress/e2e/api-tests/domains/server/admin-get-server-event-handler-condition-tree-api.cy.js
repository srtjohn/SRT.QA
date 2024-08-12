/**
 * @description
 * This spec file contains test to ensure admin can get server events condition tree through API
 *
 * @assertions
 * To verify that admin can get server events condition tree through API
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
  const RequestType = 'EventHandlerConditionTree'
  const Eventname = 'qa testing event'

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
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      serverDetails.ServerGUID = $response.Response.ServerNodeGUID
      serverDetails.ServerGUID = $response.Response.ServerNodeGUID
    })
    // create new server event
    cy.postCreateServerEventsApiRequest(serverDetails, Eventname).then(($response) => {
      // Check if response type is Api Event Handlers condition meta
      expect($response.ResponseType).to.equal('ApiEventHandlerConditionMeta')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })

  it('verify that admin can get event handler condition tree through API', () => {
    cy.getServerEventsApiRequest(serverDetails, RequestType).then(($response) => {
      // Check if response type is Api Event Handler Condition Tree
      expect($response.ResponseType).to.equal('ApiEventHandlerConditionTree')
      // Check if ErrorStr is equal to success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if created event is present in response or not
      expect($response.Response.Name).to.equal('All Conditions')
      // check if response contains event handlers
      expect($response.Response.Children).to.not.be.empty
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
