import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can see NT/SAM users and Groups
 *
 * @issueID NX-I1184
 *
 * @breadcrumb
 * Login > {existing server} > users & groups > NT/SAM
 *
 * @assertions
 * To verify that NT/SAM users and Groups are visible
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing server} > users & groups > NT/SAM ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.NTSAM).should('be.visible').click()
  })

  it('verify that NT/SAM groups and users are present', () => {
    // verify if group is present or not
    cy.get(navigationSelectors.textLabelSelector).contains(label.groups).click()
    cy.get(generalSelectors.roleTab).contains(label.usersNTSAMTab).click()
    cy.wait(2000)
    cy.get(userDirSelectors.roleGrid).contains(label.NTSAMGroupName).should('be.visible')

    // verify whether user is present or not
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).click()
    cy.get(generalSelectors.roleTab).contains(label.usersNTSAMTab).click()
    cy.wait(2000)
    cy.get(userDirSelectors.roleGrid).contains(label.NTSAMUserName).should('be.visible')
  })
})
