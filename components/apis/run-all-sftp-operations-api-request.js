import label from '../../cypress/fixtures/label.json'
import navigationSelectors from '../../selectors/navigation/left-navigation-selectors.json'
/**
 *
 * This command is used to execute all sftp operations
 *
 * This command takes username as a parameter
 *
 * @params
 * parameters on enter group information page
 * @param {required} username  // A variable containing account username
 *
 * @example
 * cy.runSftpOperations(username)
 */

Cypress.Commands.add('runSftpOperations', (Username) => {
  Cypress.log({
    name: 'runSftpOperationsCommand'
  })

  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: Username,
    password: '123456'
  }

  const remoteDir = '/path/to/new/dir'
  const remoteDirFile = '/path/to/new/dir/file2.txt'
  const newRemoteDir = '/path/to/new/dir/newName.txt'
  const localPath = './../fixtures/file2.txt'
  const localPathForDownload = './../fixtures'
  const remoteDirCopy = `/path/to/new/${Cypress.dayjs().format('ssmYY')}.txt`
  const remoteDirPath = '/path'

  cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  // navigate to events
  cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
  cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
  cy.get(navigationSelectors.textLabelSelector).contains(label.serverActivity).should('be.visible').click()
  // sftp operations
  console.log(configSFTP)
  cy.task('sftpCurrentWorkingDirectory', configSFTP).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal('"/"')
    cy.task('endSFTPConnection')
  })

  cy.task('sftpCreateDirectory', { remoteDir, configSFTP }).then(p => {
    if (p === 'directory exists') {
      cy.log('Directory already exists, proceeding to delete')
      cy.task('sftpDeleteDirectory', { remoteDir, configSFTP }).then(p => {
        expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${remoteDir}"`)
        cy.task('endSFTPConnection')
        cy.log('Directory deleted, creating again')
        cy.task('sftpCreateDirectory', { remoteDir, configSFTP }).then(p => {
          expect(`${JSON.stringify(p)}`).to.equal(`"${remoteDir} directory created"`)
          cy.task('endSFTPConnection')
        })
      })
    } else {
      expect(`${JSON.stringify(p)}`).to.equal(`"${remoteDir} directory created"`)
      cy.task('endSFTPConnection')
    }
  })

  cy.task('sftpUploadFile', { localPath, remoteDirFile, configSFTP }, { timeout: 540000 }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal(`"${localPath} was successfully uploaded to ${remoteDirFile}!"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpEditFile', { remoteDirFile, configSFTP }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal(`"Uploaded data stream to ${remoteDirFile}"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpRenameFile', { remoteDirFile, newRemoteDir, configSFTP }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal(`"Successfully renamed ${remoteDirFile} to ${newRemoteDir}"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpCopyFile', { newRemoteDir, remoteDirCopy, configSFTP }, { timeout: 540000 }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal(`"${newRemoteDir} copied to ${remoteDirCopy}"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpDownloadDirectory', { remoteDir, localPathForDownload, configSFTP }, { timeout: 420000 }).then(p => {
    cy.log(`Remote working directory is ${JSON.stringify(p)}`)
    expect(`${JSON.stringify(p)}`).to.equal(`"${remoteDir} downloaded to ${localPathForDownload}"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpDeleteFile', { configSFTP, newRemoteDir }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal(`"Successfully deleted ${newRemoteDir}"`)
    cy.task('endSFTPConnection')
  })

  cy.task('sftpRemoveDirectory', { configSFTP, remoteDirPath }).then(p => {
    expect(`${JSON.stringify(p)}`).to.equal('"Successfully removed directory"')
    cy.task('endSFTPConnection')
  })
})
