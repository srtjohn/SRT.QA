/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftptwo-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftptwo'

  it('all sftp operations for user testsftptwo', () => {
    cy.runSftpOperations(username)
  })
})
