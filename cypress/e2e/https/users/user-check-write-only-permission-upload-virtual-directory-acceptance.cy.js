import label from '../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that user can upload a file when append permission is denied
 *
 * @IssueID - NX-I1520
 *
 *
 * @breadcrumb
 * User Login > check permissions
 *
 * @assertions
 * To verify that user can upload a file
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('login', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const CreateUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }

  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: `qa-auto-virtual-directory-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    AllowAce: '-W-D---LI----',
    DenyAce: '--A--------XU'
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: CreateUserDetails.username,
    password: CreateUserDetails.password
  }
  const localPath = '../fixtures/local.txt'
  const remoteDirFileName = `qa-auto-file-${Cypress.dayjs().format('ssmmMMY')}`
  const remoteDirFile = `./${virtualDirectoryDetails.Path}/${remoteDirFileName}`
  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      CreateUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(CreateUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(CreateUserDetails.username)
      CreateUserDetails.UserGUID = $response.Response.UserGUID
    })

    cy.postCreateUserVirtualDirectoryApiRequest(CreateUserDetails, virtualDirectoryDetails).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })

  it('verify that user can upload a file', () => {
  // testing file upload
    cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })
    cy.task('sftpListFiles', { remoteDir: `/${virtualDirectoryDetails.Path}`, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(remoteDirFileName)
      cy.task('endSFTPConnection')
    })
    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })
  })
  afterEach('deleting user', () => {
    // calling delete user function
    cy.deleteUserApiRequest(CreateUserDetails.bearerToken, CreateUserDetails.serverName, CreateUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
