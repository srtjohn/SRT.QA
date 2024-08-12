/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpnine-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpnine'

  it('all sftp operations for user testsftpnine', () => {
    cy.runSftpOperations(username)
  })
})
