import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
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
    customDirPath: `C:/qa-auto-user${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const configSFTP = {
    host: 'beta.southrivertech.com',
    port: '2200',
    username: userDetails.userName,
    password: userDetails.password
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(userSelectors.addButton).eq(0).should('be.visible').click()
  })

  it('verify that admin can enter home directory while creating a new users', () => {
    cy.createUser(userDetails)
    cy.get(dashboardSelectors.filterBox).realClick().wait(2000).type(userDetails.userName)
    cy.contains(htmlTagSelectors.tableData, userDetails.userName)
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(dashboardSelectors.dashboardButton).eq(0).click({ force: true })
      })
    cy.task('sftpCurrentWorkingDirectory', configSFTP).then(p => {
      expect(`${JSON.stringify(p)}`).to.equal('"/"')
      cy.task('endSFTPConnection')
    })
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.languageDropdown).contains(label.editUserFileDirectories).click()
    cy.contains(htmlTagSelectors.tableData, userDetails.customDirPath.replace(/\//g, '\\')).should('exist')
  })

  afterEach('deleting a user', () => {
    cy.contains(htmlTagSelectors.tableData, userDetails.userName)
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(dashboardSelectors.dashboardButton).eq(1).click({ force: true })
      })
    cy.get(dashboardSelectors.dashboardButton).contains(label.confirm).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(htmlTagSelectors.tableData).contains(userDetails.userName).should('not.exist')
  })
})
