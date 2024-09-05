import label from '../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to verify that user can move and rename a file simultaneously
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that user can move and rename a file simultaneously
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
    username: `qa-auto-move-rename-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: createUserDetails.username,
    password: createUserDetails.password
  }
  const remoteDir = '/'
  const newDir = '/Sub'
  const renameFile = 'renamedUploadedFile.txt'
  const renameFilePath = `.${newDir}/${renameFile}`
  const localPath = '../fixtures/local.txt'
  const remoteDirFileName = 'uploadedFile.txt'
  const remoteDirFile = `./${remoteDirFileName}`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
    })
    cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })
    cy.task('sftpCreateDirectory', { remoteDir: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"${newDir} directory created"`)
      cy.task('endSFTPConnection')
    })
    cy.waitForNetworkIdle(1000, { log: false })
  })

  it('creating new event for file rename', () => {
    // verify that file is uploaded in root directory
    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(remoteDirFileName)
      cy.task('endSFTPConnection')
    })
    // renaming file and moving
    cy.task('sftpRenameFile', { remoteDirFile, newRemoteDir: renameFilePath, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully renamed ${remoteDirFile} to ${renameFilePath}"`)
      cy.task('endSFTPConnection')
    })
    // verify file after rename in moved directory
    cy.task('sftpListFiles', { remoteDir: newDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(renameFile)
      cy.task('endSFTPConnection')
    })
  })

  afterEach('deleting event and user', () => {
    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: renameFilePath, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${renameFilePath}"`)
      cy.task('endSFTPConnection')
    })
    // deleting the directory
    cy.task('sftpDeleteDirectory', { remoteDir: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${newDir}"`)
      cy.task('endSFTPConnection')
      // deleting user
      cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
        expect($response.Result.ErrorStr).to.eq('Success')
      })
    })
  })
})
