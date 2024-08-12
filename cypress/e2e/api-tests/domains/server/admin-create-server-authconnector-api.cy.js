import label from '../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to ensure admin can create a server auth connector through api
 *
 * @assertions
 * To verify that admin can create server through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */
let authGuid = null
describe('GET /api/Servers', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: `qa auto Server ${Cypress.dayjs().format('ssmmhhMMYY')}`
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
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if error str is success
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })

  it('verify that admin can create a server auth connector through API', () => {
    cy.postCreteServerAuthConnectorApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerParamsAuthPoco')
      // check if auth desc is ADSI Authentication
      expect($response.Response.AuthDesc).to.equal(label.adsiAuth)
      // Check if error str is success
      expect($response.Result.ErrorStr).to.equal('Success')
      authGuid = $response.Response.AdsiPoco.AuthGUID
      console.log(authGuid)
    })
  })

  afterEach('delete server through API', () => {
    cy.deleteAuthConnectorApiRequest(serverDetails, authGuid).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
