/**
 * @description
 * This spec file contains test to ensure admin can update PGP keys through API
 *
 * @assertions
 * To verify that admin can update PGP keys through API
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
    serverName: `qa auto server ${Cypress.dayjs().format('ssmmhhMMYYY')}`
  }
  const keyDetails = {
    KeyType: 'pgp',
    keyName: `qa auto pgp key ${Cypress.dayjs().format('ssmmhhMMYY')}`,
    KeyAlg: 'RSA',
    newKeyName: 'updated key name',
    keyLen: 1024
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
    // create new server
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      // Check if response type is api server list response
      expect($response.ResponseType).to.equal('ApiServerListResponse')
      // Check if errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      serverDetails.serverGUID = $response.Response.ServerNodeGUID
    })
    // creating new PGP key
    cy.postCreateServerPGPKey(keyDetails, serverDetails).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiPgpKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if key with specified name is created
      const keyid = $response.Response.Keys[0].Id
      keyDetails.Id = keyid
    })
  })

  it('updating keyName', () => {
    cy.UpdateServerPGPKeyApiRequest(serverDetails, keyDetails).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiPgpKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('Success')
      // check if key with specified name is created
      const keyName = $response.Response.Keys.map(key => key.Document.Name)
      expect(keyName).to.include(keyDetails.newKeyName)
    })
  })

  afterEach('delete server through API', () => {
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
