/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpthree-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpthree'

  it('all sftp operations for user testsftpthree', () => {
    cy.runSftpOperations(username)
  })
})
