import label from '../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can get user filtered information through API
 *
 * @assertions
 * To verify that admin can get user information through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('get filtered user information', () => {
  const createUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.ApiTestingAutomation
  }
  const serverDetails = {
    serverName: label.ApiTestingAutomation
  }
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login through API', () => {
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
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    // creating a new user
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      // Check if response type is ApiUserParamsPoco
      expect($response.ResponseType).to.equal('ApiUserParamsPoco')
      // Check if newly created user is present in response
      expect($response.Response.Username).to.equal(createUserDetails.username)
      createUserDetails.UserGUID = $response.Response.UserGUID
      createUserDetails.AuthGUID = $response.Response.AuthGUID
    })
  })

  it('verify that admin can get filtered user information through API', () => {
    cy.getFilteredUserInfoApiRequest(serverDetails, createUserDetails).then(($response) => {
      // Check if response type is Api User Params Filtered
      expect($response.ResponseType).to.equal('ApiUserParamsFiltered')
      // check if errorStr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // Check if username is present in response
      expect($response.Response.Poco.Username).to.equal(createUserDetails.username)
    })
  })

  afterEach('deleting a user and logout', () => {
    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
    // calling logout function
    cy.postLogoutAuthenticateApiRequest(createUserDetails.bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
