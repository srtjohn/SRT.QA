import label from '../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when user is deleted, custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when user is deleted
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
let homeDir = null
const home = true
describe('Login > {existing server} > events > create new event', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const createUserDetails = {
    username: `qa-auto-account-deleted-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const logFileUserDetails = {
    username: `qa-auto-log-file-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: logFileUserDetails.username,
    password: logFileUserDetails.password
  }
  const remoteDir = '/'
  const actionType = label.writeToFile
  const eventName = `user_bad_username_login_fail_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a user account is deleted'
  const customFileName = 'log.txt'
  const customFilePath = './log.txt'
  const customText = `this file ${customFileName} was created when ${createUserDetails.username} account was deleted`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      logFileUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(logFileUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(logFileUserDetails.username)
      homeDir = $response.Response.General.HomeDir
      createUserDetails.bearerToken = logFileUserDetails.bearerToken
    })
    // creating home directory
    cy.postUserLoginApiRequest(logFileUserDetails).then(($response) => {
      expect($response.auth.ErrorStr).to.eq('Success')
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('creating new event for user deleted', () => {
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.userEvents, label.userAccountDeleted)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.not.include(customFileName)
      cy.task('endSFTPConnection')
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
    })

    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      expect($response.Result.ErrorStr).to.eq('Success')
    })

    // verify if log file is created
    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(customFileName)
      cy.task('endSFTPConnection')
    })

    // verify the content in the file
    cy.task('sftpReadFile', { remoteDirFile: customFilePath, configSFTP }).then(p => {
      expect(p).to.include(customText)
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
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.deleteEvent(eventName, home)

    cy.deleteUserApiRequest(createUserDetails.bearerToken, logFileUserDetails.serverName, logFileUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
