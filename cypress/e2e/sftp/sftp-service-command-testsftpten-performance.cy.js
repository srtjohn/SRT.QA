/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpten-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpten'

  it('all sftp operations for user testsftpten', () => {
    cy.runSftpOperations(username)
  })
})
