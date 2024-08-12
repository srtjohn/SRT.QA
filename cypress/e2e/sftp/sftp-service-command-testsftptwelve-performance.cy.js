/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwelve-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwelve'

  it('all sftp operations for user testsftptwelve', () => {
    cy.runSftpOperations(username)
  })
})
