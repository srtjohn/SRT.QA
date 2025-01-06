import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can create a virtual directory on user level with same name after deleting
 *
 * @file
 * cypress/e2e/admin/server/users/admin-create-users-virtual-directory-with-same-parameters-acceptance.cy.js
 *
 * @issueID - NX-I1144
 *
 * @breadcrumb
 * Login > {existing server} > create new user > create virtual directory
 *
 * @assertions
 * To verify that admin user can create a virtual directory on user level with same name after deleting
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing server} > create new user > create virtual directory', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const userDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const virtualDirectoryDetails = {
    actualPath: 'C:/gpdirone',
    virtualFolderName: 'gpDirOne'
  }

  beforeEach('login and create user', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      userDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(userDetails).then(($response) => {
      expect($response.Response.Username).to.equal(userDetails.username)
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  function createVirtualDirectory () {
    cy.get(dashboardSelectors.addNew).eq(0).click()
    cy.get(dashboardSelectors.textInput).eq(2).type(virtualDirectoryDetails.actualPath, { scrollBehavior: false })
    cy.get(dashboardSelectors.textInput).eq(3).type(virtualDirectoryDetails.virtualFolderName, { scrollBehavior: false })
    cy.get(dashboardSelectors.dashboardButton).contains(label.save).click({ scrollBehavior: false })
  }

  function searchAndNavigate (username) {
    cy.get(dashboardSelectors.filterBox).realClick().wait(2000).type(username)
    cy.contains(htmlTagSelectors.tableData, userDetails.username)
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(htmlTagSelectors.button).eq(0).click({ force: true })
      })
  }

  it('verify that admin user can create a virtual directory on user level with same name after deleting', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    searchAndNavigate(userDetails.username)
    cy.get(userDirSelectors.actionSelector).contains(label.editUserFileDirectories).click()
    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).click()
    // creating virtual directory
    createVirtualDirectory()
    // deleting virtual directory
    cy.contains(htmlTagSelectors.tableData, virtualDirectoryDetails.virtualFolderName)
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(htmlTagSelectors.button).eq(1).click()
      })
    cy.get(dashboardSelectors.dashboardButton).contains(label.confirm).click()
    cy.wait(5000)
    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).click()
    // Creating virtual directory with same name again
    createVirtualDirectory()
    cy.wait(5000)
  })

  afterEach('deleting a user', () => {
    cy.deleteUserApiRequest(userDetails.bearerToken, userDetails.serverName, userDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
