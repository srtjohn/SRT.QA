import label from '../../../../../../../../fixtures/label.json'

/**
 * @description
 * This spec file contains test to verify that admin can create an event when directory contents are listed, custom file with custom text is also created
 *
 * @breadcrumb
 * Login > {existing server} > events > create new event
 *
 * @assertions
 * To verify that admin can create an event when directory contents are listed
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
    username: `qa-auto-directory-contents-listed-event-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
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
  const localPath = '../fixtures/local.txt'
  const remoteDirFileName = 'file.txt'
  const remoteDirFile = `${newDir}/${remoteDirFileName}`
  const actionType = label.writeToFile
  const eventName = `directory_contents_listed_event${Cypress.dayjs().format('ssmmhhMMYY')}`
  const eventDescription = 'this event is used to write to a file when a directory is listed'
  const customFileName = 'log.txt'
  const customFilePath = `./${customFileName}`
  const customText = `this file ${customFileName} was created when contents of ${newDir} was listed`

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

    cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
      cy.task('endSFTPConnection')
    })

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('creating new event for directory contents listed', () => {
    const filePath = `${homeDir}\\${customFileName}`
    // adding event
    cy.createEvent(label.directoryEvents, label.directoryContentsListed, label.directoryListedSuccess)

    // adding action
    cy.createAction(actionType, customText, filePath, eventName, eventDescription)

    // verify directory is present
    cy.task('sftpListDirs', { remoteDir, configSFTP }).then(p => {
      const dirName = p.map(dir => dir.name)
      expect(dirName).to.include(newDirName)
      cy.task('endSFTPConnection')
    })

    // verify file upload in new directory
    cy.task('sftpListFiles', { remoteDir: newDir, configSFTP }).then(files => {
      const fileName = files.map(file => file.name)
      expect(fileName).to.include(remoteDirFileName)
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

  afterEach('deleting file,directory,event and user', () => {
    // deleting the event
    cy.deleteEvent(eventName)

    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
