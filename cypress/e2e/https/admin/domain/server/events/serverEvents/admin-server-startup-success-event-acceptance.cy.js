import label from '../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when server startup is successful, custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when server startup is successful
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
let homeDir = null
describe.skip('Login > {existing server} > events > create new event', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const createUserDetails = {
    username: `qa-auto-server-startup-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
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
  const actionType = label.writeToFile
  const eventName = `server_startup_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a server startup is successful'
  const customFileName = 'log.txt'
  const customFilePath = `./${customFileName}`
  const customText = `this file ${customFileName} was created when ${label.autoServerName} was started`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      homeDir = $response.Response.General.HomeDir
    })

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.waitForNetworkIdle(1000, { log: false })
  })

  it('creating new event for file download/read', () => {
    const filePath = `${homeDir}\\${customFileName}`
    cy.createEvent(label.serverEvents, label.serverStartSuccess)

    // adding actions
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

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

  afterEach('deleting event and user', () => {
    // deleting the file
    cy.task('sftpDeleteFile', { newRemoteDir: customFilePath, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${customFilePath}"`)
      cy.task('endSFTPConnection')
    })
    // deleting the event
    cy.deleteEvent(eventName)
    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
