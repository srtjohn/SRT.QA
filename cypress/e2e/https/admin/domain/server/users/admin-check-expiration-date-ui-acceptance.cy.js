import label from '../../../../../../fixtures/label.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'

/**
 * @description
 * This spec file contains test to verify that user account expiration date is changed once it is set
 *
 * @issueID - NX-I1399
 *
 *
 * @breadcrumb
 * User Login > new user > connections
 *
 * @assertions
 * To verify that user account expiration date is changed
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(100)
describe('login', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const createUserDetails = {
    username: `qa-auto-user${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.ApiTestingAutomation
  }

  const date = Cypress.dayjs().add(Math.floor(Math.random() * 30), 'days').format('MM/DD/YYYY')

  function navigateToAdvancedTab () {
    cy.contains(htmlSelectors.tableData, createUserDetails.username)
      .next(htmlSelectors.tableData).should('exist')
      .next(htmlSelectors.tableData).should('exist')
      .next(htmlSelectors.tableData).should('exist')
      .next(htmlSelectors.tableData).should('exist')
      .next(htmlSelectors.tableData).within(() => {
        cy.get(dashboardSelectors.dashboardButton).eq(0).click({ force: true })
      })

    cy.get(dashboardSelectors.languageDropdown).contains(label.editUserConnections).click()
    cy.get(generalSelectors.roleTab).contains(label.advanced).click()
  }

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      expect($response.Response.SessionInfo.BearerToken).to.not.be.empty
      // initializing bearer token
      createUserDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(createUserDetails).then(($response) => {
      expect($response.Response.Username).to.equal(createUserDetails.username)
      // initializing AuthGUID
      createUserDetails.AuthGUID = $response.Response.AuthGUID
    })
  })

  it('verify that user account expiration date is changed', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.ApiTestingAutomation).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(dashboardSelectors.filterBox).realClick().wait(2000).type(createUserDetails.username)
    navigateToAdvancedTab()
    cy.get(navigationSelectors.textLabelSelector).contains(label.passwordExpiration).should('be.visible')
      .prev(htmlSelectors.div).click()
    cy.waitForNetworkIdle(1000, { log: false })
    // selecting interval as date
    cy.get(userDirSelectors.toField).realClick()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(generalSelectors.roleOption).contains(label.date).click()

    cy.get(htmlSelectors.label).should('contain.text', label.expireDate)
    cy.get(dashboardSelectors.textInput).eq(2).clear().wait(2000).type(date)
    // select date
    cy.get(dashboardSelectors.titleApply).eq(0).click()
    cy.get(generalSelectors.close).click()
    cy.waitForNetworkIdle(3000, { log: false })
    navigateToAdvancedTab()
    cy.get(htmlSelectors.label).should('contain.text', label.expireDate)
    cy.get(dashboardSelectors.textInput).eq(2).should('have.value', date)
  })
  afterEach('deleting user', () => {
    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
