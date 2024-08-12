/**
 * @description
 * This spec file contains test to verify if user can get filtered group information through Api
 *
 * @assertions
 * To verify that admin can get filtered group info through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('get filtered group information', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const groupDetails = {
    groupName: `qa-auto-group-${Cypress.dayjs().format('ssmmhhMMYY')}`
  }

  const serverDetails = {
    serverName: `qa-auto-server-${Cypress.dayjs().format('ssmmhhMMYY')}`
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
      groupDetails.bearerToken = serverDetails.bearerToken
    })
    // create group
    cy.postCreateGroupApiRequest(groupDetails, serverDetails).then(($response) => {
      // Check if response type is api groups params poco
      expect($response.ResponseType).to.equal('ApiGroupParamsPoco')
      // Check if Error str is Success or not
      expect($response.Result.ErrorStr).to.equal('Success')
      groupDetails.groupGUID = $response.Response.GroupGUID
    })
  })

  it('verify that new user exist in Everyone group or not', () => {
    cy.getFilteredGroupsInfoApiRequest(groupDetails, serverDetails).then(($response) => {
      // Check if response type is ApiGroupParamsPoco
      expect($response.ResponseType).to.equal('ApiGroupParamsFiltered')
      // Check if ErrorStr is success or not
      expect($response.Result.ErrorStr).to.equal('Success')
      // assertion on group name
      expect($response.Response.Poco.GroupName).to.equal(groupDetails.groupName)
      // assertion on group GUID
      expect($response.Response.Poco.GroupGUID).to.equal(groupDetails.groupGUID)
      serverDetails.bearerToken = groupDetails.bearerToken
    })
  })

  afterEach('delete group through API', () => {
  // calling delete group function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
    // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
