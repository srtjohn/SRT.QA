import serverSelectors from '../../../../../../../../selectors/server-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
import navigationSelectors from '../../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../../fixtures/label.json'
import generalSelectors from '../../../../../../../../selectors/general-selectors.json'
import userSelectors from '../../../../../../../../selectors/user/user-selectors.json'

/**
 * @description
 * This spec file contains test to verify that admin user can add a DSA 1024 key
 *
 * @file
 * ui/cypress/e2e/server/services/SSH/admin-add-DSA-ssh-hostkey-acceptance.cy.js
 *
 * @issueID - NX-I1100
 *
 * @breadcrumb
 * login > create new server > services > SSH > Add DSA Key
 *
 * @assertions
 * To verify that admin is able to add a DSA 1024 key
 *
 */
slowCypressDown(100)

describe('login > create new server > services > SSH > Add DSA Key', () => {
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
    keyType: 'DSA',
    keySize: '1024',
    keyName: `qa-auto key ${Cypress.dayjs().format('ssmmhhMMYY')}`
  }

  beforeEach('login and create server', () => {
    cy.postLoginAuthenticateApiRequest(userInfo).then(($response) => {
      serverDetails.bearerToken = $response.Response.SessionInfo.BearerToken
    })
    cy.postCreateServerApiRequest(serverDetails)
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(serverSelectors.serverName).contains(serverDetails.serverName).should('be.visible')
    // navigate to services
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(serverDetails.serverName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.services).should('be.visible').click()
    // clicking on SSH/SFTP tab
    cy.get(generalSelectors.roleTab).contains(label.sshSftpText).should('be.visible').click()
    cy.get(generalSelectors.typeButton).contains(label.manageHostKeys).should('be.visible').click()
  })

  it('verify that user can add DSA 1024 key', () => {
    cy.addServerKey(hostKeyDetails)
    cy.get(userSelectors.successMessage).should('be.visible')
  })

  afterEach('deleting a server', () => {
    // deleting the created server
    cy.deleteServerApiRequest(serverDetails)
    cy.get(serverSelectors.serverName).contains(serverDetails.serverName).should('not.exist')
  })
})
