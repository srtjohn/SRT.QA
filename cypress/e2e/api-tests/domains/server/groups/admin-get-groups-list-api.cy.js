/**
 * @description
 * This spec file contains test to verify if new group exists in group list or not
 *
 * @assertions
 * To verify that admin can get group list through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('get groups list', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: `qa-auto-server${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const groupDetails = {
    groupName: `qa-auto-group${Cypress.dayjs().format('ssmmhhMMYY')}`
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
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      groupDetails.bearerToken = serverDetails.bearerToken
    })

    // creating a new group
    cy.postCreateGroupApiRequest(groupDetails, serverDetails).then(($response) => {
    // Check if response type is Api Group Params Poco
      expect($response.ResponseType).to.equal('ApiGroupParamsPoco')
      // Check if newly created group is present in response
      expect($response.Response.GroupName).to.equal(groupDetails.groupName)
      groupDetails.GroupGUID = $response.Response.GroupGUID
      groupDetails.AuthGUID = $response.Response.AuthGUID
    })
  })

  it('verify that new group exist group list or not', () => {
    cy.getGroupsListApiRequest(groupDetails, serverDetails).then(($response) => {
      // Check if response type is Api Group List
      expect($response.ResponseType).to.equal('ApiGroupList')
      // Check if ErrorStr is success or not
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if new group exists in group list or not
      const groupName = $response.Response.GroupList.map(group => group.GroupName)
      expect(groupName).to.include(groupDetails.groupName)
      // Check if new group GroupGUID exist in group list or not
      const groupGUID = $response.Response.GroupList.map(group => group.GroupGUID)
      expect(groupGUID).to.include(groupDetails.GroupGUID)
      // Check if new group AuthGUID exist in group list or not
      const groupAuthGUID = $response.Response.GroupList.map(group => group.AuthGUID)
      expect(groupAuthGUID).to.include(groupDetails.AuthGUID)
    })
  })

  afterEach('delete group through API', () => {
    // calling delete function
    cy.deleteGroupApiRequest(groupDetails, serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
