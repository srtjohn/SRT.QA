import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
/**
 * @description
 * This spec file contains test to verify ad/ldap edit user bug
 *
 * @issueID - NX-i1088
 *
 * @breadcrumb
 * Login > {existing server} > users
 *
 * @assertions
 * To verify that LDAP users can be edited successfully
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(200)

describe.skip('Login > {existing server} > users', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const oldEmail = 'qa-bug-user-email-@gmail.com'
  const updateEmail = `qaEmail_${Cypress.dayjs().format('ssmmhhMMYY')}@srt.com`
  const userToUpdate = 'demo'

  function editUserSteps (emailAddress) {
    cy.contains(htmlSelectors.div, userToUpdate).parents(userSelectors.parentCell)
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).click()
    cy.get(userSelectors.parentUsers).contains(label.editUserAssignedGroups).click()
    cy.get(userSelectors.emailAddressField).clear().type(emailAddress)
    cy.clickButton(label.next)
    cy.clickButton(label.finish)
    cy.get(userSelectors.successMessage).contains('success').should('be.visible')
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.wait(3000)
    cy.get(generalSelectors.roleTab).contains(label.usersLDAPTab).click()
    cy.wait(5000)
  })

  it('To verify that ADSI users can be edited successfully', () => {
    editUserSteps(updateEmail)
    // assertion
    cy.contains(htmlSelectors.div, userToUpdate).parents(userSelectors.parentCell)
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).contains(updateEmail).should('be.visible')
  })

  afterEach('reverting the changes', () => {
    editUserSteps(oldEmail)
    // assertion
    cy.contains(htmlSelectors.div, userToUpdate).parents(userSelectors.parentCell)
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).contains(oldEmail).should('be.visible')
  })
})
