import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import userDirSelectors from '../../../../../../../selectors/user-dir-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains test to verify that editing user details in user ui does not affect group membership
 *
 * @IssueID NX-I1209
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
  const fileName = 'NewFile-Do-Not-Delete.txt'
  const userDetails = {
    username: `qa-auto-user-${Cypress.dayjs().format('ssmmhhMMYY')}`,
    password: 'testing123',
    serverName: label.autoServerName
  }

  function setDirectoryToGroup (username, menuOption) {
    cy.contains(htmlTagSelectors.div, username).scrollIntoView().parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.get(userSelectors.parentUsers).contains(menuOption).click()
    cy.clickButton(label.next)
    cy.contains(htmlTagSelectors.div, label.autoGroupName).parents(userSelectors.parentCell)
      .prev(htmlTagSelectors.div).within(() => {
        cy.get(htmlTagSelectors.button).click({ force: true })
      })
    cy.clickButton(label.next)
  }

  function clickOnDropdown (tabLabel) {
    cy.get(userSelectors.userInfoDialog).within(() => {
      cy.get(userSelectors.selectGroupOptionsDialog).eq(2).within(() => {
        cy.get(userDirSelectors.gridItem).contains(tabLabel).next().click()
      })
    })
  }
  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      userDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateUserApiRequest(userDetails).then(($response) => {
      expect($response.Response.Username).to.equal(userDetails.username)
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })
  it('Verify that during user edit, group membership is not affected', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.users).should('be.visible').click()
    setDirectoryToGroup(userDetails.username, label.editUserAssignedGroups)
    clickOnDropdown(label.primaryGroup)
    cy.get(userDirSelectors.buttonList).contains(label.autoGroupName).click()
    clickOnDropdown(label.homeDir)
    cy.get(userDirSelectors.buttonList).contains(label.inheritFromGroup).click()
    cy.clickButton(label.finish)
    cy.login('', userDetails.username, userDetails.password)
    cy.contains(htmlTagSelectors.div, fileName).parents(userDirSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).click()
    cy.get(userDirSelectors.editParent).eq(5).within(() => {
      cy.get(userDirSelectors.bulkDownload).click()
    })
  })

  afterEach('delete user', () => {
    cy.deleteUserApiRequest(userDetails.bearerToken, userDetails.serverName, userDetails.username).then(($response) => {
      // check if ErrorStr is Success
      expect($response.Result.ErrorStr).to.eq('_Error.SUCCESS')
    })
  })
})
