import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'

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
    cy.editUser(userDetails.username, label.editUserAssignedGroups, true)
    // login to user url
    cy.login('', userDetails.username, userDetails.password)
    cy.get(dashboardSelectors.profileIcon).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.myProfile).should('be.visible').click()
    cy.get(userSelectors.usernameField).type(`updated ${userDetails.username}`)
    cy.get(dashboardSelectors.dashBoardList).contains(label.save).click()
    // verify if user group membership is not affected
    cy.getGroupsInfoApiRequest(userDetails, groupDetails).then(($response) => {
      expect($response.Response.GroupName).to.equal(groupDetails.groupName)
      expect($response.Response.MemberUsers).to.have.property(userGUID)
    })
  })

  afterEach('delete user', () => {
    cy.deleteUserApiRequest(userDetails.bearerToken, userDetails.serverName, userDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('Success')
    })
  })
})
