import label from '../../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when user delete a directory, custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when user delete a directory
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
    username: `qa-auto-directory-removed-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
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
  const newDirName = 'Sub'
  const newDir = `/${newDirName}`
  const actionType = label.writeToFile
  const eventName = `directory_removed_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a directory is removed'
  const customFileName = 'log.txt'
  const customFilePath = `./${customFileName}`
  const customText = `this file ${customFileName} was created when ${newDir} was removed`

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      homeDir = $response.Response.General.HomeDir
    })

    cy.task('sftpCreateDirectory', { remoteDir: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"${newDir} directory created"`)
      cy.task('endSFTPConnection')
    })

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('creating new event for directory removed', () => {
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.directoryEvents, label.directoryRemoved, label.directoryRemoveSuccess)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    // verify directory is present
    cy.task('sftpListDirs', { remoteDir, configSFTP }).then(p => {
      const dirName = p.map(dir => dir.name)
      expect(dirName).to.include(newDirName)
      cy.task('endSFTPConnection')
    })

    // deleting the directory
    cy.task('sftpRemoveDirectory', { remoteDirPath: newDir, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"Successfully removed directory"')
      cy.task('endSFTPConnection')
    })

    // verify directory is deleted
    cy.task('sftpListDirs', { remoteDir, configSFTP }).then(p => {
      const dirName = p.map(dir => dir.name)
      expect(dirName).to.not.include(newDirName)
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
      expect(p).to.include(customText)
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
