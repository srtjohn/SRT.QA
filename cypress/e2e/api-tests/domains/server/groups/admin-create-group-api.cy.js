/**
 * @description
 * This spec file contains test to ensure admin can create group through API
 *
 * @assertions
 * To verify that admin can create group through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('create new group', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: `qa auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const groupDetails = {
    GroupName: 'TestAPIGroup'
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

  it('verify that admin can create a group through API', () => {
    // creating a server
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if serverName exist in server list or not
      expect($response.Result.ErrorStr).to.equal('Success')
      groupDetails.bearerToken = serverDetails.bearerToken

      // create group
      cy.postCreateGroupApiRequest(groupDetails, serverDetails).then(($response) => {
      // Check if response type is api groups params poco
        expect($response.ResponseType).to.equal('ApiGroupParamsPoco')
        // Check if Errorstr is Success or not
        expect($response.Result.ErrorStr).to.equal('Success')
      })
    })
  })

  afterEach('delete group through API', () => {
    // calling delete function
    cy.deleteGroupApiRequest(groupDetails, serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
    // deleting the server
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
