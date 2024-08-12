import label from '../../../../../../fixtures/label.json'
import groupSelectors from '../../../../../../../selectors/groups/groups-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify that admin can crete groups with custom home home directory
 *
 * @file
 *  cypress/e2e/admin/server/groups/admin-create-groups-with-custom-home-directory-acceptance.cy.js
 *
 * @breadcrumb
 * Login > {existing admin server} > create group
 *
 * @assertions
 * verify user admin can create group with custom group directory
 * verify user admin can create group with custom group subdirectory
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(150)

describe('Login > {existing user}', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const groupDetails = {
    groupName: `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`,
    groupDescription: 'automation group',
    groupDirectoryOption: '',
    groupDirPath: 'C:/TitanFTP/Usr/'
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.groups).should('be.visible').click()
    cy.get(groupSelectors.addButton).should('be.visible').click()
  })

  it('verify user admin can create group with custom group directory', () => {
    groupDetails.groupDirectoryOption = label.groupDirectory
    cy.createGroup(groupDetails)
    cy.get(groupSelectors.parentCell).contains(groupDetails.groupName).should('be.visible')
  })

  it('verify user admin can create group with custom group subdirectory', () => {
    groupDetails.groupDirectoryOption = label.groupSubDirectory
    cy.createGroup(groupDetails)
    cy.get(groupSelectors.parentCell).contains(groupDetails.groupName).should('be.visible')
  })

  afterEach('deleting a user', () => {
    cy.delete(groupDetails.groupName)
    cy.get(groupSelectors.parentCell).contains(groupDetails.groupName).should('not.exist')
  })
})
