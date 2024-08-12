import label from '../../../../../../fixtures/label.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify that admin user can edit existing users and reset their password.
 *
 * @file
 * cypress/e2e/admin/server/users/admin-edit-user-reset-password-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing server} > existing users > edit > set user password
 *
 * @assertions
 * To verify ui-validation for required and password not match error messages
 * To verify admin can set new password for existing user
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 * - an existing user should exist for editing
 */

slowCypressDown(100)

describe('Login > {existing server} > existing users > edit > set user password', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
  })

  it('verify ui-validation for required and password not match error messages', () => {
    cy.contains(htmlTagSelectors.div, label.autoUserName).parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.get(userSelectors.parentUsers).contains(label.setUserPassword).click()
    cy.enterText(label.password, label.password)
    cy.clickButton(label.save)
    cy.get(userSelectors.confirmPasswordRequiredMessage).should('have.text', label.required)
    cy.enterText(label.confirmPassword, label.userName)
    cy.clickButton(label.save)
    cy.get(userSelectors.confirmPasswordRequiredMessage).should('have.text', label.passwordsDoNotMatch)
  })

  it.only('Verify admin can set new password for existing user', () => {
    cy.contains(htmlTagSelectors.div, label.autoUserName).parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.get(userSelectors.parentUsers).contains(label.setUserPassword).click()
    cy.enterText(label.password, label.password)
    cy.clickButton(label.save)
    cy.get(userSelectors.confirmPasswordRequiredMessage).should('have.text', label.required)
    cy.enterText(label.confirmPassword, label.password)
    cy.clickButton(label.save)
    cy.get(userSelectors.successMessage).should('exist')
    cy.wait(5000)
    cy.login('', label.autoUserName, label.password)
  })
})
