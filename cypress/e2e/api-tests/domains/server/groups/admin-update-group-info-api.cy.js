import label from '../../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to verify if new group exists in group list through Api
 *
 * @assertions
 * To verify that admin can update group through API
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
    serverName: `qa auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const groupDetails = {
    groupName: `qa-auto-group-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    updatedGroupName: label.autoGroupName
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

    // creating a server
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if serverName exist in server list or not
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
    cy.updateGroupInfoApiRequest(groupDetails, serverDetails).then(($response) => {
    // Check if response type is Api Group Params Poco
      expect($response.ResponseType).to.equal('ApiGroupParamsPoco')
      // Check if ErrorStr is success or not
      expect($response.Result.ErrorStr).to.equal('Success')
      groupDetails.groupName = $response.Response.GroupName
    })
  })

  afterEach('delete group through API', () => {
    // deleting the server
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
