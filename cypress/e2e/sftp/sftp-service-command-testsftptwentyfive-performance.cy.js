/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwentyfive-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwentyfive'

  it('all sftp operations for user testsftptwentyfive', () => {
    cy.runSftpOperations(username)
  })
})
