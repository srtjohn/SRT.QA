/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpeight-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpeight'

  it('all sftp operations for user testsftpeight', () => {
    cy.runSftpOperations(username)
  })
})
