import label from '../../../../fixtures/label.json'
import htmlSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../selectors/user-dir-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify bulk file operations
 *
 * @file
 * Srt.QA\cypress\e2e\users\file-operations\user-bulk-file-operations-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing user}
 *
 * @assertions
 * verify user can download multiple files
 * verify user can share multiple files
 * verify user can move multiple files
 * verify user can copy multiple files
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing user}', () => {
  const userData = Cypress.env('user')
  const userInfo = {
    username: userData.fileOperations.bulk,
    password: userData.Password
  }
  const shareAsText = 'bulk share'

  const fileOne = 'local.txt'
  const fileTwo = 'local2.txt'

  const path = `qa-do-not-delete-folder/${fileOne}`
  const path2 = `qa-do-not-delete-folder/${fileTwo}`
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: 'bulkfile',
    password: '123456'
  }
  function folderSelection (fileName) {
    switch (fileName) {
      case 'QA':
        cy.contains(userDirSelectors.folderNames, label.myComputer).click()
        cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
        cy.get(userDirSelectors.buttonList).contains(label.select).click()
        break
      case 'Root':
        cy.get(userDirSelectors.folderNames).contains(label.myComputer).click()
        cy.get(userDirSelectors.buttonList).contains(label.select).click()
        break
    }
  }
  function bulkMenuNavigation (operation) {
    cy.contains(userDirSelectors.roleCell, fileOne)
      .prev(htmlSelectors.div).click({ force: true })
    cy.contains(userDirSelectors.roleCell, fileTwo)
      .prev(htmlSelectors.div).click({ force: true })
    cy.contains(userDirSelectors.parentUsers, label.twoItem).next(htmlSelectors.div).within(() => {
      switch (operation) {
        case 'Download':
          cy.get(userDirSelectors.bulkDownload).click()
          break
        case 'Share':
          cy.get(userDirSelectors.buttonList).eq(1).click()
          break
        case 'Move':
          cy.get(userDirSelectors.buttonList).eq(2).click({ force: true })
          break
        case 'Copy':
          cy.get(userDirSelectors.bulkCopy).click()
          break
        case 'Delete':
          cy.get(userDirSelectors.bulkDelete).click()
          break
      }
    })
  }

  beforeEach('login', () => {
    cy.login(userData.userBaseUrl, userInfo.username, userInfo.password)
    cy.get(htmlSelectors.p).then(($resp) => {
      if ($resp.text().includes(fileOne) && $resp.text().includes(fileOne)) {
        cy.log('file exists')
        bulkMenuNavigation('Delete')
      }
    })

    // creating two files to perform bulk operations
    cy.get(userDirSelectors.fileUpload).eq(0).selectFile('cypress/fixtures/local.txt', { force: true }, { action: 'drag-drop' })
    cy.get(userDirSelectors.fileUpload).eq(0).selectFile('cypress/fixtures/local2.txt', { force: true }, { action: 'drag-drop' })
  })

  it('verify user can download multiple files', () => {
    bulkMenuNavigation('Download')
    cy.contains(userDirSelectors.roleCell, fileOne)
      .prev(htmlSelectors.div).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.contains(userDirSelectors.roleCell, fileTwo)
      .prev(htmlSelectors.div).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.verifyDownload('files.zip')
  })

  it('verify user can share multiple files', () => {
    bulkMenuNavigation('Share')
    cy.get(userDirSelectors.shareAsField).type(shareAsText)
    cy.get(userDirSelectors.toField).click()
    cy.get(userDirSelectors.toField).type(`${label.sftpUser}{enter}`)
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.sendText).click()
    cy.get(userDirSelectors.folderNames).contains(label.mySharesText).click()
    cy.get(userDirSelectors.folderNames).contains(shareAsText).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(label.myFilesText).click()
  })

  it('verify user can move multiple files', () => {
    bulkMenuNavigation('Move')
    folderSelection('QA')
    cy.get(userDirSelectors.roleCell).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(fileOne).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(fileTwo).should('be.visible')
    cy.task('endSFTPConnection')
    let remoteFile = path
    cy.task('sftpDirectoryExist', { configSFTP, remoteFile }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
    remoteFile = path2
    cy.task('sftpDirectoryExist', { configSFTP, remoteFile }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
  })

  it.skip('verify user can copy multiple files', () => {
    bulkMenuNavigation('Copy')
    folderSelection('QA')
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(fileOne).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(fileTwo).should('be.visible')
    cy.task('endSFTPConnection')
    let remoteFile = path
    cy.task('sftpDirectoryExist', { configSFTP, remoteFile }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
    remoteFile = path2
    cy.task('sftpDirectoryExist', { configSFTP, remoteFile }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
    bulkMenuNavigation('Delete')
    cy.get(userDirSelectors.folderNames).contains('..').click()
  })

  afterEach('delete multiple files', () => {
    bulkMenuNavigation('Delete')
    cy.get(userDirSelectors.folderNames).contains(fileOne).should('not.exist')
    cy.get(userDirSelectors.folderNames).contains(fileTwo).should('not.exist')
  })
})
