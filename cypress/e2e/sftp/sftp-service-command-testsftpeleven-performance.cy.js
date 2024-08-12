/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpeleven-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpeleven'

  it('all sftp operations for user testsftpeleven', () => {
    cy.runSftpOperations(username)
  })
})
