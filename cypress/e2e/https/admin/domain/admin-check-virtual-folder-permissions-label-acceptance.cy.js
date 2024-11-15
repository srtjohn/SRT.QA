import navigationSelectors from '../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../fixtures/label.json'
import generalSelectors from '../../../../../selectors/general-selectors.json'
import htmlSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import dashboardSelectors from '../../../../../selectors/dashboard-selectors.json'
import serverSelectors from '../../../../../selectors/server-selectors.json'

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
    cy.get(generalSelectors.roleCell).contains(allowedPermissions).should('be.visible').parents(htmlSelectors.div).eq(1).next().next().click()
    cy.get(dashboardSelectors.permissionsTable).within(() => {
      cy.get(serverSelectors.parent).contains(label.checkAll).should('be.visible').next(serverSelectors.parent).next(serverSelectors.parent).within(() => {
        cy.get(htmlSelectors.span).eq(1).click().wait(2000).click()
      })
    })
    cy.get(dashboardSelectors.dashBoardList).contains(label.edit).click()
    cy.get(generalSelectors.roleCell).contains(deniedPermissions).should('be.visible')
  })

  afterEach('delete virtual directory through API', () => {
    // calling delete function
    cy.deleteUpdatedVirtualDirectoryApiRequest(virtualDirectoryDetails, serverDetails).then(($response) => {
      expect($response.Result.ErrorStr).to.equal('Success')
    })
  })
})
