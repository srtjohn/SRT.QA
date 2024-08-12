/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwentythree-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwentythree'

  it('all sftp operations for user testsftptwentythree', () => {
    cy.runSftpOperations(username)
  })
})
