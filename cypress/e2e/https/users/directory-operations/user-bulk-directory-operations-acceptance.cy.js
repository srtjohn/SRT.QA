import label from '../../../../fixtures/label.json'
import htmlSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../selectors/user-dir-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify bulk users directory operations
 *
 * @file
 * Srt.QA\cypress\e2e\user\user-directory-bulk-commands-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing user}
 *
 * @assertions
 * verify user can create multiple directories
 * verify user can download multiple directories
 * verify user can share multiple directories
 * verify user can move multiple directories
 * verify user can copy multiple directories
 * verify user can delete multiple directories
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing user}', () => {
  const userData = Cypress.env('user')
  const userInfo = {
    username: userData.directoryOperations.bulk,
    password: userData.Password
  }
  const shareAsText = 'bulk share'

  const folderOne = 'autoFolder1'
  const folderTwo = 'autoFolder2'

  const path = `qa-do-not-delete-folder/${folderOne}`
  const path2 = `qa-do-not-delete-folder/${folderTwo}`
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: 'bulkdir',
    password: '123456'
  }
  function folderSelection (folderName) {
    switch (folderName) {
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
    cy.contains(userDirSelectors.roleCell, folderOne)
      .prev(htmlSelectors.div).click({ force: true })
    cy.contains(userDirSelectors.roleCell, folderTwo)
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
      if ($resp.text().includes(folderOne) && $resp.text().includes(folderTwo)) {
        cy.log('file exists')
        bulkMenuNavigation('Delete')
      }
    })

    // creating two folders to perform bulk operations
    cy.get(userDirSelectors.addFolderIcon).click()
    cy.get(userDirSelectors.folderNameField).type(folderOne)
    cy.get(userDirSelectors.buttonList).contains(label.add).click()
    cy.get(userDirSelectors.addFolderIcon).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(userDirSelectors.folderNameField).type(folderTwo)
    cy.get(userDirSelectors.buttonList).contains(label.add).click()
    cy.waitForNetworkIdle(1000, { log: false })
  })

  it('verify user can download multiple directories', () => {
    bulkMenuNavigation('Download')
    cy.contains(userDirSelectors.roleCell, folderOne)
      .prev(htmlSelectors.div).click()
    cy.contains(userDirSelectors.roleCell, folderTwo)
      .prev(htmlSelectors.div).click()
    cy.verifyDownload('files.zip')
  })

  it('verify user can share multiple directories', () => {
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

  it('verify user can move multiple directories', () => {
    bulkMenuNavigation('Move')
    folderSelection('QA')
    cy.wait(5000)
    cy.get(userDirSelectors.roleCell).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(folderOne).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(folderTwo).should('be.visible')
    cy.task('endSFTPConnection')
    let remoteFile = path
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
    remoteFile = path2
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
  })

  it.skip('verify user can copy multiple directories', () => {
    bulkMenuNavigation('Copy')
    folderSelection('QA')
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(folderOne).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(folderTwo).should('be.visible')
    cy.task('endSFTPConnection')
    let remoteFile = path
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
    remoteFile = path2
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
    bulkMenuNavigation('Delete')
    cy.get(userDirSelectors.folderNames).contains('..').click()
  })

  afterEach('verify user can delete multiple directories', () => {
    bulkMenuNavigation('Delete')
  })
})
