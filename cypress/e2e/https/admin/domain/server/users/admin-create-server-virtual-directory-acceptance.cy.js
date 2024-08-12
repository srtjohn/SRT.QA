import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import serverSelectors from '../../../../../../../selectors/server-selectors.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import htmlTagSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'
import userSelectors from '../../../../../../../selectors/user/user-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can create virtual directory for a new server
 *
 * @file
 * cypress/e2e/admin/server/users/admin-create-server-virtual-directory-acceptance.cy.js
 *
 * @breadcrumb
 * Login > create new server > files/directories > virtual directory
 *
 * @assertions
 * To verify that admin can create a virtual directory
 * to verify that user can delete the virtual directory
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
describe('login > add new server ', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const serverDetails = {
    serverType: 'New standalone or primary cluster server.',
    selectDatabase: 'SQLite Database',
    serverName: `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const virtualDirectoryDetails = {
    actualPath: 'C:/gpdirone',
    virtualFolderName: 'gpdirone'
  }

  beforeEach('login', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      // Check if response type is api auth response
      expect($response.ResponseType).to.equal('ApiAuthResponse')
      // initializing bearer token
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })

    cy.postCreateServerApiRequest(serverDetails)

    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)

    cy.get(serverSelectors.serverName).contains(serverDetails.serverName).should('be.visible')
  })

  it('verify that user can create a virtual directory', () => {
    // navigate to files and directories
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(serverDetails.serverName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.filesDirectories).should('be.visible').click()
    // navigate to virtual directory tab

    cy.get(generalSelectors.roleTab).contains(label.virtualDirectoryAccess).should('be.visible').click()
    cy.get(userSelectors.addButton).should('be.visible').click()

    // adding virtual directory
    cy.createVirtualDirectory(virtualDirectoryDetails)

    cy.get(userSelectors.successMessage).should('exist')

    // clicking on edit button
    cy.contains(htmlTagSelectors.div, virtualDirectoryDetails.virtualFolderName).parents(userSelectors.parentCell)
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist')
      .next(htmlTagSelectors.div).should('exist').click()

    // deleting a virtual directory
    cy.deleteVirtualDirectory()

    cy.get(userSelectors.successMessage).should('exist')
    // navigating back to domain name
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
  })

  afterEach('deleting a server', () => {
    cy.deleteServer(serverDetails.serverName)
    cy.get(serverSelectors.serverName).contains(serverDetails.serverName).should('not.exist')
  })
})
