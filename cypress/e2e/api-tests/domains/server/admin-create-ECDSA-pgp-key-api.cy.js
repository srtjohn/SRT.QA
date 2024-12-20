import label from '../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to ensure admin can create ECDSA PGP keys through API
 *
 * @assertions
 * To verify that admin can create PGP keys through API
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
    KeyType: 'pgp',
    keyName: `qa auto pgp key ${Cypress.dayjs().format('ssmmhhMMYY')}`,
    KeyAlg: 'ECDSA'
  }

  beforeEach('login through api', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      // Check if response type is api auth response
      expect($response.ResponseType).to.equal('ApiAuthResponse')
      // Check if ErrorStr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
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

  it('ECDSA 256 Key', () => {
    keyDetails.keyLen = 256
    // creating new PGP key
    cy.postCreateServerPGPKey(keyDetails, serverDetails).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiPgpKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // check if key with specified name is created
      const keyName = $response.Response.Keys.map(key => key.Document.Name)
      expect(keyName).to.include(keyDetails.keyName)
    })
  })
  it('ECDSA 384 Key ', () => {
    keyDetails.keyLen = 384
    // creating new PGP key
    cy.postCreateServerPGPKey(keyDetails, serverDetails).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiPgpKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // check if key with specified name is created
      const keyName = $response.Response.Keys.map(key => key.Document.Name)
      expect(keyName).to.include(keyDetails.keyName)
    })
  })
  it('ECDSA 521 Key', () => {
    keyDetails.keyLen = 521
    // creating new PGP key
    cy.postCreateServerPGPKey(keyDetails, serverDetails).then(($response) => {
      // Check if response type is Api PgpKey List
      expect($response.ResponseType).to.equal('ApiPgpKeyList')
      // Check if Errorstr is success
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
      // check if key with specified name is created
      const keyName = $response.Response.Keys.map(key => key.Document.Name)
      expect(keyName).to.include(keyDetails.keyName)
    })
  })

  afterEach('delete pgp through API', () => {
    // calling delete function
    cy.deleteServerPGPKeyApiRequest(serverDetails, keyDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('_Error.SUCCESS')
    })
  })
})
