/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwenty-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwenty'

  it('all sftp operations for user testsftptwenty', () => {
    cy.runSftpOperations(username)
  })
})
