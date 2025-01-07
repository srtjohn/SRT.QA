import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
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

describe('Login > {existing server} > users > edit', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  function manageGroupMembership (isAdded) {
    cy.contains(htmlTagSelectors.tableData, label.autoUserName).scrollIntoView()
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(userSelectors.button).eq(0).click({ force: true })
      })
    cy.get(dashboardSelectors.languageDropdown).contains(label.editUserAssignedGroups).click()
    cy.clickButton(label.next)
    if (isAdded) {
      cy.get(dashboardSelectors.contentModal).within(() => {
        cy.get(htmlTagSelectors.tableData).contains(label.autoGroupName).scrollIntoView().prev(htmlTagSelectors.tableData)
          .within(() => {
            cy.get(htmlTagSelectors.button).contains(label.add).should('be.visible').click({ force: true })
          })
      })
    } else if (!isAdded) {
      cy.get(dashboardSelectors.contentModal).within(() => {
        cy.get(htmlTagSelectors.tableData).contains(label.autoGroupName).scrollIntoView().next(htmlTagSelectors.tableData)
          .within(() => {
            cy.get(htmlTagSelectors.button).contains(label.remove).should('be.visible').click({ force: true })
          })
      })
    }
    cy.waitForNetworkIdle(2000, { log: false })
    cy.clickButton(label.next)
    cy.clickButton(label.finish)
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('Verify that during user edit, admin can assign a group to an existing user', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.waitForNetworkIdle(1000, { log: false })
    manageGroupMembership(true)
  })

  afterEach('verify that user can Remove Assigned group', () => {
    manageGroupMembership(false)
  })
})
