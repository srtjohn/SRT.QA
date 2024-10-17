import label from '../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin cannot create a user with whitespace in username through API
 *
 * @issueID - NX-I1287
 *
 * @assertions
 * To verify that admin cannot create a user with a space in username through API
 * To verify that admin cannot create a user with an empty username through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('create new user', () => {
  const usernames = [`qa-auto user-${Cypress.dayjs().format('ssmmhhMMYY')}`, ' ']
  const createUserDetails = {
    username: usernames,
    password: 'testing123',
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
  })

  it('verify that admin cannot create a user with a space in username through API', () => {
    cy.postCreateUserApiRequest({ ...createUserDetails, username: usernames[0] }).then(($response) => {
      // Check if response type is ApiUserParamsPoco
      expect($response.ResponseType).to.equal('ApiUserParamsPoco')
      // Check error message
      expect($response.Result.SubErrorStr).to.equal('Whitespace not allowed in username.')
      // Check error message
      expect($response.Result.ErrorStr).to.equal('The user credentials were invalid')
    })
  })

  it('verify that admin cannot create a user with an empty username through API', () => {
    cy.postCreateUserApiRequest({ ...createUserDetails, username: usernames[1] }).then(($response) => {
      // Check if response type is ApiUserParamsPoco
      expect($response.ResponseType).to.equal('ApiUserParamsPoco')
      // Check error message
      expect($response.Result.SubErrorStr).to.equal('Whitespace not allowed in username.')
      // Check error message
      expect($response.Result.ErrorStr).to.equal('The user credentials were invalid')
    })
  })

  afterEach('deleting a user and logout', () => {
    // calling logout function
    cy.postLogoutAuthenticateApiRequest(createUserDetails.bearerToken).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
