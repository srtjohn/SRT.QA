import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'

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
    userName: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    groupName: label.autoGroupName
  }
  const virtualDirectoryDetails = {
    actualPath: 'C:/gpdirone',
    virtualFolderName: 'gpDirOne'
  }

  beforeEach('login and create user', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // navigate to users
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(userSelectors.addButton).should('be.visible').click()
    // creating a new user
    cy.createUser(userDetails)
    cy.get(userSelectors.successMessage).should('be.visible')
    cy.get(htmlTagSelectors.div).then(resp => {
      if (!resp.text().includes(userDetails.userName)) {
        cy.get(dashboardSelectors.usersPage).eq(1).scrollTo('bottom')
      }
    })
    cy.get(userSelectors.parentCell).contains(userDetails.userName).scrollIntoView().should('be.visible')
  })

  it('verify that admin user can create a virtual directory on user level with same name after deleting', () => {
    cy.editUser(userDetails.userName, label.editUserFileDirectories, userDetails.password)
    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).click()
    cy.get(dashboardSelectors.domainDropDown).contains(label.virtualDirectoryAccess).parent().parent().parent(dashboardSelectors.gridRoot).next(htmlTagSelectors.div).click()
    // creating virtual directory
    cy.createVirtualDirectory(virtualDirectoryDetails)
    cy.get(userSelectors.successMessage).should('exist')
    // Clicking on edit button
    cy.contains(htmlTagSelectors.div, virtualDirectoryDetails.virtualFolderName).parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click()
      })
    // Deleting virtual directory created
    cy.deleteVirtualDirectory()
    cy.wait(5000)
    cy.get(generalSelectors.close).should('be.visible').click()
    // Clicking on edit button
    cy.editUser(userDetails.userName, label.editUserFileDirectories, userDetails.password)
    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).click()
    cy.get(dashboardSelectors.domainDropDown).contains(label.virtualDirectoryAccess).parent().parent().parent(dashboardSelectors.gridRoot).next(htmlTagSelectors.div).click()
    // Creating virtual directory with same name again
    cy.createVirtualDirectory(virtualDirectoryDetails)
    cy.get(userSelectors.successMessage).should('exist')
    // Again adding virtual directory with same name
    cy.get(userSelectors.successMessage).should('exist')
    cy.wait(5000)
    cy.get(generalSelectors.close).should('be.visible').click()
  })

  afterEach('deleting a user', () => {
    cy.delete(userDetails.userName)
    cy.get(userSelectors.parentCell).contains(userDetails.userName).should('not.exist')
  })
})
