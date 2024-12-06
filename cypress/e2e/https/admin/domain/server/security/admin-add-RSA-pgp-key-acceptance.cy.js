import { slowCypressDown } from 'cypress-slow-down'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can add a RSA 1024, RSA 2048 and RSA 4096 key
 *
 * @file
 * ui/cypress/e2e/server/security/admin-add-RSA-pgp-key-acceptance.cy.js
 *
 * @issueID - NX-I805
 *
 * @breadcrumb
 * login > create new server > security > PGP > manage PGP keys >Add RSA Key
 *
 * @assertions
 * To verify that admin is able to add a RSA 1024, RSA 2048 and RSA 4096 key
 *
 */
slowCypressDown(100)

describe('login > create new server > security > PGP > manage PGP keys >Add RSA Key', () => {
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
  const hostKeyDetails = {
    keyType: 'RSA',
    keyName: `qa-auto key ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }

  beforeEach('login and create server', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerApiRequest(serverDetails)
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    // navigate to services
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(serverDetails.serverName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.security).should('be.visible').click()
    cy.get(generalSelectors.roleTab).contains(label.pgp).should('be.visible').click()
    // clicking on checkbox
    cy.get(generalSelectors.textSelector).contains(label.pgpModeEnabled).prev({ scrollBehavior: false }).click({ scrollBehavior: false })
    cy.get(generalSelectors.button).contains(label.managePgpKeys).should('be.visible').click()
  })

  it('verify that user can add RSA 1024 key', () => {
    hostKeyDetails.keySize = '1024'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  it('verify that user can add RSA 2048 key', () => {
    hostKeyDetails.keySize = '2048'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  it('verify that user can add RSA 4096 key', () => {
    hostKeyDetails.keySize = '4096'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  afterEach('deleting a server', () => {
    // deleting the created server
    cy.deleteServerApiRequest(serverDetails)
  })
})
