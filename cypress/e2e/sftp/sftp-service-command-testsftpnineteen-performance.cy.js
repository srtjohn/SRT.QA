/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpnineteen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpnineteen'

  it('all sftp operations for user testsftpnineteen', () => {
    cy.runSftpOperations(username)
  })
})
