import label from '../../../../fixtures/label.json'
import htmlTagSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../selectors/user-dir-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify user directory operations for existing user
 *
 * @file
 * cypress\e2e\user\user-directory-commands-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing user}
 *
 * @assertions
 * verify user can download directory
 * verify user can share directory
 * verify user can drop zone directory
 * verify user can rename directory
 * verify user can move directory
 * verify user can copy directory
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing user}', () => {
  const userData = Cypress.env('user')
  const userInfo = {
    username: userData.directoryOperations.single,
    password: userData.Password
  }
  const folderName = 'qa-auto-folder'
  const renameFolderName = 'qa-auto-folder-new'
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: 'singledir',
    password: '123456'
  }

  function dotNavigation (operation) {
    cy.contains(htmlTagSelectors.div, folderName).parents(userDirSelectors.parentCell)
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
          cy.get(userDirSelectors.buttonList).eq(1).click()
          break
        case 'Drop Zone':
          cy.get(userDirSelectors.bulkDropZone).click()
          break
        case 'Rename':
          cy.get(userDirSelectors.bulkRename).click()
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
    cy.get(userDirSelectors.shareAsField).type(folderName)
    cy.get(userDirSelectors.toField).click()
    cy.get(userDirSelectors.toField).type(`${toUser}{enter}`)
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.next).click()
    cy.get(userDirSelectors.buttonList).contains(label.sendText).click()
  }

  beforeEach('login', () => {
    cy.login(userData.userBaseUrl, userInfo.username, userInfo.password)
    cy.get(htmlTagSelectors.p).then(($resp) => {
      if ($resp.text().includes(folderName)) {
        cy.log('file exists')
        dotNavigation('Delete')
      }
    })
    cy.get(userDirSelectors.addFolderIcon).click()
    cy.get(userDirSelectors.folderNameField).type(folderName)
    cy.get(userDirSelectors.buttonList).contains(label.add).click()
    cy.waitForNetworkIdle(1000, { log: false })
  })

  const pathMove = `qa-do-not-delete-folder/${folderName}`
  const pathRename = `/${renameFolderName}`

  it('verify user can download directory', () => {
    dotNavigation('Download')
    cy.verifyDownload(`${folderName}.zip`)
  })

  it('verify user can share directory', () => {
    dotNavigation('Share')
    enterShareInfo(label.sftpUser)
    cy.get(userDirSelectors.folderNames).contains(label.mySharesText).click()
    cy.get(userDirSelectors.folderNames).contains(folderName).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(label.myFilesText).click()
  })

  it('verify user can drop zone directory', () => {
    dotNavigation('Drop Zone')
    enterShareInfo(label.sftpUser)
    cy.get(userDirSelectors.folderNames).contains(label.mySharesText).click()
    cy.get(userDirSelectors.folderNames).contains(folderName).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains(label.myFilesText).click()
  })

  it('verify user can rename directory', () => {
    dotNavigation('Rename')
    cy.get(userDirSelectors.folderNameField).eq(1).clear()
    cy.get(userDirSelectors.folderNameField).eq(1).type(renameFolderName)
    cy.get(userDirSelectors.buttonList).contains(label.rename).click()
    cy.get(userDirSelectors.folderNames).contains(renameFolderName).should('be.visible')
    cy.task('endSFTPConnection')
    const remoteFile = pathRename
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')

    // changing it back to "autoFolder"
    dotNavigation('Rename')
    cy.get(userDirSelectors.folderNameField).eq(1).clear()
    cy.get(userDirSelectors.folderNameField).eq(1).type(folderName)
    cy.get(userDirSelectors.buttonList).contains(label.rename).click()
  })

  it('verify user can move directory', () => {
    dotNavigation('Move')
    cy.get(userDirSelectors.folderNames).contains(label.myComputer).click()
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.buttonList).contains(label.select).click()
    cy.wait(4000)
    cy.get(userDirSelectors.roleCell).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(folderName).should('be.visible')
    cy.task('endSFTPConnection')
    const remoteFile = pathMove
    cy.task('sftpDirectoryExist', { remoteFile, configSFTP }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
  })

  // skipped because after copying files the dot navigation menu is still opened and user is unable to click on the qa-do-not-delete folder to verify
  it.skip('verify user can copy directory', () => {
    dotNavigation('Copy')
    cy.get(userDirSelectors.folderNames).contains(label.myComputer).click()
    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.buttonList).contains(label.select).click()

    cy.get(userDirSelectors.folderNames).contains(label.qaAutoFolder).click()
    cy.get(userDirSelectors.folderNames).contains(folderName).should('be.visible')
    cy.get(userDirSelectors.folderNames).contains('..').click()
    cy.task('sftpDirectoryExist', pathMove).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"d"')
    })
    cy.task('endSFTPConnection')
  })

  afterEach('deleting a directory', () => {
    dotNavigation('Delete')
  })
})
