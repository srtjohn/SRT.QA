import label from '../../../../../fixtures/label.json'

/**
*@description
* This spec file contains test to ensure admin can get list of users through API
*
* @requirements
* To verify that admin can get the list of users through API
*
*  @prerequisites
* valid user credentials
* - user should have valid credentials and server name
*/

describe('GET /api/Servers/{serverName}/AuthConnectors/native/Users', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const listUsersData = {
    serverName: label.autoServerName
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
      listUsersData.bearerToken = $response.Response.SessionInfo.BearerToken
    })
  })

  it('verify that admin can get the list of users through API', () => {
    cy.getListUserApiRequest(listUsersData).then(($response) => {
      // check if Response type is ApiUserList
      expect($response.ResponseType).to.equal('ApiUserList')
      // Check if autoUserName exist in users list or not
      const users = $response.Response.UserList.map(user => user.UserName)
      expect(users).to.include(label.autoUserName)
    })
  })

  afterEach('logout through API', () => {
    // calling logout function
    cy.postLogoutAuthenticateApiRequest(listUsersData.bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
