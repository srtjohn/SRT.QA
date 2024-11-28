import label from '../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that event gets triggered only once if there are both upload and append events
 *
 * @issueID - NX-I1492
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that event gets triggered only once
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
    username: `qa-auto-file-upload-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: `qa-auto-file-upload-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456'
  }
  const remoteDir = '/'
  const localPath = '../fixtures/local.txt'
  const remoteDirFile = './file2.txt'
  const actionType = label.writeToFile
  const customFileName = 'log.txt'
  const customFilePath = './log.txt'
  const home = true
  const uploadEvent = {
    eventName: `file_upload_event${Cypress.dayjs().format('ssmmhhMMYY')}`,
    eventDescription: 'this event is used to write to a file when a file upload happens',
    customText: 'triggered by file upload'
  }
  const appendEvent = {
    eventName: `file_append_event${Cypress.dayjs().format('ssmmhhMMYY')}`,
    eventDescription: 'this event is used to write to a file when a file append happens',
    customText: 'triggered by file append'
  }
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
    // creating event for File Upload
    cy.createEvent(label.fileEvents, label.fileUploadWrite, label.uploadWriteSuccess)
    cy.createAction(actionType, uploadEvent.customText, filePath, uploadEvent.eventName, uploadEvent.eventDescription)

    // creating event for File Upload
    cy.createEvent(label.fileEvents, label.fileAppend, label.appendSuccess, home)
    cy.createAction(actionType, appendEvent.customText, filePath, appendEvent.eventName, appendEvent.eventDescription)
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
      expect(p).to.include(uploadEvent.customText)
      expect(p).to.not.include(appendEvent.customText)
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
    cy.deleteEvent(uploadEvent.eventName)
    cy.deleteEvent(appendEvent.eventName)

    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
