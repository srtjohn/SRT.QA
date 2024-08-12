/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpfive-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpfive'

  it('all sftp operations for user testsftpfive', () => {
    cy.runSftpOperations(username)
  })
})
