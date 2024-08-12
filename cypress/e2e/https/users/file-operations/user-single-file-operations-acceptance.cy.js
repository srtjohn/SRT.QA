import label from '../../../../fixtures/label.json'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../selectors/user-dir-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify single file operations for existing user
 *
 * @file
 * Srt.QA\cypress\e2e\users\file-operations\user-single-file-operations-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing user}
 *
 * @assertions
 * verify user can download file
 * verify user can share file
 * verify user can rename file
 * verify user can move file
 * verify user can copy file
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing user}', () => {
  const userData = Cypress.env('user')
  const userInfo = {
    username: userData.fileOperations.single,
    password: userData.Password
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: 'singlefile',
    password: '123456'
  }
  const fileName = 'local.txt'
  const renameFileName = 'local-new.txt'
  function dotNavigation (operation, file = fileName) {
    cy.contains(htmlTagSelectors.div, file).parents(userDirSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).click()
    cy.get(userDirSelectors.editParent).eq(5).within(() => {
      switch (operation) {
        case 'Download':
          cy.get(userDirSelectors.bulkDownload).click()
          break
        case 'Share':
          cy.get(userDirSelectors.buttonList).eq(2).click()
          break
        case 'Drop Zone':
          cy.get(userDirSelectors.bulkDropZone).click()
          break
        case 'Rename':
          cy.get(userDirSelectors.fileRename).click()
          break
        case 'Move':
          cy.get(userDirSelectors.bulkMove).click()
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

  function enterShareInfo (toUser) {
    cy.get(userDirSelectors.shareAsField).type(fileName)
    cy.get(userDirSelectors.toField).click()
    cy.get(userDirSelectors.toField).type(`${toUser}{enter}`)
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.sendText).click()
  }

  beforeEach('login', () => {
    cy.login(userData.userBaseUrl, userInfo.username, userInfo.password)
    cy.get(htmlTagSelectors.p).then(($resp) => {
      if ($resp.text().includes(fileName)) {
        cy.log('file exists')
        dotNavigation('Delete')
      }
    })
    cy.get(userDirSelectors.fileUpload).eq(0).selectFile('cypress/fixtures/local.txt', { force: true }, { action: 'drag-drop' })
    cy.waitForNetworkIdle(1000, { log: false })
  })

  const pathMove = `qa-do-not-delete-folder/${fileName}`
  const remoteFile = `/${renameFileName}`

  it('verify user can download file', () => {
    dotNavigation('Download')
    cy.verifyDownload(fileName)
  })

  it('verify user can share file', () => {
    dotNavigation('Share', fileName)
    enterShareInfo(label.sftpUser)
    cy.get(userDirSelectors.folderNames).contains(label.mySharesText).click()
    cy.get(userDirSelectors.folderNames).contains(fileName).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(label.myFilesText).click()
  })

  it('verify user can rename file', () => {
    dotNavigation('Rename')
    cy.get(userDirSelectors.fileNameField).eq(1).clear()
    cy.get(userDirSelectors.fileNameField).eq(1).type(renameFileName)
    cy.get(userDirSelectors.buttonList).contains(label.rename).click()
    cy.get(userDirSelectors.folderNames).contains(renameFileName).should('be.visible')
    cy.task('endSFTPConnection')
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')

    // changing it back to "autoFolder"
    dotNavigation('Rename', renameFileName)
    cy.get(userDirSelectors.fileNameField).eq(1).clear()
    cy.get(userDirSelectors.fileNameField).eq(1).type(fileName)
    cy.get(userDirSelectors.buttonList).contains(label.rename).click()
  })

  it('verify user can move file', () => {
    dotNavigation('Move')
    cy.get(userDirSelectors.folderNames).contains(label.myComputer).click()
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.buttonList).contains(label.select).click()
    cy.get(userDirSelectors.roleCell).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(fileName).should('be.visible')
    cy.task('endSFTPConnection')
    const remoteFile = pathMove
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
  })

  // skipped because after copying files the dot navigation menu is still opened and user is unable to click on the qa-do-not-delete folder to verify
  it.skip('verify user can copy file', () => {
    dotNavigation('Copy')
    cy.get(userDirSelectors.folderNames).contains(label.myComputer).click()
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.buttonList).contains(label.select).click()

    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(fileName).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains('..').click()
    cy.task('endSFTPConnection')
    cy.task('sftpDirectoryExist', { pathMove, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')
  })

  afterEach('deleting a file', () => {
    dotNavigation('Delete')
  })
})
