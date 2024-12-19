import label from '../../../../fixtures/label.json'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../selectors/user-dir-selectors.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
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
    cy.contains(htmlTagSelectors.tableData, file,{ scrollBehavior: false })
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).click({ scrollBehavior: false })
    cy.get(userDirSelectors.actionSelector).within(() => {
      switch (operation) {
        case 'Download':
          cy.get(userDirSelectors.bulkDownload).click()
          break
        case 'Share':
          cy.get(userDirSelectors.bulkShare).click()
          break
        case 'Drop Zone':
          cy.get(userDirSelectors.bulkDropZone).click()
          break
        case 'Rename':
          cy.get(userDirSelectors.fileRename).click()
          break
        case 'Move':
          cy.get(userDirSelectors.fileMove).click()
          break
        case 'Copy':
          cy.get(userDirSelectors.fileCopy).click()
          break
        case 'Delete':
          cy.get(userDirSelectors.bulkDelete).click()
          break
      }
    })
  }

  function enterShareInfo (toUser) {
    cy.get(userDirSelectors.quickSendDialog).within(() => {
      cy.get(generalSelectors.textEdit).eq(0).click({ force: true }).type(fileName)
      cy.get(generalSelectors.textEdit).eq(1).click().type(`${toUser}{enter}`)
    })
    cy.get(generalSelectors.button).contains(label.next).click()
    cy.get(generalSelectors.button).contains(label.next).click()
    cy.get(generalSelectors.button).contains(label.finish).click()
  }

  beforeEach('login', () => {
    cy.login(userData.userBaseUrl, userInfo.username, userInfo.password)
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(htmlTagSelectors.tableData).then(($resp) => {
      if ($resp.text().includes(fileName)) {
        cy.log('file exists')
        dotNavigation('Delete')
        cy.get(htmlTagSelectors.tableData).contains(fileName).should('not.exist')
        cy.log('file deleted')
      }
    })
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(userDirSelectors.fileUpload).selectFile('cypress/fixtures/local.txt', { action: 'drag-drop', force: true })
    cy.waitForNetworkIdle(2000, { log: false })
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
    cy.get(generalSelectors.textSelector).contains(label.mySharesText).click()
    cy.get(htmlTagSelectors.tableData).contains(fileName).should('be.visible')
    cy.get(generalSelectors.textSelector).contains(label.myFilesText).click()
  })

  it('verify user can rename file', () => {
    dotNavigation('Rename')
    cy.get(userDirSelectors.inputField).eq(1).clear()
    cy.get(userDirSelectors.inputField).eq(1).type(renameFileName)
    cy.get(generalSelectors.button).contains(label.rename).click()
    cy.get(htmlTagSelectors.tableData).contains(renameFileName).should('be.visible')
    cy.task('endSFTPConnection')
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"-"')
    })
    cy.task('endSFTPConnection')

    // changing it back to "autoFolder"
    dotNavigation('Rename', renameFileName)
    cy.get(userDirSelectors.inputField).eq(1).clear()
    cy.get(userDirSelectors.inputField).eq(1).type(fileName)
    cy.get(generalSelectors.button).contains(label.rename).click()
  })

  it.skip('verify user can move file', () => {
    dotNavigation('Move')
    cy.get(htmlTagSelectors.div).contains(label.myComputer).parent().parent().click().prev(generalSelectors.button).click()
    cy.waitForNetworkIdle(1500, { log: false })
    cy.get(generalSelectors.textSelector).contains(label.qaAutoFolder).realClick({force: true, scrollBehavior: false })
    cy.get(generalSelectors.button).contains(label.select).click()
    cy.get(htmlTagSelectors.tableData).contains(label.qaAutoFolder).click()
    cy.get(htmlTagSelectors.tableData).contains(fileName).should('be.visible')
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
    cy.get(htmlTagSelectors.div).contains(label.myComputer).click().prev(generalSelectors.button).click()
    cy.get(htmlTagSelectors.div).contains(label.qaAutoFolder).click()
    cy.get(generalSelectors.button).contains(label.select).click()
    cy.get(htmlTagSelectors.tableData).contains(label.qaAutoFolder).should('be.visible').click({force: true})
    cy.get(htmlTagSelectors.tableData).contains(fileName).should('be.visible')
    cy.get(htmlTagSelectors.tableData).contains('..').click()
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
