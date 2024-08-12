import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can edit username for an existing user
 *
 * @file
 * cypress/e2e/admin/server/users/admin-edit-username-acceptance.cy.js
 *
 * @issueID - NX-I1182
 *
 * @breadcrumb
 * Login > {existing server} > users > edit
 *
 * @assertions
 * To verify that during user edit, admin cannot edit username for an existing user
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 * - an existing user should exist
 */

slowCypressDown(300)

// skipped because of issue NX-I1182
describe.skip('Login > {existing server} > users > edit', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const username = 'testsftp'

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('Verify that during user edit, admin can assign a group to an existing user', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.contains(htmlTagSelectors.div, username).scrollIntoView().parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.get(dashboardSelectors.dashBoardList).contains(label.editUserAssignedGroups).click()
    cy.get(userDirSelectors.usernameLabel).contains(label.userName).next(htmlTagSelectors.div).should('have.attr', 'readonly')
  })
})
