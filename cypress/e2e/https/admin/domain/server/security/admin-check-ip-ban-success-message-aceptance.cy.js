import label from '../../../../../../fixtures/label.json'
import serverSelectors from '../../../../../../../selectors/server-selectors.json'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'
import dashboardSelectors from '../../../../../../../selectors/dashboard-selectors.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains test to verify the success message is visible when an ip address is banned and deleted
 *
 * @issueID - NX-I1285
 *
 * @breadcrumb
 * Login > New Server > Security > IP Bans
 *
 * @assertions
 * To verify that the success message is visible
 *
 *  @prerequisites
 * valid user credentials
 * - user should have valid credentials
 *
 */

describe('Login > New Server > Security > IP Bans', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const serverDetails = {
    serverName: `qa auto server${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const ipAddress = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')

  beforeEach('login through api', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerApiRequest(serverDetails).then(($response) => {
      expect($response.Result.ErrorStr).to.equal('Success')
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(serverSelectors.serverName).contains(serverDetails.serverName).should('be.visible')
    // navigate to services
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(serverDetails.serverName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.security).should('be.visible').click()
  })

  it('verify that the success message is visible', () => {
    cy.get(dashboardSelectors.muiTypography).contains(label.ipAccessBans).click()
    cy.get(userSelectors.addButton).should('be.visible').click()
    cy.get(dashboardSelectors.ipAccessInput).type(ipAddress).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.add).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.apply).click()
    cy.get(userSelectors.successMessage).should('be.visible')
    cy.waitForNetworkIdle(2000, { log: false })
    cy.get(userSelectors.successMessage).should('not.exist')
    cy.get(dashboardSelectors.rowGroup).eq(1).within(() => {
      cy.get(htmlSelectors.div).eq(2).should('have.text', ipAddress).click()
    })
    cy.get(userSelectors.deleteButton).click()
    cy.get(dashboardSelectors.dashBoardList).contains(label.apply).click()
    cy.get(userSelectors.successMessage).should('be.visible')
  })

  afterEach('delete server through API', () => {
    // calling delete function
    cy.deleteServerApiRequest(serverDetails).then(($response) => {
      // check if request is successful or not
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
