/**
 * @description
 * This spec file contains test to ensure admin can get cloud folders a user level through API
 *
 * @assertions
 * To verify that admin can get user cloud folders through API
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 */

describe('get filtered user information', () => {
  const serverDetails = {
    serverName: `qa-auto-server-${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const createUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: serverDetails.serverName
  }

  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const cloudFolderDetails = {
    cloudName: `qa-auto-cloud-folder-${Cypress.dayjs().format('ssmmhhMMYY')}`
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
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      createUserDetails.bearerToken = serverDetails.bearerToken
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
    cy.postCreateCloudFolderApiRequest(serverDetails, cloudFolderDetails).then(($response) => {
      // Check if response type is Api Cloud Folder List
      expect($response.ResponseType).to.equal('ApiCloudFolderList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')

      const cloud = $response.Response.CloudFolderList.map(name => name.CloudName)
      expect(cloud).to.include(cloudFolderDetails.cloudName)
      // initializing cloud GUID
      const cloudGUID = $response.Response.CloudFolderList[0]
      cloudFolderDetails.cloudGUID = cloudGUID.CloudGUID
    })
  })

  it('verify that admin can get user cloud folders list through API', () => {
    cy.getUserCloudFoldersApiRequest(serverDetails, createUserDetails).then(($response) => {
      // Check if response type is Api Cloud Folder List
      expect($response.ResponseType).to.equal('ApiCloudFolderList')
      // check if errorStr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // Check if username is present in response
      const cloudFolderName = $response.Response.CloudFolderList.map(name => name.CloudName)
      expect(cloudFolderName).to.include(cloudFolderDetails.cloudName)
    })
  })

  afterEach('deleting a user and logout', () => {
    // calling delete user function
    cy.deleteUserCloudFolderApiRequest(serverDetails, createUserDetails, cloudFolderDetails).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')

      expect($response.Response.CloudFolderList).to.be.empty
      serverDetails.bearerToken = createUserDetails.bearerToken
    })
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
