import label from '../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when a user is deleted , custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when a user is deleted
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
  const firstUserDetails = {
    username: `qa-auto-user-to-delete-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const secondUserDetails = {
    username: `qa-auto-delete-user-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: '123456',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: secondUserDetails.username,
    password: secondUserDetails.password
  }
  const remoteDir = '/'
  const actionType = 'Write to custom log or file'
  const eventName = `delete_user_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a user is deleted'
  const customFileName = 'log.txt'
  const customFilePath = `./${customFileName}`
  const customText = `this file ${customFileName} was created when ${firstUserDetails.username} was deleted`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      firstUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    // creating two users
    cy.postCreateUserApiRequest(firstUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(firstUserDetails.username)
      secondUserDetails.bearerToken = firstUserDetails.bearerToken
    })

    cy.postCreateUserApiRequest(secondUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(secondUserDetails.username)
      homeDir = $response.Response.General.HomeDir
      firstUserDetails.bearerToken = secondUserDetails.bearerToken
    })

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('creating new event for user deleted', () => {
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.userEvents, label.userAccountDeleted)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)
    // calling delete user function for first user
    cy.deleteUserApiRequest(firstUserDetails.bearerToken, firstUserDetails.serverName, firstUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
      secondUserDetails.bearerToken = firstUserDetails.bearerToken
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
  })

  afterEach('deleting file,event and user', () => {
    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: customFilePath, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${customFilePath}"`)
      cy.task('endSFTPConnection')
    })

    // deleting the event
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.deleteEvent(eventName, true)

    // calling delete user function
    cy.deleteUserApiRequest(secondUserDetails.bearerToken, secondUserDetails.serverName, secondUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
