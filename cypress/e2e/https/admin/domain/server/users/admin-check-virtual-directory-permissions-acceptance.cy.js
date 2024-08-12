import label from '../../../../../../fixtures/label.json'
import loginSelectors from '../../../../../../../selectors/login-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'

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
 * To verify that allowed permissions of a virtual directory are working or not
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

  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: 'gpdirone',
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------'
  }

  const folder = 'autoFolder'
  beforeEach('login and new virtual directory', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      CreateUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(CreateUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(CreateUserDetails.username)
      // initializing AuthGUID
      CreateUserDetails.AuthGUID = $response.Response.AuthGUID
    })

    cy.postCreateUserVirtualDirectoryApiRequest(CreateUserDetails, virtualDirectoryDetails).then(($response) => {
      expect($response.Response.UserGroupGUID).to.equal(CreateUserDetails.AuthGUID)
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })

  it('verifying permissions visibility', () => {
  // checking permissions

    cy.visit(Cypress.env('baseUrl'))
    cy.get(loginSelectors.inputUsername).type(CreateUserDetails.username)
    cy.get(loginSelectors.inputPassword).type(CreateUserDetails.password)
    cy.get(loginSelectors.loginButton).contains(label.login).click()
    cy.get(userDirSelectors.roleCell).contains(virtualDirectoryDetails.Path).click()

    // creating new folder

    cy.get(userDirSelectors.addFolderIcon).click()
    cy.get(userDirSelectors.folderNameField).type(folder)
    cy.get(userDirSelectors.buttonList).contains(label.add).click()
    cy.contains(userDirSelectors.roleCell, folder)
      .prev(htmlTagSelectors.div).click()

    // checking permissions

    // delete permission
    cy.contains(userDirSelectors.parentUsers, label.oneItem).next(htmlTagSelectors.div).within(() => {
      cy.get(userDirSelectors.bulkDelete).should('be.visible')
    })
    // copy permission
    cy.contains(userDirSelectors.parentUsers, label.oneItem).next(htmlTagSelectors.div).within(() => {
      cy.get(userDirSelectors.bulkCopy).should('be.visible')
    })
    // move permission
    cy.get(userDirSelectors.buttonList).eq(3).should('be.visible')
    // share permission
    cy.get(userDirSelectors.buttonList).eq(2).should('be.visible')
    // download permission
    cy.contains(userDirSelectors.parentUsers, label.oneItem).next(htmlTagSelectors.div).within(() => {
      cy.get(userDirSelectors.bulkDownload).should('be.visible')
    })
  })
  afterEach('deleting new folder and user', () => {
    // deleting new folder
    cy.contains(userDirSelectors.roleCell, folder)
      .prev(htmlTagSelectors.div).click()
    cy.contains(htmlTagSelectors.div, folder).parents(userDirSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).click()
    cy.get(userDirSelectors.editParent).eq(5).within(() => { cy.get(userDirSelectors.bulkDelete).click() })
    // calling delete user function
    cy.deleteUserApiRequest(CreateUserDetails.bearerToken, CreateUserDetails.serverName, CreateUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
