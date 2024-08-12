import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import label from '../../../../../../fixtures/label.json'
/**
 * @description
 * This spec file contains test to verify ui validation while admin creates users for an existing server
 *
 * @file
 * cypress\e2e\admin\server\users\admin-create-users-ui-validation-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing server} > users > add new user
 *
 * @assertions
 * To verify that error message is displayed when user didn\'t enter username
 * To verify that error message is displayed when user didn\'t enter password
 * To verify that error message is displayed when user didn\'t enter confirm password
 * To verify that error message is displayed when confirm password doesn\'t match with password
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('Login > {existing server} > users > add new user', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const userDetails = {
    userName: `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123'
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // Navigate to users page
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(userSelectors.addButton).should('be.visible').click()
  })

  it('Verify that Error Message is displayed when User didn\'t enter Username', () => {
    cy.enterText(label.password, userDetails.password)
    cy.enterText(label.confirmPassword, userDetails.userName)
    cy.clickButton(label.next)
    cy.get(userSelectors.usernameRequiredMessage).should('have.text', label.required)
  })

  it('Verify that Error Message is displayed when User didn\'t enter Password', () => {
    cy.enterText(label.userName, userDetails.userName)
    cy.enterText(label.confirmPassword, userDetails.userName)
    cy.clickButton(label.next)
    cy.get(userSelectors.passwordRequiredMessage).should('have.text', label.required)
  })

  it('Verify that Error Message is displayed when User didn\'t enter Confirm Password', () => {
    cy.enterText(label.userName, userDetails.userName)
    cy.enterText(label.password, userDetails.password)
    cy.clickButton(label.next)
    cy.get(userSelectors.confirmPasswordRequiredMessage).should('have.text', label.required)
  })

  it('Verify that Error Message is displayed when Confirm Password doesn\'t match with Password', () => {
    cy.enterText(label.userName, userDetails.userName)
    cy.enterText(label.password, userDetails.password)
    cy.enterText(label.confirmPassword, userDetails.userName)
    cy.clickButton(label.next)
    cy.get(userSelectors.confirmPasswordRequiredMessage).should('have.text', label.passwordsDoNotMatch)
  })
})
