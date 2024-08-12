import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import label from '../../../../../../fixtures/label.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify that admin can create users with custom home directory
 *
 * @issueID - NX-I729
 *
 * @breadcrumb
 * Login > {existing server} > users > add new user
 *
 * @assertions
 * To verify that admin can enter home directory while creating a new users
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)

describe('Login > {existing server} > users > add new user', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const userDetails = {
    userName: `qa-auto-user${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    homeDirectoryOption: `${label.customDir}`,
    customDirPath: `C:/qa-auto user ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(userSelectors.addButton).should('be.visible').click()
  })

  it('verify that admin can enter home directory while creating a new users', () => {
    cy.createUser(userDetails)
    cy.get(userSelectors.successMessage).should('be.visible')
    cy.editUser(userDetails.userName, label.editUserFileDirectories, false)
    cy.contains(htmlTagSelectors.div, userDetails.customDirPath.replace(/\//g, '\\')).should('exist')
    cy.get(userSelectors.btnLabel).contains(label.closeText).click()
  })

  afterEach('deleting a user', () => {
    cy.delete(userDetails.userName)
    cy.get(userSelectors.parentCell).contains(userDetails.userName).should('not.exist')
  })
})
