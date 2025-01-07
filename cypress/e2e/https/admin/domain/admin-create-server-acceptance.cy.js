import htmlSelectors from '../../../../../selectors/htlm-tag-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
/**
 * @description
 * This spec file contains test to verify that admin user can create a server
 *
 * @file
 * ui/cypress/e2e/server/admin-create-server-acceptance.cy.js
 *
 * @breadcrumb
 * Login > Add new
 *
 * @assertions
 * To verify that admin is able to create server with required parameters
 *
 *  @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */
slowCypressDown(100)

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

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
  })

  it('verify that admin is able to create server with required parameters', () => {
    cy.createServer(serverDetails)
    cy.get(htmlSelectors.tableData).contains(serverDetails.serverName).should('be.visible')
  })

  afterEach('deleting a server', () => {
    cy.deleteServer(serverDetails.serverName)
    cy.get(htmlSelectors.tableData).contains(serverDetails.serverName).should('not.exist')
  })
})
