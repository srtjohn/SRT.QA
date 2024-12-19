import { slowCypressDown } from 'cypress-slow-down'
import navigationSelectors from '../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../fixtures/label.json'
import generalSelectors from '../../../../../../../selectors/general-selectors.json'
import htmlSelectors from '../../../../../../../selectors/htlm-tag-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can add a ECDSA 521, ECDSA 256 and ECDSA 384 key
 *
 * @file
 * ui/cypress/e2e/server/security/admin-add-ECDSA-pgp-key-acceptance.cy.js
 *
 * @issueID - NX-I805
 *
 * @breadcrumb
 * login > create new server > security > PGP > manage PGP keys >Add ECDSA Key
 *
 * @assertions
 * To verify that admin is able to add a ECDSA 521, ECDSA 256 and ECDSA 384 key
 *
 */
slowCypressDown(100)

describe('login > create new server > security > PGP > manage PGP keys >Add ECDSA Key', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  const serverDetails = {
    serverName: `qa-auto server ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }
  const hostKeyDetails = {
    keyType: 'ECDSA',
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

  it('verify that user can add ECDSA 521 key', () => {
    hostKeyDetails.keySize = '521'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  it('verify that user can add ECDSA 256 key', () => {
    hostKeyDetails.keySize = '256'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  it('verify that user can add ECDSA 384 key', () => {
    hostKeyDetails.keySize = '384'
    cy.addServerKey(hostKeyDetails)
    cy.get(htmlSelectors.tableData).contains(hostKeyDetails.keyName).should('be.visible')
  })

  afterEach('deleting a server', () => {
    // deleting the created server
    cy.deleteServerApiRequest(serverDetails)
  })
})
