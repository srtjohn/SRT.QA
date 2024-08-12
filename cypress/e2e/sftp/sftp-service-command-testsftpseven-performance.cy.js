/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpseven-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpseven'

  it('all sftp operations for user testsftpseven', () => {
    cy.runSftpOperations(username)
  })
})
