/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwentytwo-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwentytwo'

  it('all sftp operations for user testsftptwentytwo', () => {
    cy.runSftpOperations(username)
  })
})
