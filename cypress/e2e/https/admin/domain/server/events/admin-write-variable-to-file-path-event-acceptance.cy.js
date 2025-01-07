import label from '../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can write variable in custom log or file path
 *
 * @issueID - NX-I1223
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can write variable in custom log or file path
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

let homeDir = null
describe('Login > {existing server} > events > create new event', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const createUserDetails = {
    username: `qa-auto-file-path-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
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
  const localPath = '../fixtures/local.txt'
  const remoteDirFileName = 'file2.txt'
  const remoteDirFile = `./${remoteDirFileName}`
  const actionType = label.writeToFile
  const eventName = `file-path-variable-event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a file upload happens'
  const customText = '%USERNAME% %PROTOCOL%'
  const customFilePath = `./${createUserDetails.username}.txt`
  const protocol = 'SFTP'

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      homeDir = $response.Response.General.HomeDir
    })

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('creating new event for file upload/write', () => {
    const filePath = `${homeDir}\\%USERNAME%.txt`
    // adding event
    cy.createEvent(label.fileEvents, label.fileUploadWrite, label.uploadWriteSuccess)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    // uploading a file
    cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })

    // verify if log file is created
    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(`${createUserDetails.username}.txt`)
      cy.task('endSFTPConnection')
    })

    // verify content in file
    cy.task('sftpReadFile', { remoteDirFile: customFilePath, configSFTP }).then(p => {
      expect(p).to.include(createUserDetails.username).and.to.include(protocol)
      cy.task('endSFTPConnection')
    })

    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: customFilePath, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${customFilePath}"`)
      cy.task('endSFTPConnection')
    })
  })

  afterEach('deleting event and user', () => {
    // deleting the event
    cy.deleteEvent(eventName)

    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
