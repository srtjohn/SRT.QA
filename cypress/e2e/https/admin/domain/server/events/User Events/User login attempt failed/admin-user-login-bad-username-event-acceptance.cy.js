import label from '../../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when user tries bad username, custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when user tries bad username
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
    username: `qa-auto-bad-username-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: createUserDetails.username,
    password: createUserDetails.password
  }
  const wrongUsername = `qa-auto-bad-username-event-use-${Cypress.dayjs().format('ssmmhhMMYY')}`
  const remoteDir = '/'
  const actionType = label.writeToFile
  const eventName = `user_bad_username_login_fail_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a user tries to login with bad username'
  const customFileName = 'log.txt'
  const customFilePath = './log.txt'
  const customText = `this file ${customFileName} was created when ${createUserDetails.username} tried to log in with bad username`

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

  it('creating new event when user login with bad username', () => {
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.userEvents, label.userLoginAttemptFailed, label.badUsername)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    // verify if log file is created
    cy.task('sftpListFiles', { remoteDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.not.include(customFileName)
      cy.task('endSFTPConnection')
    })

    cy.postUserLoginApiRequest({
      username: wrongUsername,
      password: createUserDetails.password
    }).then(($response) => {
      expect($response.auth.ErrorStr).to.eq('Invalid username or password.')
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
    cy.deleteEvent(eventName)

    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
