/**
 * @description
 * This spec file contains test to verify all sftp operations
 *
 * @file
 * cypress/e2e/sftp/sftp-service-command-testsftpthirteen-performance.cy.js
 */

describe('all sftp operations', () => {
  const username = 'testsftpthirteen'

  it('all sftp operations for user testsftpthirteen', () => {
    cy.runSftpOperations(username)
  })
})
