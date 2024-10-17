import label from '../../../../../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to verify that user cannot delete a file when its permission is not granted
 *
 * @breadcrumb
 * Login > {existing server} > users > create new virtual folder
 *
 * @assertions
 * To verify that user cannot delete a file when its permission is not granted
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
describe('Login > {existing server} > events > create new event', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const createUserDetails = {
    username: `qa-auto-deny-file-delete-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: createUserDetails.username,
    password: createUserDetails.password
  }
  const denyPermissionDetails = {
    ActualPath: 'C://gpdirone//newdir',
    Path: 'newDirectory',
    AllowAce: 'RWA-NMVLIGS--',
    DenyAce: '---D-------XU'
  }
  const localPath = '../fixtures/local.txt'
  const newDir = `/${denyPermissionDetails.Path}/file.txt`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      createUserDetails.UserGUID = $response.Response.UserGUID
    })
    cy.waitForNetworkIdle(1000, { log: false })
  })

  it('verify that user cannot create a directory when its permission is not granted', () => {
    cy.postCreateUserVirtualDirectoryApiRequest(createUserDetails, denyPermissionDetails).then(($response) => {
      expect($response.Response.UserGroupGUID).to.equal(createUserDetails.UserGUID)
      createUserDetails.Id = $response.Response.Id
    })

    cy.task('sftpUploadFile', { localPath, remoteDirFile: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${newDir}"`)
      cy.task('endSFTPConnection')
    })
    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"delete: I/O error. ${newDir}"`)
      cy.task('endSFTPConnection')
    })
  })

  afterEach('deleting user', () => {
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
