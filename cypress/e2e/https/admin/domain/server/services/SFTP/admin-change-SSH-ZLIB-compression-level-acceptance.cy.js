import navigationSelectors from '../../../../../../../../selectors/navigation/left-navigation-selectors.json'
import label from '../../../../../../../fixtures/label.json'
import sshSftpSelectors from '../../../../../../../../selectors/services-selectors.json'
import generalSelectors from '../../../../../../../../selectors/general-selectors.json'
import { slowCypressDown } from 'cypress-slow-down'
/**
 * @description
 * This spec file contains test to verify that admin can change the SSH ZLIB compression value
 *
 * @issueID - NX-i1129
 *
 * @breadcrumb
 * Login > {existing server} > services > SSH/SFTP > SSH > ZLIB compression level
 *
 * @assertions
 * To verify that admin can change the SSH ZLIB compression value
 *
 * @prerequisites
 * Pre-Requisite data:
 * - user should have valid credentials
 */

slowCypressDown(300)

const inputValue = '6'

describe('Login > {existing server} > services > SSH/SFTP', () => {
  const adminData = Cypress.env('admin')
  const userInfo = {
    username: adminData.adminUsername,
    password: adminData.adminPassword
  }

  beforeEach('login', () => {
    cy.login(adminData.adminBaseUrl, userInfo.username, userInfo.password)
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoDomainName).click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.autoServerName).should('be.visible').click()
    cy.get(navigationSelectors.textLabelSelector).contains(label.services).should('be.visible').click()
  })

  it('verify that admin can change the SSH ZLIB compression value', () => {
    cy.get(generalSelectors.roleTab).contains(label.sshSftpText).click()
    cy.get(sshSftpSelectors.advancedSection).within(() => {
      cy.get(sshSftpSelectors.numericInput).eq(0).clear().type(inputValue)
      cy.get(sshSftpSelectors.numericInput).eq(0)
        .invoke('val').then(textValue => {
          expect(textValue).to.equal(inputValue)
        })
    })
  })
})
