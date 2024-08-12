import label from '../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can create DSA SSH keys through API
 *
 * @assertions
 * To verify that admin can create SSH keys through API
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
    serverName: label.ApiTestingAutomation
  }
  const keyDetails = {
    KeyType: 'SSH',
    keyName: `qa auto SSH key ${Cypress.dayjs().format('ssmmhhMMYY')}`,
    KeyAlg: 'DSA'
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

  it('DSA 1024 Key', () => {
    keyDetails.keyLen = 1024
    // creating new SSH key
    cy.postCreateServerSSHKey(keyDetails, serverDetails).then(($response) => {
      // Check if response type is Api SSHKey List
      expect($response.ResponseType).to.equal('ApiSshKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if key with specified name is created
      const keyName = $response.Response.Keys.map(key => key.Document.Name)
      expect(keyName).to.include(keyDetails.keyName)
    })
  })

  afterEach('delete SSH through API', () => {
    // calling delete function
    cy.deleteServerSSHKeyApiRequest(serverDetails, keyDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
