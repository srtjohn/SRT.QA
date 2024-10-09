import label from '../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can write event text variable in custom log or file
 *
 * @issueID - NX-I1264
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when user uploads a file
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
    username: `qa-auto-event-text-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
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
  const newDir = `/New Folder ${Cypress.dayjs().format('ssmhMMY')}`
  const remoteDirFile = `.${newDir}/file2.txt`
  const actionType = label.writeToFile
  const eventName = `file_upload_event_text${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write event text to a file when a file upload happens'
  const customFileName = 'log.txt'
  const customFilePath = `./${customFileName}`
  const customText = '%EVENTTEXT%'

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
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.fileEvents, label.fileUploadWrite, label.uploadWriteSuccess)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    cy.task('sftpCreateDirectory', { remoteDir: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"${newDir} directory created"`)
      cy.task('endSFTPConnection')
    })
    // uploading a file
    cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })
    // verify if log file is created
    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(customFileName)
      cy.task('endSFTPConnection')
    })
    // verify the content in the file
    cy.task('sftpReadFile', { remoteDirFile: customFilePath, configSFTP }).then(p => {
      expect(p).to.include(label.uploadWriteSuccess)
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
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
