import label from '../../../../../../fixtures/label.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
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
    serverName: label.autoServerName
  }

  const year = Math.floor(Math.random() * (2024 - 2000 + 1)) + 2000
  const day = Math.floor(Math.random() * (30 - 1 + 1)) + 1
  const monthNum = Math.floor(Math.random() * (9 - 1 + 1)) + 1
  const date = `${monthNum.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`

  function navigateToAdvancedTab () {
    cy.get(htmlSelectors.div).then(resp => {
      if (!resp.text().includes(createUserDetails.username)) {
        cy.get(dashboardSelectors.usersPage).eq(1).scrollTo('bottom')
      }
    })
    cy.contains(htmlSelectors.div, createUserDetails.username).scrollIntoView().parents()
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).should('exist')
      .next(htmlSelectors.div).within(() => {
        cy.get(htmlSelectors.button).click({ force: true })
      })

    cy.get(userSelectors.parentUsers).contains(label.editUserConnections).click()
    cy.get(dashboardSelectors.tabWrapper).contains(label.advanced).click()
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
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    navigateToAdvancedTab()
    cy.get(dashboardSelectors.muiTypography).contains(label.userAccountExpire).prev(htmlSelectors.span).click().wait(1000).click()
      .then($resp => {
        if (!$resp.hasClass('Mui-checked')) {
          cy.get(dashboardSelectors.muiTypography).contains(label.userAccountExpire).prev(htmlSelectors.span).click()
        }
        cy.wrap($resp).should('have.class', 'Mui-checked')
      })
    // selecting interval as date
    cy.get(generalSelectors.labelRoot).contains(label.interval).next().click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.date).click()

    cy.get(dashboardSelectors.dateChange).parent().prev().clear().type(monthNum)
    cy.get(dashboardSelectors.dateChange).click()
    // select date
    cy.get(dashboardSelectors.dateContainer).within(() => {
      cy.get(dashboardSelectors.muiToolbar).within(() => {
        cy.get(htmlSelectors.button).eq(0).click()
      })
      cy.get(dashboardSelectors.yearPicker).contains(year).click()
      cy.get(dashboardSelectors.datePicker).within(() => {
        cy.get(dashboardSelectors.calenderWeek).each(($week) => {
          const dayFound = $week.find(htmlSelectors.button).toArray().some((el) => {
            return Cypress.$(el).text().trim() === day.toString()
          })
          if (dayFound) {
            cy.wrap($week).contains(dashboardSelectors.muiTypography, day).click({ force: true })
            return false
          }
        })
      })
    })
    cy.get(dashboardSelectors.dashBoardList).contains(label.ok).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.apply).click()
    cy.waitForNetworkIdle(3000, { log: false })
    cy.get(generalSelectors.close).click()
    navigateToAdvancedTab()
    cy.get(htmlSelectors.label).contains(label.expireDate).next(htmlSelectors.div).within(() => {
      cy.get(htmlSelectors.input).should('have.attr', 'value', date)
    })
  })
  afterEach('deleting new folder and user', () => {
    // calling delete user function
    cy.deleteUserApiRequest(createUserDetails.bearerToken, createUserDetails.serverName, createUserDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
