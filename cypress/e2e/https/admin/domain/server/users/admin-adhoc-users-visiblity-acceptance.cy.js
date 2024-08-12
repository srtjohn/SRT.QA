import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can see the adhoc users after switching from Native, ADSI, NTSAM and LDAP Tabs
 *
 * @issueID NX-I1147
 *
 * @breadcrumb
 * Login > {existing server} > users
 *
 * @assertions
 * To verify that native users are displayed successfully after switching tabs
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe.skip('Login > {existing server} > users > Adhoc', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  function lookForUser (tabName, userName) {
    cy.get(generalSelectors.roleTab).contains(label.usersADSITab).click()
    cy.wait(5000)
    cy.get(generalSelectors.roleTab).contains(label.usersNATIVETab).click()
    cy.wait(20000)
    cy.get(userSelectors.parentCell).contains(label.autoUserName).should('be.visible')
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
  })

  it('verify that native users are displayed successfully after switching tabs', () => {
    // assertion when user switch from ADSI tab
    lookForUser(label.usersADSITab, label.autoUserName)

    // assertion when user switch from LDAP tab
    lookForUser(label.usersLDAPTab, label.autoUserName)

    // assertion when user switch from NTSAM tab
    lookForUser(label.usersNTSAMTab, label.autoUserName)
  })
})
