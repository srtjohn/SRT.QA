import label from '../../../../../../fixtures/label.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import serverSelectors from '../../../../../../../selectors/server-selectors.json'

/**
 * @description
 * This spec file contains test to verify that all virtual directory permissions are visible or not
 *
 * @file
 * cypress/e2e/admin/server/users/admin-check-virtual-directory-permissions-acceptance.cy.js
 *
 * @breadcrumb
 * User Login > check permissions
 *
 * @assertions
 * To verify that allowed permissions of a virtual directory are visible or not
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('login > add new virtual directory ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const CreateUserDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: CreateUserDetails.username,
    password: CreateUserDetails.password
  }

  const virtualDirectoryDetails = {
    ActualPath: 'C://gpdirone',
    Path: 'PermissionsTest',
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------'
  }
  const folder = 'testAutoFolder'
  const remoteDirPath = `./${virtualDirectoryDetails.Path}/${folder}`
  beforeEach('login and new virtual directory', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      CreateUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(CreateUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(CreateUserDetails.username)
      // initializing UserGUID
      CreateUserDetails.UserGUID = $response.Response.UserGUID
    })

    cy.postCreateUserVirtualDirectoryApiRequest(CreateUserDetails, virtualDirectoryDetails).then(($response) => {
      expect($response.Response.UserGroupGUID).to.equal(CreateUserDetails.UserGUID)
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })

  it('verifying permissions visibility', () => {
  // checking permissions
    cy.login('', CreateUserDetails.username, CreateUserDetails.password)
    cy.get(htmlTagSelectors.tableData).contains(virtualDirectoryDetails.Path).click()

    // creating new folder
    cy.get(dashboardSelectors.addNew).eq(0).click()
    cy.get(dashboardSelectors.contentModal).within(() => {
      cy.get(dashboardSelectors.textInput).type(folder)
    })
    cy.get(dashboardSelectors.dashboardButton).contains(label.add).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.contains(htmlTagSelectors.tableData, folder).prev(htmlTagSelectors.tableData).within(() => {
      cy.get(serverSelectors.serviceCheckboxContainer).realClick()
    })

    // checking permissions
    // delete permission
    cy.get(`${dashboardSelectors.userFileView} ${userDirSelectors.toolbar}`).within(() => {
      cy.get(userDirSelectors.bulkDownload).should('exist')
      cy.get(userDirSelectors.titleMove).should('exist')
      cy.get(userDirSelectors.titleCopy).should('exist')
      cy.get(userDirSelectors.bulkDelete).should('exist')
    })
  })

  afterEach('deleting new folder and user', () => {
  // deleting new folder
    cy.task('sftpRemoveDirectory', { configSFTP, remoteDirPath }).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"Successfully removed directory"')
      cy.task('endSFTPConnection')
    })
    // calling delete user function
    cy.deleteUserApiRequest(CreateUserDetails.bearerToken, CreateUserDetails.serverName, CreateUserDetails.username).then(($response) => {
    // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
