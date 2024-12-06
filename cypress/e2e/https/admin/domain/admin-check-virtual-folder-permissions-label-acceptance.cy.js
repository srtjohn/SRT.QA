import navigationSelectors from '../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../fixtures/label.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
import htmlSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../selectors/dashboard-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin can see the permissions label for virtual directory
 *
 * @issueID
 * NX-I1308
 *
 * @breadcrumb
 * Login > {existing server} > files/Directories
 *
 * @assertions
 * verify that admin can see the permissions label for virtual directory
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

describe('Login > {existing server} > files/Directories', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }
  const virtualDirectoryDetails = {
    ActualPath: 'C://customefolder//dkjbfvdfkg',
    Path: `qa auto Directory${Cypress.dayjs().format('ssmmhhMMYY')}`,
    AllowAce: 'RWADNMVLIGSXU',
    DenyAce: '-------------'
  }
  const allowedPermissions = 'Allow: RWADNMVLIGS--, Deny: -----------XU'
  const deniedPermissions = 'Allow: --------I----, Deny: RWADNMVL-GSXU'
  const serverDetails = {
    serverName: label.ApiTestingAutomation
  }

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      virtualDirectoryDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerLevelVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
      expect($response.ResponseType).to.equal('ApiVirtualFolderPoco')
      virtualDirectoryDetails.Id = $response.Response.Id
      virtualDirectoryDetails.LinkId = $response.Response.LinkId
    })
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that admin can see the permissions label for virtual directory', () => {
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.ApiTestingAutomation).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.filesDirectories).should('be.visible').click()
    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).should('be.visible').click()
    cy.get(htmlSelectors.tableBody).contains(virtualDirectoryDetails.Path).should('be.visible').next(htmlSelectors.tableData).should('contain.text', allowedPermissions)
      .next(htmlSelectors.tableData, { scrollBehavior: false }).next(htmlSelectors.tableData, { scrollBehavior: false }).within(() => {
        cy.get(generalSelectors.titleEdit).click({ scrollBehavior: false })
      })
    cy.get(dashboardSelectors.rowSelect).eq(1).within(() => {
      cy.get(htmlSelectors.tableData).contains(label.checkAll).should('be.visible').next(htmlSelectors.tableData).next(htmlSelectors.tableData).within(() => {
        cy.get(htmlSelectors.div).click()
      })
    })
    cy.get(generalSelectors.button).contains(label.save).click()
    cy.waitForNetworkIdle(1500, { log: false })
    cy.get(htmlSelectors.tableBody).contains(virtualDirectoryDetails.Path).should('be.visible').next(htmlSelectors.tableData).should('contain.text', deniedPermissions)
  })

  afterEach('delete virtual directory through API', () => {
    // calling delete function
    cy.deleteUpdatedVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
