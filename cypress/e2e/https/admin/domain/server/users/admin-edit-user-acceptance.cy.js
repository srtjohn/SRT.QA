import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
/**
 * @description
 * This spec file contains test to verify that admin user can edit users for an existing server
 *
 * @file
 * cypress/e2e/admin/server/users/admin-edit-user-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing server} > users > edit
 *
 * @assertions
 * To verify that during user edit, admin can assign a group to an existing user
 * To verify that user can Remove Assigned group
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 * - an existing user should exist
 */

slowCypressDown(300)

describe('Login > {existing server} > users > edit', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('Verify that during user edit, admin can assign a group to an existing user', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.editUser(label.autoUserName, label.editUserAssignedGroups, true)
    cy.get(userSelectors.successMessage).should('be.visible')
  })

  afterEach('verify that user can Remove Assigned group', () => {
    cy.editUser(label.autoUserName, label.editUserAssignedGroups, false)
    cy.get(userSelectors.successMessage).should('be.visible')
  })
})
