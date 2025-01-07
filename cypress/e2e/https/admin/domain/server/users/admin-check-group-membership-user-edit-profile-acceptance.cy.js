import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import loginSelectors from '../../../../../../../selectors/login-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'

/**
 * @description
 * This spec file contains test to verify that editing user details in user ui does not affect group membership
 *
 * @IssueID NX-I1394
 *
 * @breadcrumb
 * Login > {existing server} > users > edit
 *
 * @assertions
 * To verify that editing user details in user ui does not affect group membership
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 * - an existing user should exist
 */

describe('Login > {existing server} > users > edit', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const userDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }
  const groupDetails = {
    groupName: label.autoGroupName
  }
  let userGUID
  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      userDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(userDetails).then(($response) => {
      expect($response.Response.Username).to.equal(userDetails.username)
      userGUID = $response.Response.UserGUID
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('Verify that during user edit, group membership is not affected', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    cy.get(dashboardSelectors.filterBox).realClick().wait(2000).type(userDetails.username)
    cy.contains(htmlTagSelectors.tableData, userDetails.username)
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).should('exist')
      .next(htmlTagSelectors.tableData).within(() => {
        cy.get(htmlTagSelectors.button).eq(0).click({ force: true })
      })
    cy.get(userDirSelectors.actionSelector).contains(label.editUserAssignedGroups).click()
    cy.clickButton(label.next)
    cy.contains(htmlTagSelectors.tableData, label.autoGroupName).prev(htmlTagSelectors.tableData)
      .within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.clickButton(label.next)
    cy.clickButton(label.finish)
    // login to user url
    cy.login('', userDetails.username, userDetails.password)
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(loginSelectors.profileIcon).eq(0).click()
    cy.waitForNetworkIdle(1000, { log: false })
    cy.get(dashboardSelectors.dashboardButton).contains(label.myProfile).should('be.visible').click()
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(dashboardSelectors.textInput).eq(0).type(`updated ${userDetails.username}`)
    cy.get(dashboardSelectors.titleApply).eq(0).click()
    // verify if user group membership is not affected
    cy.getGroupsInfoApiRequest(userDetails, groupDetails).then(($response) => {
      expect($response.Response.GroupName).to.equal(groupDetails.groupName)
      expect($response.Response.MemberUsers).to.have.property(userGUID)
    })
  })

  afterEach('delete user', () => {
    cy.deleteUserApiRequest(userDetails.bearerToken, userDetails.serverName, userDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
