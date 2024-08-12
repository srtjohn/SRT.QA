/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwentyone-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwentyone'

  it('all sftp operations for user testsftptwentyone', () => {
    cy.runSftpOperations(username)
  })
})
